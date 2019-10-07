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
},{"inherits":"../node_modules/inherits/inherits_browser.js","events":"../node_modules/node-libs-browser/node_modules/events/events.js","right-now":"../node_modules/right-now/browser.js","raf":"../node_modules/raf/index.js"}],"js/utils/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClosestColour = exports.getInterpolatedColours = exports.colourInterpolate = exports.color = exports.shuffle = exports.clamp = exports.distance = exports.mapRange = exports.randomBetween = exports.interpolate = exports.trackMouse = void 0;

var trackMouse = function trackMouse() {
  window.mouseX = 0;
  window.mouseY = 0;
  document.getElementById('canvas').addEventListener('mousemove', function (e) {
    window.mouseX = e.x - e.target.offsetLeft;
    window.mouseY = e.y - e.target.offsetTop;
  });
};

exports.trackMouse = trackMouse;

var interpolate = function interpolate(t, n1, n2) {
  return (n2 - n1) * t + n1;
};

exports.interpolate = interpolate;

var randomBetween = function randomBetween(min, max) {
  return (max - min) * Math.random() + min;
};

exports.randomBetween = randomBetween;

var mapRange = function mapRange(v, r1l, r1u, r2l, r2u) {
  return r2l + (r2u - r2l) * (v - r1l) / (r1u - r1l);
};

exports.mapRange = mapRange;

var distance = function distance(x1, y1, x2, y2) {
  var a = x1 - x2;
  var b = y1 - y2;
  return Math.sqrt(a * a + b * b);
};

exports.distance = distance;

var clamp = function clamp(value, max) {
  var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  return Math.min(Math.max(value, min), max);
};

exports.clamp = clamp;

var shuffle = function shuffle(array) {
  var _arr = array.slice();

  for (var i = _arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var _ref = [_arr[j], _arr[i]];
    _arr[i] = _ref[0];
    _arr[j] = _ref[1];
  }

  return _arr;
};

exports.shuffle = shuffle;

var color = function color(r, g, b) {
  return {
    r: r,
    g: g,
    b: b
  };
};

exports.color = color;

var colourInterpolate = function colourInterpolate(t, color1, color2) {
  return color(interpolate(t, color1.r, color2.r), interpolate(t, color1.g, color2.g), interpolate(t, color1.b, color2.b));
};
/**
 * Creates an array of stepped colours through an array of colours
 *
 * @param {Array.<{ r: number, g: number, b: number }>} colours
 * @param {number} granularity
 *
 * @returns {Array.<{ r: number, g: number, b: number }>}
 */


exports.colourInterpolate = colourInterpolate;

var getInterpolatedColours = function getInterpolatedColours() {
  var colours = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var granularity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
  var colourStop = 1 / (colours.length - 1);
  var granularityStop = 1 / granularity;
  var colourArr = [];

  for (var i = 0; i <= 1; i += granularityStop) {
    var t = i % colourStop / colourStop;
    var currColourIdx = Math.floor(i / colourStop);
    colourArr.push(colourInterpolate(t, colours[currColourIdx], colours[currColourIdx + 1]));
  }

  return colourArr;
};
/**
 * Finds what would be the most relevant colour
 * in a colour array most likely created by
 * getInterpolatedColours
 *
 * @param {number} t
 * @param {Array.<{ r: number, g: number, b: number }>} colourArr
 *
 * @returns {{ r: number, g: number, b: number }}
 */


exports.getInterpolatedColours = getInterpolatedColours;

var getClosestColour = function getClosestColour(t, colourArr) {
  return colourArr[Math.round((colourArr.length - 1) * t)];
};

exports.getClosestColour = getClosestColour;
},{}],"js/utils/baseEngine.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rafLoop = _interopRequireDefault(require("raf-loop"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BaseEngine =
/*#__PURE__*/
function () {
  function BaseEngine(defaultOptions, options) {
    _classCallCheck(this, BaseEngine);

    this.options = _objectSpread({}, defaultOptions, {}, options);
    this.loop = (0, _rafLoop.default)(this.update.bind(this));
    this.frame = 0;
    this.windowWidth = window.innerWidth;

    this._renderer = function () {};
  }

  _createClass(BaseEngine, [{
    key: "_addEventListeners",
    value: function _addEventListeners() {
      var _this = this;

      this.wrapper.addEventListener('click', function () {
        _this.options.debug = !_this.options.debug;
        document.body.classList.toggle('debug', _this.options.debug);
      }, false);
      this.resizeTimer = setTimeout(function () {});
      window.addEventListener('resize', function (e) {
        clearTimeout(_this.resizeTimer);
        _this.resizeTimer = setTimeout(function () {
          _this.windowWidth = window.innerWidth;

          _this.updateDimensions(_this.options.width, _this.options.height, _this.options.pixelRatio, _this.options.pixelate);
        }, 150);
      });
    }
  }, {
    key: "_removeLoading",
    value: function _removeLoading() {
      var loading = document.getElementById('loading');
      loading.parentElement.removeChild(loading);
    }
  }, {
    key: "updateDimensions",
    value: function updateDimensions(width, height, pixelRatio) {
      var pixelate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      this.wrapper.style.width = "".concat(width * pixelate, "px");
      this.wrapper.style.height = "".concat(height * pixelate, "px");
      this.wrapper.style.transform = "scale(".concat((0, _utils.clamp)(this.windowWidth / width, 1), ")");

      if (this.canvasEl) {
        this.canvasEl.width = width * pixelRatio;
        this.canvasEl.height = height * pixelRatio;
        this.canvasCtx.scale(pixelRatio, pixelRatio);
      }

      if (this.renderer) {
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(pixelRatio);
      }
    }
  }, {
    key: "onRender",
    value: function onRender() {
      var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      this._renderer = fn;
    }
  }, {
    key: "preload",
    value: function preload() {
      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      return new Promise(function (resolve, reject) {
        cb(resolve);
      });
    }
  }, {
    key: "start",
    value: function start() {
      this._addEventListeners();

      this._removeLoading();

      this.loop.start();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.loop.stop();
    }
  }]);

  return BaseEngine;
}();

var _default = BaseEngine;
exports.default = _default;
},{"raf-loop":"../node_modules/raf-loop/index.js","./utils":"js/utils/utils.js"}],"js/utils/engine.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _baseEngine = _interopRequireDefault(require("./baseEngine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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
function (_BaseEngine) {
  _inherits(SketchEngine, _BaseEngine);

  function SketchEngine(canvasEl) {
    var _this;

    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, SketchEngine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SketchEngine).call(this, DEFAULTS, opts));
    _this.canvasEl = canvasEl;
    _this.canvasCtx = _this.canvasEl.getContext('2d');
    window.ctx = _this.canvasCtx;

    _this.updateDimensions(_this.options.width, _this.options.height, _this.options.pixelRatio, _this.options.pixelate);

    return _this;
  }

  _createClass(SketchEngine, [{
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
    key: "wrapper",
    get: function get() {
      return this.canvasEl;
    }
  }]);

  return SketchEngine;
}(_baseEngine.default);

var _default = SketchEngine;
exports.default = _default;
},{"./baseEngine":"js/utils/baseEngine.js"}],"../node_modules/animejs/lib/anime.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
 * anime.js v3.1.0
 * (c) 2019 Julian Garnier
 * Released under the MIT license
 * animejs.com
 */
// Defaults
var defaultInstanceSettings = {
  update: null,
  begin: null,
  loopBegin: null,
  changeBegin: null,
  change: null,
  changeComplete: null,
  loopComplete: null,
  complete: null,
  loop: 1,
  direction: 'normal',
  autoplay: true,
  timelineOffset: 0
};
var defaultTweenSettings = {
  duration: 1000,
  delay: 0,
  endDelay: 0,
  easing: 'easeOutElastic(1, .5)',
  round: 0
};
var validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective']; // Caching

var cache = {
  CSS: {},
  springs: {}
}; // Utils

function minMax(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function stringContains(str, text) {
  return str.indexOf(text) > -1;
}

function applyArguments(func, args) {
  return func.apply(null, args);
}

var is = {
  arr: function (a) {
    return Array.isArray(a);
  },
  obj: function (a) {
    return stringContains(Object.prototype.toString.call(a), 'Object');
  },
  pth: function (a) {
    return is.obj(a) && a.hasOwnProperty('totalLength');
  },
  svg: function (a) {
    return a instanceof SVGElement;
  },
  inp: function (a) {
    return a instanceof HTMLInputElement;
  },
  dom: function (a) {
    return a.nodeType || is.svg(a);
  },
  str: function (a) {
    return typeof a === 'string';
  },
  fnc: function (a) {
    return typeof a === 'function';
  },
  und: function (a) {
    return typeof a === 'undefined';
  },
  hex: function (a) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a);
  },
  rgb: function (a) {
    return /^rgb/.test(a);
  },
  hsl: function (a) {
    return /^hsl/.test(a);
  },
  col: function (a) {
    return is.hex(a) || is.rgb(a) || is.hsl(a);
  },
  key: function (a) {
    return !defaultInstanceSettings.hasOwnProperty(a) && !defaultTweenSettings.hasOwnProperty(a) && a !== 'targets' && a !== 'keyframes';
  }
}; // Easings

function parseEasingParameters(string) {
  var match = /\(([^)]+)\)/.exec(string);
  return match ? match[1].split(',').map(function (p) {
    return parseFloat(p);
  }) : [];
} // Spring solver inspired by Webkit Copyright © 2016 Apple Inc. All rights reserved. https://webkit.org/demos/spring/spring.js


function spring(string, duration) {
  var params = parseEasingParameters(string);
  var mass = minMax(is.und(params[0]) ? 1 : params[0], .1, 100);
  var stiffness = minMax(is.und(params[1]) ? 100 : params[1], .1, 100);
  var damping = minMax(is.und(params[2]) ? 10 : params[2], .1, 100);
  var velocity = minMax(is.und(params[3]) ? 0 : params[3], .1, 100);
  var w0 = Math.sqrt(stiffness / mass);
  var zeta = damping / (2 * Math.sqrt(stiffness * mass));
  var wd = zeta < 1 ? w0 * Math.sqrt(1 - zeta * zeta) : 0;
  var a = 1;
  var b = zeta < 1 ? (zeta * w0 + -velocity) / wd : -velocity + w0;

  function solver(t) {
    var progress = duration ? duration * t / 1000 : t;

    if (zeta < 1) {
      progress = Math.exp(-progress * zeta * w0) * (a * Math.cos(wd * progress) + b * Math.sin(wd * progress));
    } else {
      progress = (a + b * progress) * Math.exp(-progress * w0);
    }

    if (t === 0 || t === 1) {
      return t;
    }

    return 1 - progress;
  }

  function getDuration() {
    var cached = cache.springs[string];

    if (cached) {
      return cached;
    }

    var frame = 1 / 6;
    var elapsed = 0;
    var rest = 0;

    while (true) {
      elapsed += frame;

      if (solver(elapsed) === 1) {
        rest++;

        if (rest >= 16) {
          break;
        }
      } else {
        rest = 0;
      }
    }

    var duration = elapsed * frame * 1000;
    cache.springs[string] = duration;
    return duration;
  }

  return duration ? solver : getDuration;
} // Basic steps easing implementation https://developer.mozilla.org/fr/docs/Web/CSS/transition-timing-function


function steps(steps) {
  if (steps === void 0) steps = 10;
  return function (t) {
    return Math.round(t * steps) * (1 / steps);
  };
} // BezierEasing https://github.com/gre/bezier-easing


var bezier = function () {
  var kSplineTableSize = 11;
  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  function A(aA1, aA2) {
    return 1.0 - 3.0 * aA2 + 3.0 * aA1;
  }

  function B(aA1, aA2) {
    return 3.0 * aA2 - 6.0 * aA1;
  }

  function C(aA1) {
    return 3.0 * aA1;
  }

  function calcBezier(aT, aA1, aA2) {
    return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
  }

  function getSlope(aT, aA1, aA2) {
    return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
  }

  function binarySubdivide(aX, aA, aB, mX1, mX2) {
    var currentX,
        currentT,
        i = 0;

    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;

      if (currentX > 0.0) {
        aB = currentT;
      } else {
        aA = currentT;
      }
    } while (Math.abs(currentX) > 0.0000001 && ++i < 10);

    return currentT;
  }

  function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
    for (var i = 0; i < 4; ++i) {
      var currentSlope = getSlope(aGuessT, mX1, mX2);

      if (currentSlope === 0.0) {
        return aGuessT;
      }

      var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }

    return aGuessT;
  }

  function bezier(mX1, mY1, mX2, mY2) {
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
      return;
    }

    var sampleValues = new Float32Array(kSplineTableSize);

    if (mX1 !== mY1 || mX2 !== mY2) {
      for (var i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
      }
    }

    function getTForX(aX) {
      var intervalStart = 0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;

      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }

      --currentSample;
      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;
      var initialSlope = getSlope(guessForT, mX1, mX2);

      if (initialSlope >= 0.001) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }
    }

    return function (x) {
      if (mX1 === mY1 && mX2 === mY2) {
        return x;
      }

      if (x === 0 || x === 1) {
        return x;
      }

      return calcBezier(getTForX(x), mY1, mY2);
    };
  }

  return bezier;
}();

var penner = function () {
  // Based on jQuery UI's implemenation of easing equations from Robert Penner (http://www.robertpenner.com/easing)
  var eases = {
    linear: function () {
      return function (t) {
        return t;
      };
    }
  };
  var functionEasings = {
    Sine: function () {
      return function (t) {
        return 1 - Math.cos(t * Math.PI / 2);
      };
    },
    Circ: function () {
      return function (t) {
        return 1 - Math.sqrt(1 - t * t);
      };
    },
    Back: function () {
      return function (t) {
        return t * t * (3 * t - 2);
      };
    },
    Bounce: function () {
      return function (t) {
        var pow2,
            b = 4;

        while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11) {}

        return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2);
      };
    },
    Elastic: function (amplitude, period) {
      if (amplitude === void 0) amplitude = 1;
      if (period === void 0) period = .5;
      var a = minMax(amplitude, 1, 10);
      var p = minMax(period, .1, 2);
      return function (t) {
        return t === 0 || t === 1 ? t : -a * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1 - p / (Math.PI * 2) * Math.asin(1 / a)) * (Math.PI * 2) / p);
      };
    }
  };
  var baseEasings = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];
  baseEasings.forEach(function (name, i) {
    functionEasings[name] = function () {
      return function (t) {
        return Math.pow(t, i + 2);
      };
    };
  });
  Object.keys(functionEasings).forEach(function (name) {
    var easeIn = functionEasings[name];
    eases['easeIn' + name] = easeIn;

    eases['easeOut' + name] = function (a, b) {
      return function (t) {
        return 1 - easeIn(a, b)(1 - t);
      };
    };

    eases['easeInOut' + name] = function (a, b) {
      return function (t) {
        return t < 0.5 ? easeIn(a, b)(t * 2) / 2 : 1 - easeIn(a, b)(t * -2 + 2) / 2;
      };
    };
  });
  return eases;
}();

function parseEasings(easing, duration) {
  if (is.fnc(easing)) {
    return easing;
  }

  var name = easing.split('(')[0];
  var ease = penner[name];
  var args = parseEasingParameters(easing);

  switch (name) {
    case 'spring':
      return spring(easing, duration);

    case 'cubicBezier':
      return applyArguments(bezier, args);

    case 'steps':
      return applyArguments(steps, args);

    default:
      return applyArguments(ease, args);
  }
} // Strings


function selectString(str) {
  try {
    var nodes = document.querySelectorAll(str);
    return nodes;
  } catch (e) {
    return;
  }
} // Arrays


function filterArray(arr, callback) {
  var len = arr.length;
  var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
  var result = [];

  for (var i = 0; i < len; i++) {
    if (i in arr) {
      var val = arr[i];

      if (callback.call(thisArg, val, i, arr)) {
        result.push(val);
      }
    }
  }

  return result;
}

function flattenArray(arr) {
  return arr.reduce(function (a, b) {
    return a.concat(is.arr(b) ? flattenArray(b) : b);
  }, []);
}

function toArray(o) {
  if (is.arr(o)) {
    return o;
  }

  if (is.str(o)) {
    o = selectString(o) || o;
  }

  if (o instanceof NodeList || o instanceof HTMLCollection) {
    return [].slice.call(o);
  }

  return [o];
}

function arrayContains(arr, val) {
  return arr.some(function (a) {
    return a === val;
  });
} // Objects


function cloneObject(o) {
  var clone = {};

  for (var p in o) {
    clone[p] = o[p];
  }

  return clone;
}

function replaceObjectProps(o1, o2) {
  var o = cloneObject(o1);

  for (var p in o1) {
    o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p];
  }

  return o;
}

function mergeObjects(o1, o2) {
  var o = cloneObject(o1);

  for (var p in o2) {
    o[p] = is.und(o1[p]) ? o2[p] : o1[p];
  }

  return o;
} // Colors


function rgbToRgba(rgbValue) {
  var rgb = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(rgbValue);
  return rgb ? "rgba(" + rgb[1] + ",1)" : rgbValue;
}

function hexToRgba(hexValue) {
  var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  var hex = hexValue.replace(rgx, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var r = parseInt(rgb[1], 16);
  var g = parseInt(rgb[2], 16);
  var b = parseInt(rgb[3], 16);
  return "rgba(" + r + "," + g + "," + b + ",1)";
}

function hslToRgba(hslValue) {
  var hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslValue);
  var h = parseInt(hsl[1], 10) / 360;
  var s = parseInt(hsl[2], 10) / 100;
  var l = parseInt(hsl[3], 10) / 100;
  var a = hsl[4] || 1;

  function hue2rgb(p, q, t) {
    if (t < 0) {
      t += 1;
    }

    if (t > 1) {
      t -= 1;
    }

    if (t < 1 / 6) {
      return p + (q - p) * 6 * t;
    }

    if (t < 1 / 2) {
      return q;
    }

    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }

    return p;
  }

  var r, g, b;

  if (s == 0) {
    r = g = b = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return "rgba(" + r * 255 + "," + g * 255 + "," + b * 255 + "," + a + ")";
}

function colorToRgb(val) {
  if (is.rgb(val)) {
    return rgbToRgba(val);
  }

  if (is.hex(val)) {
    return hexToRgba(val);
  }

  if (is.hsl(val)) {
    return hslToRgba(val);
  }
} // Units


function getUnit(val) {
  var split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);

  if (split) {
    return split[1];
  }
}

function getTransformUnit(propName) {
  if (stringContains(propName, 'translate') || propName === 'perspective') {
    return 'px';
  }

  if (stringContains(propName, 'rotate') || stringContains(propName, 'skew')) {
    return 'deg';
  }
} // Values


function getFunctionValue(val, animatable) {
  if (!is.fnc(val)) {
    return val;
  }

  return val(animatable.target, animatable.id, animatable.total);
}

function getAttribute(el, prop) {
  return el.getAttribute(prop);
}

function convertPxToUnit(el, value, unit) {
  var valueUnit = getUnit(value);

  if (arrayContains([unit, 'deg', 'rad', 'turn'], valueUnit)) {
    return value;
  }

  var cached = cache.CSS[value + unit];

  if (!is.und(cached)) {
    return cached;
  }

  var baseline = 100;
  var tempEl = document.createElement(el.tagName);
  var parentEl = el.parentNode && el.parentNode !== document ? el.parentNode : document.body;
  parentEl.appendChild(tempEl);
  tempEl.style.position = 'absolute';
  tempEl.style.width = baseline + unit;
  var factor = baseline / tempEl.offsetWidth;
  parentEl.removeChild(tempEl);
  var convertedUnit = factor * parseFloat(value);
  cache.CSS[value + unit] = convertedUnit;
  return convertedUnit;
}

function getCSSValue(el, prop, unit) {
  if (prop in el.style) {
    var uppercasePropName = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    var value = el.style[prop] || getComputedStyle(el).getPropertyValue(uppercasePropName) || '0';
    return unit ? convertPxToUnit(el, value, unit) : value;
  }
}

function getAnimationType(el, prop) {
  if (is.dom(el) && !is.inp(el) && (getAttribute(el, prop) || is.svg(el) && el[prop])) {
    return 'attribute';
  }

  if (is.dom(el) && arrayContains(validTransforms, prop)) {
    return 'transform';
  }

  if (is.dom(el) && prop !== 'transform' && getCSSValue(el, prop)) {
    return 'css';
  }

  if (el[prop] != null) {
    return 'object';
  }
}

function getElementTransforms(el) {
  if (!is.dom(el)) {
    return;
  }

  var str = el.style.transform || '';
  var reg = /(\w+)\(([^)]*)\)/g;
  var transforms = new Map();
  var m;

  while (m = reg.exec(str)) {
    transforms.set(m[1], m[2]);
  }

  return transforms;
}

function getTransformValue(el, propName, animatable, unit) {
  var defaultVal = stringContains(propName, 'scale') ? 1 : 0 + getTransformUnit(propName);
  var value = getElementTransforms(el).get(propName) || defaultVal;

  if (animatable) {
    animatable.transforms.list.set(propName, value);
    animatable.transforms['last'] = propName;
  }

  return unit ? convertPxToUnit(el, value, unit) : value;
}

function getOriginalTargetValue(target, propName, unit, animatable) {
  switch (getAnimationType(target, propName)) {
    case 'transform':
      return getTransformValue(target, propName, animatable, unit);

    case 'css':
      return getCSSValue(target, propName, unit);

    case 'attribute':
      return getAttribute(target, propName);

    default:
      return target[propName] || 0;
  }
}

function getRelativeValue(to, from) {
  var operator = /^(\*=|\+=|-=)/.exec(to);

  if (!operator) {
    return to;
  }

  var u = getUnit(to) || 0;
  var x = parseFloat(from);
  var y = parseFloat(to.replace(operator[0], ''));

  switch (operator[0][0]) {
    case '+':
      return x + y + u;

    case '-':
      return x - y + u;

    case '*':
      return x * y + u;
  }
}

function validateValue(val, unit) {
  if (is.col(val)) {
    return colorToRgb(val);
  }

  if (/\s/g.test(val)) {
    return val;
  }

  var originalUnit = getUnit(val);
  var unitLess = originalUnit ? val.substr(0, val.length - originalUnit.length) : val;

  if (unit) {
    return unitLess + unit;
  }

  return unitLess;
} // getTotalLength() equivalent for circle, rect, polyline, polygon and line shapes
// adapted from https://gist.github.com/SebLambla/3e0550c496c236709744


function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCircleLength(el) {
  return Math.PI * 2 * getAttribute(el, 'r');
}

function getRectLength(el) {
  return getAttribute(el, 'width') * 2 + getAttribute(el, 'height') * 2;
}

function getLineLength(el) {
  return getDistance({
    x: getAttribute(el, 'x1'),
    y: getAttribute(el, 'y1')
  }, {
    x: getAttribute(el, 'x2'),
    y: getAttribute(el, 'y2')
  });
}

function getPolylineLength(el) {
  var points = el.points;
  var totalLength = 0;
  var previousPos;

  for (var i = 0; i < points.numberOfItems; i++) {
    var currentPos = points.getItem(i);

    if (i > 0) {
      totalLength += getDistance(previousPos, currentPos);
    }

    previousPos = currentPos;
  }

  return totalLength;
}

function getPolygonLength(el) {
  var points = el.points;
  return getPolylineLength(el) + getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0));
} // Path animation


function getTotalLength(el) {
  if (el.getTotalLength) {
    return el.getTotalLength();
  }

  switch (el.tagName.toLowerCase()) {
    case 'circle':
      return getCircleLength(el);

    case 'rect':
      return getRectLength(el);

    case 'line':
      return getLineLength(el);

    case 'polyline':
      return getPolylineLength(el);

    case 'polygon':
      return getPolygonLength(el);
  }
}

function setDashoffset(el) {
  var pathLength = getTotalLength(el);
  el.setAttribute('stroke-dasharray', pathLength);
  return pathLength;
} // Motion path


function getParentSvgEl(el) {
  var parentEl = el.parentNode;

  while (is.svg(parentEl)) {
    if (!is.svg(parentEl.parentNode)) {
      break;
    }

    parentEl = parentEl.parentNode;
  }

  return parentEl;
}

function getParentSvg(pathEl, svgData) {
  var svg = svgData || {};
  var parentSvgEl = svg.el || getParentSvgEl(pathEl);
  var rect = parentSvgEl.getBoundingClientRect();
  var viewBoxAttr = getAttribute(parentSvgEl, 'viewBox');
  var width = rect.width;
  var height = rect.height;
  var viewBox = svg.viewBox || (viewBoxAttr ? viewBoxAttr.split(' ') : [0, 0, width, height]);
  return {
    el: parentSvgEl,
    viewBox: viewBox,
    x: viewBox[0] / 1,
    y: viewBox[1] / 1,
    w: width / viewBox[2],
    h: height / viewBox[3]
  };
}

function getPath(path, percent) {
  var pathEl = is.str(path) ? selectString(path)[0] : path;
  var p = percent || 100;
  return function (property) {
    return {
      property: property,
      el: pathEl,
      svg: getParentSvg(pathEl),
      totalLength: getTotalLength(pathEl) * (p / 100)
    };
  };
}

function getPathProgress(path, progress) {
  function point(offset) {
    if (offset === void 0) offset = 0;
    var l = progress + offset >= 1 ? progress + offset : 0;
    return path.el.getPointAtLength(l);
  }

  var svg = getParentSvg(path.el, path.svg);
  var p = point();
  var p0 = point(-1);
  var p1 = point(+1);

  switch (path.property) {
    case 'x':
      return (p.x - svg.x) * svg.w;

    case 'y':
      return (p.y - svg.y) * svg.h;

    case 'angle':
      return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
  }
} // Decompose value


function decomposeValue(val, unit) {
  // const rgx = /-?\d*\.?\d+/g; // handles basic numbers
  // const rgx = /[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation
  var rgx = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation

  var value = validateValue(is.pth(val) ? val.totalLength : val, unit) + '';
  return {
    original: value,
    numbers: value.match(rgx) ? value.match(rgx).map(Number) : [0],
    strings: is.str(val) || unit ? value.split(rgx) : []
  };
} // Animatables


function parseTargets(targets) {
  var targetsArray = targets ? flattenArray(is.arr(targets) ? targets.map(toArray) : toArray(targets)) : [];
  return filterArray(targetsArray, function (item, pos, self) {
    return self.indexOf(item) === pos;
  });
}

function getAnimatables(targets) {
  var parsed = parseTargets(targets);
  return parsed.map(function (t, i) {
    return {
      target: t,
      id: i,
      total: parsed.length,
      transforms: {
        list: getElementTransforms(t)
      }
    };
  });
} // Properties


function normalizePropertyTweens(prop, tweenSettings) {
  var settings = cloneObject(tweenSettings); // Override duration if easing is a spring

  if (/^spring/.test(settings.easing)) {
    settings.duration = spring(settings.easing);
  }

  if (is.arr(prop)) {
    var l = prop.length;
    var isFromTo = l === 2 && !is.obj(prop[0]);

    if (!isFromTo) {
      // Duration divided by the number of tweens
      if (!is.fnc(tweenSettings.duration)) {
        settings.duration = tweenSettings.duration / l;
      }
    } else {
      // Transform [from, to] values shorthand to a valid tween value
      prop = {
        value: prop
      };
    }
  }

  var propArray = is.arr(prop) ? prop : [prop];
  return propArray.map(function (v, i) {
    var obj = is.obj(v) && !is.pth(v) ? v : {
      value: v
    }; // Default delay value should only be applied to the first tween

    if (is.und(obj.delay)) {
      obj.delay = !i ? tweenSettings.delay : 0;
    } // Default endDelay value should only be applied to the last tween


    if (is.und(obj.endDelay)) {
      obj.endDelay = i === propArray.length - 1 ? tweenSettings.endDelay : 0;
    }

    return obj;
  }).map(function (k) {
    return mergeObjects(k, settings);
  });
}

function flattenKeyframes(keyframes) {
  var propertyNames = filterArray(flattenArray(keyframes.map(function (key) {
    return Object.keys(key);
  })), function (p) {
    return is.key(p);
  }).reduce(function (a, b) {
    if (a.indexOf(b) < 0) {
      a.push(b);
    }

    return a;
  }, []);
  var properties = {};

  var loop = function (i) {
    var propName = propertyNames[i];
    properties[propName] = keyframes.map(function (key) {
      var newKey = {};

      for (var p in key) {
        if (is.key(p)) {
          if (p == propName) {
            newKey.value = key[p];
          }
        } else {
          newKey[p] = key[p];
        }
      }

      return newKey;
    });
  };

  for (var i = 0; i < propertyNames.length; i++) loop(i);

  return properties;
}

function getProperties(tweenSettings, params) {
  var properties = [];
  var keyframes = params.keyframes;

  if (keyframes) {
    params = mergeObjects(flattenKeyframes(keyframes), params);
  }

  for (var p in params) {
    if (is.key(p)) {
      properties.push({
        name: p,
        tweens: normalizePropertyTweens(params[p], tweenSettings)
      });
    }
  }

  return properties;
} // Tweens


function normalizeTweenValues(tween, animatable) {
  var t = {};

  for (var p in tween) {
    var value = getFunctionValue(tween[p], animatable);

    if (is.arr(value)) {
      value = value.map(function (v) {
        return getFunctionValue(v, animatable);
      });

      if (value.length === 1) {
        value = value[0];
      }
    }

    t[p] = value;
  }

  t.duration = parseFloat(t.duration);
  t.delay = parseFloat(t.delay);
  return t;
}

function normalizeTweens(prop, animatable) {
  var previousTween;
  return prop.tweens.map(function (t) {
    var tween = normalizeTweenValues(t, animatable);
    var tweenValue = tween.value;
    var to = is.arr(tweenValue) ? tweenValue[1] : tweenValue;
    var toUnit = getUnit(to);
    var originalValue = getOriginalTargetValue(animatable.target, prop.name, toUnit, animatable);
    var previousValue = previousTween ? previousTween.to.original : originalValue;
    var from = is.arr(tweenValue) ? tweenValue[0] : previousValue;
    var fromUnit = getUnit(from) || getUnit(originalValue);
    var unit = toUnit || fromUnit;

    if (is.und(to)) {
      to = previousValue;
    }

    tween.from = decomposeValue(from, unit);
    tween.to = decomposeValue(getRelativeValue(to, from), unit);
    tween.start = previousTween ? previousTween.end : 0;
    tween.end = tween.start + tween.delay + tween.duration + tween.endDelay;
    tween.easing = parseEasings(tween.easing, tween.duration);
    tween.isPath = is.pth(tweenValue);
    tween.isColor = is.col(tween.from.original);

    if (tween.isColor) {
      tween.round = 1;
    }

    previousTween = tween;
    return tween;
  });
} // Tween progress


var setProgressValue = {
  css: function (t, p, v) {
    return t.style[p] = v;
  },
  attribute: function (t, p, v) {
    return t.setAttribute(p, v);
  },
  object: function (t, p, v) {
    return t[p] = v;
  },
  transform: function (t, p, v, transforms, manual) {
    transforms.list.set(p, v);

    if (p === transforms.last || manual) {
      var str = '';
      transforms.list.forEach(function (value, prop) {
        str += prop + "(" + value + ") ";
      });
      t.style.transform = str;
    }
  }
}; // Set Value helper

function setTargetsValue(targets, properties) {
  var animatables = getAnimatables(targets);
  animatables.forEach(function (animatable) {
    for (var property in properties) {
      var value = getFunctionValue(properties[property], animatable);
      var target = animatable.target;
      var valueUnit = getUnit(value);
      var originalValue = getOriginalTargetValue(target, property, valueUnit, animatable);
      var unit = valueUnit || getUnit(originalValue);
      var to = getRelativeValue(validateValue(value, unit), originalValue);
      var animType = getAnimationType(target, property);
      setProgressValue[animType](target, property, to, animatable.transforms, true);
    }
  });
} // Animations


function createAnimation(animatable, prop) {
  var animType = getAnimationType(animatable.target, prop.name);

  if (animType) {
    var tweens = normalizeTweens(prop, animatable);
    var lastTween = tweens[tweens.length - 1];
    return {
      type: animType,
      property: prop.name,
      animatable: animatable,
      tweens: tweens,
      duration: lastTween.end,
      delay: tweens[0].delay,
      endDelay: lastTween.endDelay
    };
  }
}

function getAnimations(animatables, properties) {
  return filterArray(flattenArray(animatables.map(function (animatable) {
    return properties.map(function (prop) {
      return createAnimation(animatable, prop);
    });
  })), function (a) {
    return !is.und(a);
  });
} // Create Instance


function getInstanceTimings(animations, tweenSettings) {
  var animLength = animations.length;

  var getTlOffset = function (anim) {
    return anim.timelineOffset ? anim.timelineOffset : 0;
  };

  var timings = {};
  timings.duration = animLength ? Math.max.apply(Math, animations.map(function (anim) {
    return getTlOffset(anim) + anim.duration;
  })) : tweenSettings.duration;
  timings.delay = animLength ? Math.min.apply(Math, animations.map(function (anim) {
    return getTlOffset(anim) + anim.delay;
  })) : tweenSettings.delay;
  timings.endDelay = animLength ? timings.duration - Math.max.apply(Math, animations.map(function (anim) {
    return getTlOffset(anim) + anim.duration - anim.endDelay;
  })) : tweenSettings.endDelay;
  return timings;
}

var instanceID = 0;

function createNewInstance(params) {
  var instanceSettings = replaceObjectProps(defaultInstanceSettings, params);
  var tweenSettings = replaceObjectProps(defaultTweenSettings, params);
  var properties = getProperties(tweenSettings, params);
  var animatables = getAnimatables(params.targets);
  var animations = getAnimations(animatables, properties);
  var timings = getInstanceTimings(animations, tweenSettings);
  var id = instanceID;
  instanceID++;
  return mergeObjects(instanceSettings, {
    id: id,
    children: [],
    animatables: animatables,
    animations: animations,
    duration: timings.duration,
    delay: timings.delay,
    endDelay: timings.endDelay
  });
} // Core


var activeInstances = [];
var pausedInstances = [];
var raf;

var engine = function () {
  function play() {
    raf = requestAnimationFrame(step);
  }

  function step(t) {
    var activeInstancesLength = activeInstances.length;

    if (activeInstancesLength) {
      var i = 0;

      while (i < activeInstancesLength) {
        var activeInstance = activeInstances[i];

        if (!activeInstance.paused) {
          activeInstance.tick(t);
        } else {
          var instanceIndex = activeInstances.indexOf(activeInstance);

          if (instanceIndex > -1) {
            activeInstances.splice(instanceIndex, 1);
            activeInstancesLength = activeInstances.length;
          }
        }

        i++;
      }

      play();
    } else {
      raf = cancelAnimationFrame(raf);
    }
  }

  return play;
}();

function handleVisibilityChange() {
  if (document.hidden) {
    activeInstances.forEach(function (ins) {
      return ins.pause();
    });
    pausedInstances = activeInstances.slice(0);
    anime.running = activeInstances = [];
  } else {
    pausedInstances.forEach(function (ins) {
      return ins.play();
    });
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', handleVisibilityChange);
} // Public Instance


function anime(params) {
  if (params === void 0) params = {};
  var startTime = 0,
      lastTime = 0,
      now = 0;
  var children,
      childrenLength = 0;
  var resolve = null;

  function makePromise(instance) {
    var promise = window.Promise && new Promise(function (_resolve) {
      return resolve = _resolve;
    });
    instance.finished = promise;
    return promise;
  }

  var instance = createNewInstance(params);
  var promise = makePromise(instance);

  function toggleInstanceDirection() {
    var direction = instance.direction;

    if (direction !== 'alternate') {
      instance.direction = direction !== 'normal' ? 'normal' : 'reverse';
    }

    instance.reversed = !instance.reversed;
    children.forEach(function (child) {
      return child.reversed = instance.reversed;
    });
  }

  function adjustTime(time) {
    return instance.reversed ? instance.duration - time : time;
  }

  function resetTime() {
    startTime = 0;
    lastTime = adjustTime(instance.currentTime) * (1 / anime.speed);
  }

  function seekChild(time, child) {
    if (child) {
      child.seek(time - child.timelineOffset);
    }
  }

  function syncInstanceChildren(time) {
    if (!instance.reversePlayback) {
      for (var i = 0; i < childrenLength; i++) {
        seekChild(time, children[i]);
      }
    } else {
      for (var i$1 = childrenLength; i$1--;) {
        seekChild(time, children[i$1]);
      }
    }
  }

  function setAnimationsProgress(insTime) {
    var i = 0;
    var animations = instance.animations;
    var animationsLength = animations.length;

    while (i < animationsLength) {
      var anim = animations[i];
      var animatable = anim.animatable;
      var tweens = anim.tweens;
      var tweenLength = tweens.length - 1;
      var tween = tweens[tweenLength]; // Only check for keyframes if there is more than one tween

      if (tweenLength) {
        tween = filterArray(tweens, function (t) {
          return insTime < t.end;
        })[0] || tween;
      }

      var elapsed = minMax(insTime - tween.start - tween.delay, 0, tween.duration) / tween.duration;
      var eased = isNaN(elapsed) ? 1 : tween.easing(elapsed);
      var strings = tween.to.strings;
      var round = tween.round;
      var numbers = [];
      var toNumbersLength = tween.to.numbers.length;
      var progress = void 0;

      for (var n = 0; n < toNumbersLength; n++) {
        var value = void 0;
        var toNumber = tween.to.numbers[n];
        var fromNumber = tween.from.numbers[n] || 0;

        if (!tween.isPath) {
          value = fromNumber + eased * (toNumber - fromNumber);
        } else {
          value = getPathProgress(tween.value, eased * toNumber);
        }

        if (round) {
          if (!(tween.isColor && n > 2)) {
            value = Math.round(value * round) / round;
          }
        }

        numbers.push(value);
      } // Manual Array.reduce for better performances


      var stringsLength = strings.length;

      if (!stringsLength) {
        progress = numbers[0];
      } else {
        progress = strings[0];

        for (var s = 0; s < stringsLength; s++) {
          var a = strings[s];
          var b = strings[s + 1];
          var n$1 = numbers[s];

          if (!isNaN(n$1)) {
            if (!b) {
              progress += n$1 + ' ';
            } else {
              progress += n$1 + b;
            }
          }
        }
      }

      setProgressValue[anim.type](animatable.target, anim.property, progress, animatable.transforms);
      anim.currentValue = progress;
      i++;
    }
  }

  function setCallback(cb) {
    if (instance[cb] && !instance.passThrough) {
      instance[cb](instance);
    }
  }

  function countIteration() {
    if (instance.remaining && instance.remaining !== true) {
      instance.remaining--;
    }
  }

  function setInstanceProgress(engineTime) {
    var insDuration = instance.duration;
    var insDelay = instance.delay;
    var insEndDelay = insDuration - instance.endDelay;
    var insTime = adjustTime(engineTime);
    instance.progress = minMax(insTime / insDuration * 100, 0, 100);
    instance.reversePlayback = insTime < instance.currentTime;

    if (children) {
      syncInstanceChildren(insTime);
    }

    if (!instance.began && instance.currentTime > 0) {
      instance.began = true;
      setCallback('begin');
    }

    if (!instance.loopBegan && instance.currentTime > 0) {
      instance.loopBegan = true;
      setCallback('loopBegin');
    }

    if (insTime <= insDelay && instance.currentTime !== 0) {
      setAnimationsProgress(0);
    }

    if (insTime >= insEndDelay && instance.currentTime !== insDuration || !insDuration) {
      setAnimationsProgress(insDuration);
    }

    if (insTime > insDelay && insTime < insEndDelay) {
      if (!instance.changeBegan) {
        instance.changeBegan = true;
        instance.changeCompleted = false;
        setCallback('changeBegin');
      }

      setCallback('change');
      setAnimationsProgress(insTime);
    } else {
      if (instance.changeBegan) {
        instance.changeCompleted = true;
        instance.changeBegan = false;
        setCallback('changeComplete');
      }
    }

    instance.currentTime = minMax(insTime, 0, insDuration);

    if (instance.began) {
      setCallback('update');
    }

    if (engineTime >= insDuration) {
      lastTime = 0;
      countIteration();

      if (!instance.remaining) {
        instance.paused = true;

        if (!instance.completed) {
          instance.completed = true;
          setCallback('loopComplete');
          setCallback('complete');

          if (!instance.passThrough && 'Promise' in window) {
            resolve();
            promise = makePromise(instance);
          }
        }
      } else {
        startTime = now;
        setCallback('loopComplete');
        instance.loopBegan = false;

        if (instance.direction === 'alternate') {
          toggleInstanceDirection();
        }
      }
    }
  }

  instance.reset = function () {
    var direction = instance.direction;
    instance.passThrough = false;
    instance.currentTime = 0;
    instance.progress = 0;
    instance.paused = true;
    instance.began = false;
    instance.loopBegan = false;
    instance.changeBegan = false;
    instance.completed = false;
    instance.changeCompleted = false;
    instance.reversePlayback = false;
    instance.reversed = direction === 'reverse';
    instance.remaining = instance.loop;
    children = instance.children;
    childrenLength = children.length;

    for (var i = childrenLength; i--;) {
      instance.children[i].reset();
    }

    if (instance.reversed && instance.loop !== true || direction === 'alternate' && instance.loop === 1) {
      instance.remaining++;
    }

    setAnimationsProgress(instance.reversed ? instance.duration : 0);
  }; // Set Value helper


  instance.set = function (targets, properties) {
    setTargetsValue(targets, properties);
    return instance;
  };

  instance.tick = function (t) {
    now = t;

    if (!startTime) {
      startTime = now;
    }

    setInstanceProgress((now + (lastTime - startTime)) * anime.speed);
  };

  instance.seek = function (time) {
    setInstanceProgress(adjustTime(time));
  };

  instance.pause = function () {
    instance.paused = true;
    resetTime();
  };

  instance.play = function () {
    if (!instance.paused) {
      return;
    }

    if (instance.completed) {
      instance.reset();
    }

    instance.paused = false;
    activeInstances.push(instance);
    resetTime();

    if (!raf) {
      engine();
    }
  };

  instance.reverse = function () {
    toggleInstanceDirection();
    resetTime();
  };

  instance.restart = function () {
    instance.reset();
    instance.play();
  };

  instance.reset();

  if (instance.autoplay) {
    instance.play();
  }

  return instance;
} // Remove targets from animation


function removeTargetsFromAnimations(targetsArray, animations) {
  for (var a = animations.length; a--;) {
    if (arrayContains(targetsArray, animations[a].animatable.target)) {
      animations.splice(a, 1);
    }
  }
}

function removeTargets(targets) {
  var targetsArray = parseTargets(targets);

  for (var i = activeInstances.length; i--;) {
    var instance = activeInstances[i];
    var animations = instance.animations;
    var children = instance.children;
    removeTargetsFromAnimations(targetsArray, animations);

    for (var c = children.length; c--;) {
      var child = children[c];
      var childAnimations = child.animations;
      removeTargetsFromAnimations(targetsArray, childAnimations);

      if (!childAnimations.length && !child.children.length) {
        children.splice(c, 1);
      }
    }

    if (!animations.length && !children.length) {
      instance.pause();
    }
  }
} // Stagger helpers


function stagger(val, params) {
  if (params === void 0) params = {};
  var direction = params.direction || 'normal';
  var easing = params.easing ? parseEasings(params.easing) : null;
  var grid = params.grid;
  var axis = params.axis;
  var fromIndex = params.from || 0;
  var fromFirst = fromIndex === 'first';
  var fromCenter = fromIndex === 'center';
  var fromLast = fromIndex === 'last';
  var isRange = is.arr(val);
  var val1 = isRange ? parseFloat(val[0]) : parseFloat(val);
  var val2 = isRange ? parseFloat(val[1]) : 0;
  var unit = getUnit(isRange ? val[1] : val) || 0;
  var start = params.start || 0 + (isRange ? val1 : 0);
  var values = [];
  var maxValue = 0;
  return function (el, i, t) {
    if (fromFirst) {
      fromIndex = 0;
    }

    if (fromCenter) {
      fromIndex = (t - 1) / 2;
    }

    if (fromLast) {
      fromIndex = t - 1;
    }

    if (!values.length) {
      for (var index = 0; index < t; index++) {
        if (!grid) {
          values.push(Math.abs(fromIndex - index));
        } else {
          var fromX = !fromCenter ? fromIndex % grid[0] : (grid[0] - 1) / 2;
          var fromY = !fromCenter ? Math.floor(fromIndex / grid[0]) : (grid[1] - 1) / 2;
          var toX = index % grid[0];
          var toY = Math.floor(index / grid[0]);
          var distanceX = fromX - toX;
          var distanceY = fromY - toY;
          var value = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

          if (axis === 'x') {
            value = -distanceX;
          }

          if (axis === 'y') {
            value = -distanceY;
          }

          values.push(value);
        }

        maxValue = Math.max.apply(Math, values);
      }

      if (easing) {
        values = values.map(function (val) {
          return easing(val / maxValue) * maxValue;
        });
      }

      if (direction === 'reverse') {
        values = values.map(function (val) {
          return axis ? val < 0 ? val * -1 : -val : Math.abs(maxValue - val);
        });
      }
    }

    var spacing = isRange ? (val2 - val1) / maxValue : val1;
    return start + spacing * (Math.round(values[i] * 100) / 100) + unit;
  };
} // Timeline


function timeline(params) {
  if (params === void 0) params = {};
  var tl = anime(params);
  tl.duration = 0;

  tl.add = function (instanceParams, timelineOffset) {
    var tlIndex = activeInstances.indexOf(tl);
    var children = tl.children;

    if (tlIndex > -1) {
      activeInstances.splice(tlIndex, 1);
    }

    function passThrough(ins) {
      ins.passThrough = true;
    }

    for (var i = 0; i < children.length; i++) {
      passThrough(children[i]);
    }

    var insParams = mergeObjects(instanceParams, replaceObjectProps(defaultTweenSettings, params));
    insParams.targets = insParams.targets || params.targets;
    var tlDuration = tl.duration;
    insParams.autoplay = false;
    insParams.direction = tl.direction;
    insParams.timelineOffset = is.und(timelineOffset) ? tlDuration : getRelativeValue(timelineOffset, tlDuration);
    passThrough(tl);
    tl.seek(insParams.timelineOffset);
    var ins = anime(insParams);
    passThrough(ins);
    children.push(ins);
    var timings = getInstanceTimings(children, params);
    tl.delay = timings.delay;
    tl.endDelay = timings.endDelay;
    tl.duration = timings.duration;
    tl.seek(0);
    tl.reset();

    if (tl.autoplay) {
      tl.play();
    }

    return tl;
  };

  return tl;
}

anime.version = '3.1.0';
anime.speed = 1;
anime.running = activeInstances;
anime.remove = removeTargets;
anime.get = getOriginalTargetValue;
anime.set = setTargetsValue;
anime.convertPx = convertPxToUnit;
anime.path = getPath;
anime.setDashoffset = setDashoffset;
anime.stagger = stagger;
anime.timeline = timeline;
anime.easing = parseEasings;
anime.penner = penner;

anime.random = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var _default = anime;
exports.default = _default;
},{}],"../node_modules/string.prototype.codepointat/codepointat.js":[function(require,module,exports) {
/*! https://mths.be/codepointat v0.2.0 by @mathias */
if (!String.prototype.codePointAt) {
	(function() {
		'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
		var defineProperty = (function() {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch(error) {}
			return result;
		}());
		var codePointAt = function(position) {
			if (this == null) {
				throw TypeError();
			}
			var string = String(this);
			var size = string.length;
			// `ToInteger`
			var index = position ? Number(position) : 0;
			if (index != index) { // better `isNaN`
				index = 0;
			}
			// Account for out-of-bounds indices:
			if (index < 0 || index >= size) {
				return undefined;
			}
			// Get the first code unit
			var first = string.charCodeAt(index);
			var second;
			if ( // check if it’s the start of a surrogate pair
				first >= 0xD800 && first <= 0xDBFF && // high surrogate
				size > index + 1 // there is a next code unit
			) {
				second = string.charCodeAt(index + 1);
				if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
					// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
					return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
				}
			}
			return first;
		};
		if (defineProperty) {
			defineProperty(String.prototype, 'codePointAt', {
				'value': codePointAt,
				'configurable': true,
				'writable': true
			});
		} else {
			String.prototype.codePointAt = codePointAt;
		}
	}());
}

},{}],"../node_modules/tiny-inflate/index.js":[function(require,module,exports) {
var TINF_OK = 0;
var TINF_DATA_ERROR = -3;

function Tree() {
  this.table = new Uint16Array(16);   /* table of code length counts */
  this.trans = new Uint16Array(288);  /* code -> symbol translation table */
}

function Data(source, dest) {
  this.source = source;
  this.sourceIndex = 0;
  this.tag = 0;
  this.bitcount = 0;
  
  this.dest = dest;
  this.destLen = 0;
  
  this.ltree = new Tree();  /* dynamic length/symbol tree */
  this.dtree = new Tree();  /* dynamic distance tree */
}

/* --------------------------------------------------- *
 * -- uninitialized global data (static structures) -- *
 * --------------------------------------------------- */

var sltree = new Tree();
var sdtree = new Tree();

/* extra bits and base tables for length codes */
var length_bits = new Uint8Array(30);
var length_base = new Uint16Array(30);

/* extra bits and base tables for distance codes */
var dist_bits = new Uint8Array(30);
var dist_base = new Uint16Array(30);

/* special ordering of code length codes */
var clcidx = new Uint8Array([
  16, 17, 18, 0, 8, 7, 9, 6,
  10, 5, 11, 4, 12, 3, 13, 2,
  14, 1, 15
]);

/* used by tinf_decode_trees, avoids allocations every call */
var code_tree = new Tree();
var lengths = new Uint8Array(288 + 32);

/* ----------------------- *
 * -- utility functions -- *
 * ----------------------- */

/* build extra bits and base tables */
function tinf_build_bits_base(bits, base, delta, first) {
  var i, sum;

  /* build bits table */
  for (i = 0; i < delta; ++i) bits[i] = 0;
  for (i = 0; i < 30 - delta; ++i) bits[i + delta] = i / delta | 0;

  /* build base table */
  for (sum = first, i = 0; i < 30; ++i) {
    base[i] = sum;
    sum += 1 << bits[i];
  }
}

/* build the fixed huffman trees */
function tinf_build_fixed_trees(lt, dt) {
  var i;

  /* build fixed length tree */
  for (i = 0; i < 7; ++i) lt.table[i] = 0;

  lt.table[7] = 24;
  lt.table[8] = 152;
  lt.table[9] = 112;

  for (i = 0; i < 24; ++i) lt.trans[i] = 256 + i;
  for (i = 0; i < 144; ++i) lt.trans[24 + i] = i;
  for (i = 0; i < 8; ++i) lt.trans[24 + 144 + i] = 280 + i;
  for (i = 0; i < 112; ++i) lt.trans[24 + 144 + 8 + i] = 144 + i;

  /* build fixed distance tree */
  for (i = 0; i < 5; ++i) dt.table[i] = 0;

  dt.table[5] = 32;

  for (i = 0; i < 32; ++i) dt.trans[i] = i;
}

/* given an array of code lengths, build a tree */
var offs = new Uint16Array(16);

function tinf_build_tree(t, lengths, off, num) {
  var i, sum;

  /* clear code length count table */
  for (i = 0; i < 16; ++i) t.table[i] = 0;

  /* scan symbol lengths, and sum code length counts */
  for (i = 0; i < num; ++i) t.table[lengths[off + i]]++;

  t.table[0] = 0;

  /* compute offset table for distribution sort */
  for (sum = 0, i = 0; i < 16; ++i) {
    offs[i] = sum;
    sum += t.table[i];
  }

  /* create code->symbol translation table (symbols sorted by code) */
  for (i = 0; i < num; ++i) {
    if (lengths[off + i]) t.trans[offs[lengths[off + i]]++] = i;
  }
}

/* ---------------------- *
 * -- decode functions -- *
 * ---------------------- */

/* get one bit from source stream */
function tinf_getbit(d) {
  /* check if tag is empty */
  if (!d.bitcount--) {
    /* load next tag */
    d.tag = d.source[d.sourceIndex++];
    d.bitcount = 7;
  }

  /* shift bit out of tag */
  var bit = d.tag & 1;
  d.tag >>>= 1;

  return bit;
}

/* read a num bit value from a stream and add base */
function tinf_read_bits(d, num, base) {
  if (!num)
    return base;

  while (d.bitcount < 24) {
    d.tag |= d.source[d.sourceIndex++] << d.bitcount;
    d.bitcount += 8;
  }

  var val = d.tag & (0xffff >>> (16 - num));
  d.tag >>>= num;
  d.bitcount -= num;
  return val + base;
}

/* given a data stream and a tree, decode a symbol */
function tinf_decode_symbol(d, t) {
  while (d.bitcount < 24) {
    d.tag |= d.source[d.sourceIndex++] << d.bitcount;
    d.bitcount += 8;
  }
  
  var sum = 0, cur = 0, len = 0;
  var tag = d.tag;

  /* get more bits while code value is above sum */
  do {
    cur = 2 * cur + (tag & 1);
    tag >>>= 1;
    ++len;

    sum += t.table[len];
    cur -= t.table[len];
  } while (cur >= 0);
  
  d.tag = tag;
  d.bitcount -= len;

  return t.trans[sum + cur];
}

/* given a data stream, decode dynamic trees from it */
function tinf_decode_trees(d, lt, dt) {
  var hlit, hdist, hclen;
  var i, num, length;

  /* get 5 bits HLIT (257-286) */
  hlit = tinf_read_bits(d, 5, 257);

  /* get 5 bits HDIST (1-32) */
  hdist = tinf_read_bits(d, 5, 1);

  /* get 4 bits HCLEN (4-19) */
  hclen = tinf_read_bits(d, 4, 4);

  for (i = 0; i < 19; ++i) lengths[i] = 0;

  /* read code lengths for code length alphabet */
  for (i = 0; i < hclen; ++i) {
    /* get 3 bits code length (0-7) */
    var clen = tinf_read_bits(d, 3, 0);
    lengths[clcidx[i]] = clen;
  }

  /* build code length tree */
  tinf_build_tree(code_tree, lengths, 0, 19);

  /* decode code lengths for the dynamic trees */
  for (num = 0; num < hlit + hdist;) {
    var sym = tinf_decode_symbol(d, code_tree);

    switch (sym) {
      case 16:
        /* copy previous code length 3-6 times (read 2 bits) */
        var prev = lengths[num - 1];
        for (length = tinf_read_bits(d, 2, 3); length; --length) {
          lengths[num++] = prev;
        }
        break;
      case 17:
        /* repeat code length 0 for 3-10 times (read 3 bits) */
        for (length = tinf_read_bits(d, 3, 3); length; --length) {
          lengths[num++] = 0;
        }
        break;
      case 18:
        /* repeat code length 0 for 11-138 times (read 7 bits) */
        for (length = tinf_read_bits(d, 7, 11); length; --length) {
          lengths[num++] = 0;
        }
        break;
      default:
        /* values 0-15 represent the actual code lengths */
        lengths[num++] = sym;
        break;
    }
  }

  /* build dynamic trees */
  tinf_build_tree(lt, lengths, 0, hlit);
  tinf_build_tree(dt, lengths, hlit, hdist);
}

/* ----------------------------- *
 * -- block inflate functions -- *
 * ----------------------------- */

/* given a stream and two trees, inflate a block of data */
function tinf_inflate_block_data(d, lt, dt) {
  while (1) {
    var sym = tinf_decode_symbol(d, lt);

    /* check for end of block */
    if (sym === 256) {
      return TINF_OK;
    }

    if (sym < 256) {
      d.dest[d.destLen++] = sym;
    } else {
      var length, dist, offs;
      var i;

      sym -= 257;

      /* possibly get more bits from length code */
      length = tinf_read_bits(d, length_bits[sym], length_base[sym]);

      dist = tinf_decode_symbol(d, dt);

      /* possibly get more bits from distance code */
      offs = d.destLen - tinf_read_bits(d, dist_bits[dist], dist_base[dist]);

      /* copy match */
      for (i = offs; i < offs + length; ++i) {
        d.dest[d.destLen++] = d.dest[i];
      }
    }
  }
}

/* inflate an uncompressed block of data */
function tinf_inflate_uncompressed_block(d) {
  var length, invlength;
  var i;
  
  /* unread from bitbuffer */
  while (d.bitcount > 8) {
    d.sourceIndex--;
    d.bitcount -= 8;
  }

  /* get length */
  length = d.source[d.sourceIndex + 1];
  length = 256 * length + d.source[d.sourceIndex];

  /* get one's complement of length */
  invlength = d.source[d.sourceIndex + 3];
  invlength = 256 * invlength + d.source[d.sourceIndex + 2];

  /* check length */
  if (length !== (~invlength & 0x0000ffff))
    return TINF_DATA_ERROR;

  d.sourceIndex += 4;

  /* copy block */
  for (i = length; i; --i)
    d.dest[d.destLen++] = d.source[d.sourceIndex++];

  /* make sure we start next block on a byte boundary */
  d.bitcount = 0;

  return TINF_OK;
}

/* inflate stream from source to dest */
function tinf_uncompress(source, dest) {
  var d = new Data(source, dest);
  var bfinal, btype, res;

  do {
    /* read final block flag */
    bfinal = tinf_getbit(d);

    /* read block type (2 bits) */
    btype = tinf_read_bits(d, 2, 0);

    /* decompress block */
    switch (btype) {
      case 0:
        /* decompress uncompressed block */
        res = tinf_inflate_uncompressed_block(d);
        break;
      case 1:
        /* decompress block with fixed huffman trees */
        res = tinf_inflate_block_data(d, sltree, sdtree);
        break;
      case 2:
        /* decompress block with dynamic huffman trees */
        tinf_decode_trees(d, d.ltree, d.dtree);
        res = tinf_inflate_block_data(d, d.ltree, d.dtree);
        break;
      default:
        res = TINF_DATA_ERROR;
    }

    if (res !== TINF_OK)
      throw new Error('Data error');

  } while (!bfinal);

  if (d.destLen < d.dest.length) {
    if (typeof d.dest.slice === 'function')
      return d.dest.slice(0, d.destLen);
    else
      return d.dest.subarray(0, d.destLen);
  }
  
  return d.dest;
}

/* -------------------- *
 * -- initialization -- *
 * -------------------- */

/* build fixed huffman trees */
tinf_build_fixed_trees(sltree, sdtree);

/* build extra bits and base tables */
tinf_build_bits_base(length_bits, length_base, 4, 3);
tinf_build_bits_base(dist_bits, dist_base, 2, 1);

/* fix a special case */
length_bits[28] = 0;
length_base[28] = 258;

module.exports = tinf_uncompress;

},{}],"../node_modules/opentype.js/src/bbox.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// The Bounding Box object
function derive(v0, v1, v2, v3, t) {
  return Math.pow(1 - t, 3) * v0 + 3 * Math.pow(1 - t, 2) * t * v1 + 3 * (1 - t) * Math.pow(t, 2) * v2 + Math.pow(t, 3) * v3;
}
/**
 * A bounding box is an enclosing box that describes the smallest measure within which all the points lie.
 * It is used to calculate the bounding box of a glyph or text path.
 *
 * On initialization, x1/y1/x2/y2 will be NaN. Check if the bounding box is empty using `isEmpty()`.
 *
 * @exports opentype.BoundingBox
 * @class
 * @constructor
 */


function BoundingBox() {
  this.x1 = Number.NaN;
  this.y1 = Number.NaN;
  this.x2 = Number.NaN;
  this.y2 = Number.NaN;
}
/**
 * Returns true if the bounding box is empty, that is, no points have been added to the box yet.
 */


BoundingBox.prototype.isEmpty = function () {
  return isNaN(this.x1) || isNaN(this.y1) || isNaN(this.x2) || isNaN(this.y2);
};
/**
 * Add the point to the bounding box.
 * The x1/y1/x2/y2 coordinates of the bounding box will now encompass the given point.
 * @param {number} x - The X coordinate of the point.
 * @param {number} y - The Y coordinate of the point.
 */


BoundingBox.prototype.addPoint = function (x, y) {
  if (typeof x === 'number') {
    if (isNaN(this.x1) || isNaN(this.x2)) {
      this.x1 = x;
      this.x2 = x;
    }

    if (x < this.x1) {
      this.x1 = x;
    }

    if (x > this.x2) {
      this.x2 = x;
    }
  }

  if (typeof y === 'number') {
    if (isNaN(this.y1) || isNaN(this.y2)) {
      this.y1 = y;
      this.y2 = y;
    }

    if (y < this.y1) {
      this.y1 = y;
    }

    if (y > this.y2) {
      this.y2 = y;
    }
  }
};
/**
 * Add a X coordinate to the bounding box.
 * This extends the bounding box to include the X coordinate.
 * This function is used internally inside of addBezier.
 * @param {number} x - The X coordinate of the point.
 */


BoundingBox.prototype.addX = function (x) {
  this.addPoint(x, null);
};
/**
 * Add a Y coordinate to the bounding box.
 * This extends the bounding box to include the Y coordinate.
 * This function is used internally inside of addBezier.
 * @param {number} y - The Y coordinate of the point.
 */


BoundingBox.prototype.addY = function (y) {
  this.addPoint(null, y);
};
/**
 * Add a Bézier curve to the bounding box.
 * This extends the bounding box to include the entire Bézier.
 * @param {number} x0 - The starting X coordinate.
 * @param {number} y0 - The starting Y coordinate.
 * @param {number} x1 - The X coordinate of the first control point.
 * @param {number} y1 - The Y coordinate of the first control point.
 * @param {number} x2 - The X coordinate of the second control point.
 * @param {number} y2 - The Y coordinate of the second control point.
 * @param {number} x - The ending X coordinate.
 * @param {number} y - The ending Y coordinate.
 */


BoundingBox.prototype.addBezier = function (x0, y0, x1, y1, x2, y2, x, y) {
  // This code is based on http://nishiohirokazu.blogspot.com/2009/06/how-to-calculate-bezier-curves-bounding.html
  // and https://github.com/icons8/svg-path-bounding-box
  const p0 = [x0, y0];
  const p1 = [x1, y1];
  const p2 = [x2, y2];
  const p3 = [x, y];
  this.addPoint(x0, y0);
  this.addPoint(x, y);

  for (let i = 0; i <= 1; i++) {
    const b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
    const a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
    const c = 3 * p1[i] - 3 * p0[i];

    if (a === 0) {
      if (b === 0) continue;
      const t = -c / b;

      if (0 < t && t < 1) {
        if (i === 0) this.addX(derive(p0[i], p1[i], p2[i], p3[i], t));
        if (i === 1) this.addY(derive(p0[i], p1[i], p2[i], p3[i], t));
      }

      continue;
    }

    const b2ac = Math.pow(b, 2) - 4 * c * a;
    if (b2ac < 0) continue;
    const t1 = (-b + Math.sqrt(b2ac)) / (2 * a);

    if (0 < t1 && t1 < 1) {
      if (i === 0) this.addX(derive(p0[i], p1[i], p2[i], p3[i], t1));
      if (i === 1) this.addY(derive(p0[i], p1[i], p2[i], p3[i], t1));
    }

    const t2 = (-b - Math.sqrt(b2ac)) / (2 * a);

    if (0 < t2 && t2 < 1) {
      if (i === 0) this.addX(derive(p0[i], p1[i], p2[i], p3[i], t2));
      if (i === 1) this.addY(derive(p0[i], p1[i], p2[i], p3[i], t2));
    }
  }
};
/**
 * Add a quadratic curve to the bounding box.
 * This extends the bounding box to include the entire quadratic curve.
 * @param {number} x0 - The starting X coordinate.
 * @param {number} y0 - The starting Y coordinate.
 * @param {number} x1 - The X coordinate of the control point.
 * @param {number} y1 - The Y coordinate of the control point.
 * @param {number} x - The ending X coordinate.
 * @param {number} y - The ending Y coordinate.
 */


BoundingBox.prototype.addQuad = function (x0, y0, x1, y1, x, y) {
  const cp1x = x0 + 2 / 3 * (x1 - x0);
  const cp1y = y0 + 2 / 3 * (y1 - y0);
  const cp2x = cp1x + 1 / 3 * (x - x0);
  const cp2y = cp1y + 1 / 3 * (y - y0);
  this.addBezier(x0, y0, cp1x, cp1y, cp2x, cp2y, x, y);
};

var _default = BoundingBox;
exports.default = _default;
},{}],"../node_modules/opentype.js/src/path.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bbox = _interopRequireDefault(require("./bbox"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Geometric objects

/**
 * A bézier path containing a set of path commands similar to a SVG path.
 * Paths can be drawn on a context using `draw`.
 * @exports opentype.Path
 * @class
 * @constructor
 */
function Path() {
  this.commands = [];
  this.fill = 'black';
  this.stroke = null;
  this.strokeWidth = 1;
}
/**
 * @param  {number} x
 * @param  {number} y
 */


Path.prototype.moveTo = function (x, y) {
  this.commands.push({
    type: 'M',
    x: x,
    y: y
  });
};
/**
 * @param  {number} x
 * @param  {number} y
 */


Path.prototype.lineTo = function (x, y) {
  this.commands.push({
    type: 'L',
    x: x,
    y: y
  });
};
/**
 * Draws cubic curve
 * @function
 * curveTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control 1
 * @param  {number} y1 - y of control 1
 * @param  {number} x2 - x of control 2
 * @param  {number} y2 - y of control 2
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 */

/**
 * Draws cubic curve
 * @function
 * bezierCurveTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control 1
 * @param  {number} y1 - y of control 1
 * @param  {number} x2 - x of control 2
 * @param  {number} y2 - y of control 2
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 * @see curveTo
 */


Path.prototype.curveTo = Path.prototype.bezierCurveTo = function (x1, y1, x2, y2, x, y) {
  this.commands.push({
    type: 'C',
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    x: x,
    y: y
  });
};
/**
 * Draws quadratic curve
 * @function
 * quadraticCurveTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control
 * @param  {number} y1 - y of control
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 */

/**
 * Draws quadratic curve
 * @function
 * quadTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control
 * @param  {number} y1 - y of control
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 */


Path.prototype.quadTo = Path.prototype.quadraticCurveTo = function (x1, y1, x, y) {
  this.commands.push({
    type: 'Q',
    x1: x1,
    y1: y1,
    x: x,
    y: y
  });
};
/**
 * Closes the path
 * @function closePath
 * @memberof opentype.Path.prototype
 */

/**
 * Close the path
 * @function close
 * @memberof opentype.Path.prototype
 */


Path.prototype.close = Path.prototype.closePath = function () {
  this.commands.push({
    type: 'Z'
  });
};
/**
 * Add the given path or list of commands to the commands of this path.
 * @param  {Array} pathOrCommands - another opentype.Path, an opentype.BoundingBox, or an array of commands.
 */


Path.prototype.extend = function (pathOrCommands) {
  if (pathOrCommands.commands) {
    pathOrCommands = pathOrCommands.commands;
  } else if (pathOrCommands instanceof _bbox.default) {
    const box = pathOrCommands;
    this.moveTo(box.x1, box.y1);
    this.lineTo(box.x2, box.y1);
    this.lineTo(box.x2, box.y2);
    this.lineTo(box.x1, box.y2);
    this.close();
    return;
  }

  Array.prototype.push.apply(this.commands, pathOrCommands);
};
/**
 * Calculate the bounding box of the path.
 * @returns {opentype.BoundingBox}
 */


Path.prototype.getBoundingBox = function () {
  const box = new _bbox.default();
  let startX = 0;
  let startY = 0;
  let prevX = 0;
  let prevY = 0;

  for (let i = 0; i < this.commands.length; i++) {
    const cmd = this.commands[i];

    switch (cmd.type) {
      case 'M':
        box.addPoint(cmd.x, cmd.y);
        startX = prevX = cmd.x;
        startY = prevY = cmd.y;
        break;

      case 'L':
        box.addPoint(cmd.x, cmd.y);
        prevX = cmd.x;
        prevY = cmd.y;
        break;

      case 'Q':
        box.addQuad(prevX, prevY, cmd.x1, cmd.y1, cmd.x, cmd.y);
        prevX = cmd.x;
        prevY = cmd.y;
        break;

      case 'C':
        box.addBezier(prevX, prevY, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
        prevX = cmd.x;
        prevY = cmd.y;
        break;

      case 'Z':
        prevX = startX;
        prevY = startY;
        break;

      default:
        throw new Error('Unexpected path command ' + cmd.type);
    }
  }

  if (box.isEmpty()) {
    box.addPoint(0, 0);
  }

  return box;
};
/**
 * Draw the path to a 2D context.
 * @param {CanvasRenderingContext2D} ctx - A 2D drawing context.
 */


Path.prototype.draw = function (ctx) {
  ctx.beginPath();

  for (let i = 0; i < this.commands.length; i += 1) {
    const cmd = this.commands[i];

    if (cmd.type === 'M') {
      ctx.moveTo(cmd.x, cmd.y);
    } else if (cmd.type === 'L') {
      ctx.lineTo(cmd.x, cmd.y);
    } else if (cmd.type === 'C') {
      ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
    } else if (cmd.type === 'Q') {
      ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
    } else if (cmd.type === 'Z') {
      ctx.closePath();
    }
  }

  if (this.fill) {
    ctx.fillStyle = this.fill;
    ctx.fill();
  }

  if (this.stroke) {
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = this.strokeWidth;
    ctx.stroke();
  }
};
/**
 * Convert the Path to a string of path data instructions
 * See http://www.w3.org/TR/SVG/paths.html#PathData
 * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
 * @return {string}
 */


Path.prototype.toPathData = function (decimalPlaces) {
  decimalPlaces = decimalPlaces !== undefined ? decimalPlaces : 2;

  function floatToString(v) {
    if (Math.round(v) === v) {
      return '' + Math.round(v);
    } else {
      return v.toFixed(decimalPlaces);
    }
  }

  function packValues() {
    let s = '';

    for (let i = 0; i < arguments.length; i += 1) {
      const v = arguments[i];

      if (v >= 0 && i > 0) {
        s += ' ';
      }

      s += floatToString(v);
    }

    return s;
  }

  let d = '';

  for (let i = 0; i < this.commands.length; i += 1) {
    const cmd = this.commands[i];

    if (cmd.type === 'M') {
      d += 'M' + packValues(cmd.x, cmd.y);
    } else if (cmd.type === 'L') {
      d += 'L' + packValues(cmd.x, cmd.y);
    } else if (cmd.type === 'C') {
      d += 'C' + packValues(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
    } else if (cmd.type === 'Q') {
      d += 'Q' + packValues(cmd.x1, cmd.y1, cmd.x, cmd.y);
    } else if (cmd.type === 'Z') {
      d += 'Z';
    }
  }

  return d;
};
/**
 * Convert the path to an SVG <path> element, as a string.
 * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
 * @return {string}
 */


Path.prototype.toSVG = function (decimalPlaces) {
  let svg = '<path d="';
  svg += this.toPathData(decimalPlaces);
  svg += '"';

  if (this.fill && this.fill !== 'black') {
    if (this.fill === null) {
      svg += ' fill="none"';
    } else {
      svg += ' fill="' + this.fill + '"';
    }
  }

  if (this.stroke) {
    svg += ' stroke="' + this.stroke + '" stroke-width="' + this.strokeWidth + '"';
  }

  svg += '/>';
  return svg;
};
/**
 * Convert the path to a DOM element.
 * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
 * @return {SVGPathElement}
 */


Path.prototype.toDOMElement = function (decimalPlaces) {
  const temporaryPath = this.toPathData(decimalPlaces);
  const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  newPath.setAttribute('d', temporaryPath);
  return newPath;
};

var _default = Path;
exports.default = _default;
},{"./bbox":"../node_modules/opentype.js/src/bbox.js"}],"../node_modules/opentype.js/src/check.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fail = fail;
exports.assert = exports.argument = argument;
exports.default = void 0;

// Run-time checking of preconditions.
function fail(message) {
  throw new Error(message);
} // Precondition function that checks if the given predicate is true.
// If not, it will throw an error.


function argument(predicate, message) {
  if (!predicate) {
    fail(message);
  }
}

var _default = {
  fail,
  argument,
  assert: argument
};
exports.default = _default;
},{}],"../node_modules/opentype.js/src/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sizeOf = exports.encode = exports.decode = void 0;

var _check = _interopRequireDefault(require("./check"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Data types used in the OpenType font file.
// All OpenType fonts use Motorola-style byte ordering (Big Endian)
const LIMIT16 = 32768; // The limit at which a 16-bit number switches signs == 2^15

const LIMIT32 = 2147483648; // The limit at which a 32-bit number switches signs == 2 ^ 31

/**
 * @exports opentype.decode
 * @class
 */

const decode = {};
/**
 * @exports opentype.encode
 * @class
 */

exports.decode = decode;
const encode = {};
/**
 * @exports opentype.sizeOf
 * @class
 */

exports.encode = encode;
const sizeOf = {}; // Return a function that always returns the same value.

exports.sizeOf = sizeOf;

function constant(v) {
  return function () {
    return v;
  };
} // OpenType data types //////////////////////////////////////////////////////

/**
 * Convert an 8-bit unsigned integer to a list of 1 byte.
 * @param {number}
 * @returns {Array}
 */


encode.BYTE = function (v) {
  _check.default.argument(v >= 0 && v <= 255, 'Byte value should be between 0 and 255.');

  return [v];
};
/**
 * @constant
 * @type {number}
 */


sizeOf.BYTE = constant(1);
/**
 * Convert a 8-bit signed integer to a list of 1 byte.
 * @param {string}
 * @returns {Array}
 */

encode.CHAR = function (v) {
  return [v.charCodeAt(0)];
};
/**
 * @constant
 * @type {number}
 */


sizeOf.CHAR = constant(1);
/**
 * Convert an ASCII string to a list of bytes.
 * @param {string}
 * @returns {Array}
 */

encode.CHARARRAY = function (v) {
  const b = [];

  for (let i = 0; i < v.length; i += 1) {
    b[i] = v.charCodeAt(i);
  }

  return b;
};
/**
 * @param {Array}
 * @returns {number}
 */


sizeOf.CHARARRAY = function (v) {
  return v.length;
};
/**
 * Convert a 16-bit unsigned integer to a list of 2 bytes.
 * @param {number}
 * @returns {Array}
 */


encode.USHORT = function (v) {
  return [v >> 8 & 0xFF, v & 0xFF];
};
/**
 * @constant
 * @type {number}
 */


sizeOf.USHORT = constant(2);
/**
 * Convert a 16-bit signed integer to a list of 2 bytes.
 * @param {number}
 * @returns {Array}
 */

encode.SHORT = function (v) {
  // Two's complement
  if (v >= LIMIT16) {
    v = -(2 * LIMIT16 - v);
  }

  return [v >> 8 & 0xFF, v & 0xFF];
};
/**
 * @constant
 * @type {number}
 */


sizeOf.SHORT = constant(2);
/**
 * Convert a 24-bit unsigned integer to a list of 3 bytes.
 * @param {number}
 * @returns {Array}
 */

encode.UINT24 = function (v) {
  return [v >> 16 & 0xFF, v >> 8 & 0xFF, v & 0xFF];
};
/**
 * @constant
 * @type {number}
 */


sizeOf.UINT24 = constant(3);
/**
 * Convert a 32-bit unsigned integer to a list of 4 bytes.
 * @param {number}
 * @returns {Array}
 */

encode.ULONG = function (v) {
  return [v >> 24 & 0xFF, v >> 16 & 0xFF, v >> 8 & 0xFF, v & 0xFF];
};
/**
 * @constant
 * @type {number}
 */


sizeOf.ULONG = constant(4);
/**
 * Convert a 32-bit unsigned integer to a list of 4 bytes.
 * @param {number}
 * @returns {Array}
 */

encode.LONG = function (v) {
  // Two's complement
  if (v >= LIMIT32) {
    v = -(2 * LIMIT32 - v);
  }

  return [v >> 24 & 0xFF, v >> 16 & 0xFF, v >> 8 & 0xFF, v & 0xFF];
};
/**
 * @constant
 * @type {number}
 */


sizeOf.LONG = constant(4);
encode.FIXED = encode.ULONG;
sizeOf.FIXED = sizeOf.ULONG;
encode.FWORD = encode.SHORT;
sizeOf.FWORD = sizeOf.SHORT;
encode.UFWORD = encode.USHORT;
sizeOf.UFWORD = sizeOf.USHORT;
/**
 * Convert a 32-bit Apple Mac timestamp integer to a list of 8 bytes, 64-bit timestamp.
 * @param {number}
 * @returns {Array}
 */

encode.LONGDATETIME = function (v) {
  return [0, 0, 0, 0, v >> 24 & 0xFF, v >> 16 & 0xFF, v >> 8 & 0xFF, v & 0xFF];
};
/**
 * @constant
 * @type {number}
 */


sizeOf.LONGDATETIME = constant(8);
/**
 * Convert a 4-char tag to a list of 4 bytes.
 * @param {string}
 * @returns {Array}
 */

encode.TAG = function (v) {
  _check.default.argument(v.length === 4, 'Tag should be exactly 4 ASCII characters.');

  return [v.charCodeAt(0), v.charCodeAt(1), v.charCodeAt(2), v.charCodeAt(3)];
};
/**
 * @constant
 * @type {number}
 */


sizeOf.TAG = constant(4); // CFF data types ///////////////////////////////////////////////////////////

encode.Card8 = encode.BYTE;
sizeOf.Card8 = sizeOf.BYTE;
encode.Card16 = encode.USHORT;
sizeOf.Card16 = sizeOf.USHORT;
encode.OffSize = encode.BYTE;
sizeOf.OffSize = sizeOf.BYTE;
encode.SID = encode.USHORT;
sizeOf.SID = sizeOf.USHORT; // Convert a numeric operand or charstring number to a variable-size list of bytes.

/**
 * Convert a numeric operand or charstring number to a variable-size list of bytes.
 * @param {number}
 * @returns {Array}
 */

encode.NUMBER = function (v) {
  if (v >= -107 && v <= 107) {
    return [v + 139];
  } else if (v >= 108 && v <= 1131) {
    v = v - 108;
    return [(v >> 8) + 247, v & 0xFF];
  } else if (v >= -1131 && v <= -108) {
    v = -v - 108;
    return [(v >> 8) + 251, v & 0xFF];
  } else if (v >= -32768 && v <= 32767) {
    return encode.NUMBER16(v);
  } else {
    return encode.NUMBER32(v);
  }
};
/**
 * @param {number}
 * @returns {number}
 */


sizeOf.NUMBER = function (v) {
  return encode.NUMBER(v).length;
};
/**
 * Convert a signed number between -32768 and +32767 to a three-byte value.
 * This ensures we always use three bytes, but is not the most compact format.
 * @param {number}
 * @returns {Array}
 */


encode.NUMBER16 = function (v) {
  return [28, v >> 8 & 0xFF, v & 0xFF];
};
/**
 * @constant
 * @type {number}
 */


sizeOf.NUMBER16 = constant(3);
/**
 * Convert a signed number between -(2^31) and +(2^31-1) to a five-byte value.
 * This is useful if you want to be sure you always use four bytes,
 * at the expense of wasting a few bytes for smaller numbers.
 * @param {number}
 * @returns {Array}
 */

encode.NUMBER32 = function (v) {
  return [29, v >> 24 & 0xFF, v >> 16 & 0xFF, v >> 8 & 0xFF, v & 0xFF];
};
/**
 * @constant
 * @type {number}
 */


sizeOf.NUMBER32 = constant(5);
/**
 * @param {number}
 * @returns {Array}
 */

encode.REAL = function (v) {
  let value = v.toString(); // Some numbers use an epsilon to encode the value. (e.g. JavaScript will store 0.0000001 as 1e-7)
  // This code converts it back to a number without the epsilon.

  const m = /\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/.exec(value);

  if (m) {
    const epsilon = parseFloat('1e' + ((m[2] ? +m[2] : 0) + m[1].length));
    value = (Math.round(v * epsilon) / epsilon).toString();
  }

  let nibbles = '';

  for (let i = 0, ii = value.length; i < ii; i += 1) {
    const c = value[i];

    if (c === 'e') {
      nibbles += value[++i] === '-' ? 'c' : 'b';
    } else if (c === '.') {
      nibbles += 'a';
    } else if (c === '-') {
      nibbles += 'e';
    } else {
      nibbles += c;
    }
  }

  nibbles += nibbles.length & 1 ? 'f' : 'ff';
  const out = [30];

  for (let i = 0, ii = nibbles.length; i < ii; i += 2) {
    out.push(parseInt(nibbles.substr(i, 2), 16));
  }

  return out;
};
/**
 * @param {number}
 * @returns {number}
 */


sizeOf.REAL = function (v) {
  return encode.REAL(v).length;
};

encode.NAME = encode.CHARARRAY;
sizeOf.NAME = sizeOf.CHARARRAY;
encode.STRING = encode.CHARARRAY;
sizeOf.STRING = sizeOf.CHARARRAY;
/**
 * @param {DataView} data
 * @param {number} offset
 * @param {number} numBytes
 * @returns {string}
 */

decode.UTF8 = function (data, offset, numBytes) {
  const codePoints = [];
  const numChars = numBytes;

  for (let j = 0; j < numChars; j++, offset += 1) {
    codePoints[j] = data.getUint8(offset);
  }

  return String.fromCharCode.apply(null, codePoints);
};
/**
 * @param {DataView} data
 * @param {number} offset
 * @param {number} numBytes
 * @returns {string}
 */


decode.UTF16 = function (data, offset, numBytes) {
  const codePoints = [];
  const numChars = numBytes / 2;

  for (let j = 0; j < numChars; j++, offset += 2) {
    codePoints[j] = data.getUint16(offset);
  }

  return String.fromCharCode.apply(null, codePoints);
};
/**
 * Convert a JavaScript string to UTF16-BE.
 * @param {string}
 * @returns {Array}
 */


encode.UTF16 = function (v) {
  const b = [];

  for (let i = 0; i < v.length; i += 1) {
    const codepoint = v.charCodeAt(i);
    b[b.length] = codepoint >> 8 & 0xFF;
    b[b.length] = codepoint & 0xFF;
  }

  return b;
};
/**
 * @param {string}
 * @returns {number}
 */


sizeOf.UTF16 = function (v) {
  return v.length * 2;
}; // Data for converting old eight-bit Macintosh encodings to Unicode.
// This representation is optimized for decoding; encoding is slower
// and needs more memory. The assumption is that all opentype.js users
// want to open fonts, but saving a font will be comparatively rare
// so it can be more expensive. Keyed by IANA character set name.
//
// Python script for generating these strings:
//
//     s = u''.join([chr(c).decode('mac_greek') for c in range(128, 256)])
//     print(s.encode('utf-8'))

/**
 * @private
 */


const eightBitMacEncodings = {
  'x-mac-croatian': // Python: 'mac_croatian'
  'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø' + '¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊©⁄€‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ',
  'x-mac-cyrillic': // Python: 'mac_cyrillic'
  'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњ' + 'јЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю',
  'x-mac-gaelic': // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/GAELIC.TXT
  'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØḂ±≤≥ḃĊċḊḋḞḟĠġṀæø' + 'ṁṖṗɼƒſṠ«»… ÀÃÕŒœ–—“”‘’ṡẛÿŸṪ€‹›Ŷŷṫ·Ỳỳ⁊ÂÊÁËÈÍÎÏÌÓÔ♣ÒÚÛÙıÝýŴŵẄẅẀẁẂẃ',
  'x-mac-greek': // Python: 'mac_greek'
  'Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦€ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩ' + 'άΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ\u00AD',
  'x-mac-icelandic': // Python: 'mac_iceland'
  'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' + '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
  'x-mac-inuit': // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/INUIT.TXT
  'ᐃᐄᐅᐆᐊᐋᐱᐲᐳᐴᐸᐹᑉᑎᑏᑐᑑᑕᑖᑦᑭᑮᑯᑰᑲᑳᒃᒋᒌᒍᒎᒐᒑ°ᒡᒥᒦ•¶ᒧ®©™ᒨᒪᒫᒻᓂᓃᓄᓅᓇᓈᓐᓯᓰᓱᓲᓴᓵᔅᓕᓖᓗ' + 'ᓘᓚᓛᓪᔨᔩᔪᔫᔭ… ᔮᔾᕕᕖᕗ–—“”‘’ᕘᕙᕚᕝᕆᕇᕈᕉᕋᕌᕐᕿᖀᖁᖂᖃᖄᖅᖏᖐᖑᖒᖓᖔᖕᙱᙲᙳᙴᙵᙶᖖᖠᖡᖢᖣᖤᖥᖦᕼŁł',
  'x-mac-ce': // Python: 'mac_latin2'
  'ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅ' + 'ņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ',
  macintosh: // Python: 'mac_roman'
  'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' + '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
  'x-mac-romanian': // Python: 'mac_romanian'
  'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂȘ∞±≤≥¥µ∂∑∏π∫ªºΩăș' + '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›Țț‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
  'x-mac-turkish': // Python: 'mac_turkish'
  'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' + '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙˆ˜¯˘˙˚¸˝˛ˇ'
};
/**
 * Decodes an old-style Macintosh string. Returns either a Unicode JavaScript
 * string, or 'undefined' if the encoding is unsupported. For example, we do
 * not support Chinese, Japanese or Korean because these would need large
 * mapping tables.
 * @param {DataView} dataView
 * @param {number} offset
 * @param {number} dataLength
 * @param {string} encoding
 * @returns {string}
 */

decode.MACSTRING = function (dataView, offset, dataLength, encoding) {
  const table = eightBitMacEncodings[encoding];

  if (table === undefined) {
    return undefined;
  }

  let result = '';

  for (let i = 0; i < dataLength; i++) {
    const c = dataView.getUint8(offset + i); // In all eight-bit Mac encodings, the characters 0x00..0x7F are
    // mapped to U+0000..U+007F; we only need to look up the others.

    if (c <= 0x7F) {
      result += String.fromCharCode(c);
    } else {
      result += table[c & 0x7F];
    }
  }

  return result;
}; // Helper function for encode.MACSTRING. Returns a dictionary for mapping
// Unicode character codes to their 8-bit MacOS equivalent. This table
// is not exactly a super cheap data structure, but we do not care because
// encoding Macintosh strings is only rarely needed in typical applications.


const macEncodingTableCache = typeof WeakMap === 'function' && new WeakMap();
let macEncodingCacheKeys;

const getMacEncodingTable = function (encoding) {
  // Since we use encoding as a cache key for WeakMap, it has to be
  // a String object and not a literal. And at least on NodeJS 2.10.1,
  // WeakMap requires that the same String instance is passed for cache hits.
  if (!macEncodingCacheKeys) {
    macEncodingCacheKeys = {};

    for (let e in eightBitMacEncodings) {
      /*jshint -W053 */
      // Suppress "Do not use String as a constructor."
      macEncodingCacheKeys[e] = new String(e);
    }
  }

  const cacheKey = macEncodingCacheKeys[encoding];

  if (cacheKey === undefined) {
    return undefined;
  } // We can't do "if (cache.has(key)) {return cache.get(key)}" here:
  // since garbage collection may run at any time, it could also kick in
  // between the calls to cache.has() and cache.get(). In that case,
  // we would return 'undefined' even though we do support the encoding.


  if (macEncodingTableCache) {
    const cachedTable = macEncodingTableCache.get(cacheKey);

    if (cachedTable !== undefined) {
      return cachedTable;
    }
  }

  const decodingTable = eightBitMacEncodings[encoding];

  if (decodingTable === undefined) {
    return undefined;
  }

  const encodingTable = {};

  for (let i = 0; i < decodingTable.length; i++) {
    encodingTable[decodingTable.charCodeAt(i)] = i + 0x80;
  }

  if (macEncodingTableCache) {
    macEncodingTableCache.set(cacheKey, encodingTable);
  }

  return encodingTable;
};
/**
 * Encodes an old-style Macintosh string. Returns a byte array upon success.
 * If the requested encoding is unsupported, or if the input string contains
 * a character that cannot be expressed in the encoding, the function returns
 * 'undefined'.
 * @param {string} str
 * @param {string} encoding
 * @returns {Array}
 */


encode.MACSTRING = function (str, encoding) {
  const table = getMacEncodingTable(encoding);

  if (table === undefined) {
    return undefined;
  }

  const result = [];

  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i); // In all eight-bit Mac encodings, the characters 0x00..0x7F are
    // mapped to U+0000..U+007F; we only need to look up the others.

    if (c >= 0x80) {
      c = table[c];

      if (c === undefined) {
        // str contains a Unicode character that cannot be encoded
        // in the requested encoding.
        return undefined;
      }
    }

    result[i] = c; // result.push(c);
  }

  return result;
};
/**
 * @param {string} str
 * @param {string} encoding
 * @returns {number}
 */


sizeOf.MACSTRING = function (str, encoding) {
  const b = encode.MACSTRING(str, encoding);

  if (b !== undefined) {
    return b.length;
  } else {
    return 0;
  }
}; // Helper for encode.VARDELTAS


function isByteEncodable(value) {
  return value >= -128 && value <= 127;
} // Helper for encode.VARDELTAS


function encodeVarDeltaRunAsZeroes(deltas, pos, result) {
  let runLength = 0;
  const numDeltas = deltas.length;

  while (pos < numDeltas && runLength < 64 && deltas[pos] === 0) {
    ++pos;
    ++runLength;
  }

  result.push(0x80 | runLength - 1);
  return pos;
} // Helper for encode.VARDELTAS


function encodeVarDeltaRunAsBytes(deltas, offset, result) {
  let runLength = 0;
  const numDeltas = deltas.length;
  let pos = offset;

  while (pos < numDeltas && runLength < 64) {
    const value = deltas[pos];

    if (!isByteEncodable(value)) {
      break;
    } // Within a byte-encoded run of deltas, a single zero is best
    // stored literally as 0x00 value. However, if we have two or
    // more zeroes in a sequence, it is better to start a new run.
    // Fore example, the sequence of deltas [15, 15, 0, 15, 15]
    // becomes 6 bytes (04 0F 0F 00 0F 0F) when storing the zero
    // within the current run, but 7 bytes (01 0F 0F 80 01 0F 0F)
    // when starting a new run.


    if (value === 0 && pos + 1 < numDeltas && deltas[pos + 1] === 0) {
      break;
    }

    ++pos;
    ++runLength;
  }

  result.push(runLength - 1);

  for (let i = offset; i < pos; ++i) {
    result.push(deltas[i] + 256 & 0xff);
  }

  return pos;
} // Helper for encode.VARDELTAS


function encodeVarDeltaRunAsWords(deltas, offset, result) {
  let runLength = 0;
  const numDeltas = deltas.length;
  let pos = offset;

  while (pos < numDeltas && runLength < 64) {
    const value = deltas[pos]; // Within a word-encoded run of deltas, it is easiest to start
    // a new run (with a different encoding) whenever we encounter
    // a zero value. For example, the sequence [0x6666, 0, 0x7777]
    // needs 7 bytes when storing the zero inside the current run
    // (42 66 66 00 00 77 77), and equally 7 bytes when starting a
    // new run (40 66 66 80 40 77 77).

    if (value === 0) {
      break;
    } // Within a word-encoded run of deltas, a single value in the
    // range (-128..127) should be encoded within the current run
    // because it is more compact. For example, the sequence
    // [0x6666, 2, 0x7777] becomes 7 bytes when storing the value
    // literally (42 66 66 00 02 77 77), but 8 bytes when starting
    // a new run (40 66 66 00 02 40 77 77).


    if (isByteEncodable(value) && pos + 1 < numDeltas && isByteEncodable(deltas[pos + 1])) {
      break;
    }

    ++pos;
    ++runLength;
  }

  result.push(0x40 | runLength - 1);

  for (let i = offset; i < pos; ++i) {
    const val = deltas[i];
    result.push(val + 0x10000 >> 8 & 0xff, val + 0x100 & 0xff);
  }

  return pos;
}
/**
 * Encode a list of variation adjustment deltas.
 *
 * Variation adjustment deltas are used in ‘gvar’ and ‘cvar’ tables.
 * They indicate how points (in ‘gvar’) or values (in ‘cvar’) get adjusted
 * when generating instances of variation fonts.
 *
 * @see https://www.microsoft.com/typography/otspec/gvar.htm
 * @see https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6gvar.html
 * @param {Array}
 * @return {Array}
 */


encode.VARDELTAS = function (deltas) {
  let pos = 0;
  const result = [];

  while (pos < deltas.length) {
    const value = deltas[pos];

    if (value === 0) {
      pos = encodeVarDeltaRunAsZeroes(deltas, pos, result);
    } else if (value >= -128 && value <= 127) {
      pos = encodeVarDeltaRunAsBytes(deltas, pos, result);
    } else {
      pos = encodeVarDeltaRunAsWords(deltas, pos, result);
    }
  }

  return result;
}; // Convert a list of values to a CFF INDEX structure.
// The values should be objects containing name / type / value.

/**
 * @param {Array} l
 * @returns {Array}
 */


encode.INDEX = function (l) {
  //var offset, offsets, offsetEncoder, encodedOffsets, encodedOffset, data,
  //    i, v;
  // Because we have to know which data type to use to encode the offsets,
  // we have to go through the values twice: once to encode the data and
  // calculate the offsets, then again to encode the offsets using the fitting data type.
  let offset = 1; // First offset is always 1.

  const offsets = [offset];
  const data = [];

  for (let i = 0; i < l.length; i += 1) {
    const v = encode.OBJECT(l[i]);
    Array.prototype.push.apply(data, v);
    offset += v.length;
    offsets.push(offset);
  }

  if (data.length === 0) {
    return [0, 0];
  }

  const encodedOffsets = [];
  const offSize = 1 + Math.floor(Math.log(offset) / Math.log(2)) / 8 | 0;
  const offsetEncoder = [undefined, encode.BYTE, encode.USHORT, encode.UINT24, encode.ULONG][offSize];

  for (let i = 0; i < offsets.length; i += 1) {
    const encodedOffset = offsetEncoder(offsets[i]);
    Array.prototype.push.apply(encodedOffsets, encodedOffset);
  }

  return Array.prototype.concat(encode.Card16(l.length), encode.OffSize(offSize), encodedOffsets, data);
};
/**
 * @param {Array}
 * @returns {number}
 */


sizeOf.INDEX = function (v) {
  return encode.INDEX(v).length;
};
/**
 * Convert an object to a CFF DICT structure.
 * The keys should be numeric.
 * The values should be objects containing name / type / value.
 * @param {Object} m
 * @returns {Array}
 */


encode.DICT = function (m) {
  let d = [];
  const keys = Object.keys(m);
  const length = keys.length;

  for (let i = 0; i < length; i += 1) {
    // Object.keys() return string keys, but our keys are always numeric.
    const k = parseInt(keys[i], 0);
    const v = m[k]; // Value comes before the key.

    d = d.concat(encode.OPERAND(v.value, v.type));
    d = d.concat(encode.OPERATOR(k));
  }

  return d;
};
/**
 * @param {Object}
 * @returns {number}
 */


sizeOf.DICT = function (m) {
  return encode.DICT(m).length;
};
/**
 * @param {number}
 * @returns {Array}
 */


encode.OPERATOR = function (v) {
  if (v < 1200) {
    return [v];
  } else {
    return [12, v - 1200];
  }
};
/**
 * @param {Array} v
 * @param {string}
 * @returns {Array}
 */


encode.OPERAND = function (v, type) {
  let d = [];

  if (Array.isArray(type)) {
    for (let i = 0; i < type.length; i += 1) {
      _check.default.argument(v.length === type.length, 'Not enough arguments given for type' + type);

      d = d.concat(encode.OPERAND(v[i], type[i]));
    }
  } else {
    if (type === 'SID') {
      d = d.concat(encode.NUMBER(v));
    } else if (type === 'offset') {
      // We make it easy for ourselves and always encode offsets as
      // 4 bytes. This makes offset calculation for the top dict easier.
      d = d.concat(encode.NUMBER32(v));
    } else if (type === 'number') {
      d = d.concat(encode.NUMBER(v));
    } else if (type === 'real') {
      d = d.concat(encode.REAL(v));
    } else {
      throw new Error('Unknown operand type ' + type); // FIXME Add support for booleans
    }
  }

  return d;
};

encode.OP = encode.BYTE;
sizeOf.OP = sizeOf.BYTE; // memoize charstring encoding using WeakMap if available

const wmm = typeof WeakMap === 'function' && new WeakMap();
/**
 * Convert a list of CharString operations to bytes.
 * @param {Array}
 * @returns {Array}
 */

encode.CHARSTRING = function (ops) {
  // See encode.MACSTRING for why we don't do "if (wmm && wmm.has(ops))".
  if (wmm) {
    const cachedValue = wmm.get(ops);

    if (cachedValue !== undefined) {
      return cachedValue;
    }
  }

  let d = [];
  const length = ops.length;

  for (let i = 0; i < length; i += 1) {
    const op = ops[i];
    d = d.concat(encode[op.type](op.value));
  }

  if (wmm) {
    wmm.set(ops, d);
  }

  return d;
};
/**
 * @param {Array}
 * @returns {number}
 */


sizeOf.CHARSTRING = function (ops) {
  return encode.CHARSTRING(ops).length;
}; // Utility functions ////////////////////////////////////////////////////////

/**
 * Convert an object containing name / type / value to bytes.
 * @param {Object}
 * @returns {Array}
 */


encode.OBJECT = function (v) {
  const encodingFunction = encode[v.type];

  _check.default.argument(encodingFunction !== undefined, 'No encoding function for type ' + v.type);

  return encodingFunction(v.value);
};
/**
 * @param {Object}
 * @returns {number}
 */


sizeOf.OBJECT = function (v) {
  const sizeOfFunction = sizeOf[v.type];

  _check.default.argument(sizeOfFunction !== undefined, 'No sizeOf function for type ' + v.type);

  return sizeOfFunction(v.value);
};
/**
 * Convert a table object to bytes.
 * A table contains a list of fields containing the metadata (name, type and default value).
 * The table itself has the field values set as attributes.
 * @param {opentype.Table}
 * @returns {Array}
 */


encode.TABLE = function (table) {
  let d = [];
  const length = table.fields.length;
  const subtables = [];
  const subtableOffsets = [];

  for (let i = 0; i < length; i += 1) {
    const field = table.fields[i];
    const encodingFunction = encode[field.type];

    _check.default.argument(encodingFunction !== undefined, 'No encoding function for field type ' + field.type + ' (' + field.name + ')');

    let value = table[field.name];

    if (value === undefined) {
      value = field.value;
    }

    const bytes = encodingFunction(value);

    if (field.type === 'TABLE') {
      subtableOffsets.push(d.length);
      d = d.concat([0, 0]);
      subtables.push(bytes);
    } else {
      d = d.concat(bytes);
    }
  }

  for (let i = 0; i < subtables.length; i += 1) {
    const o = subtableOffsets[i];
    const offset = d.length;

    _check.default.argument(offset < 65536, 'Table ' + table.tableName + ' too big.');

    d[o] = offset >> 8;
    d[o + 1] = offset & 0xff;
    d = d.concat(subtables[i]);
  }

  return d;
};
/**
 * @param {opentype.Table}
 * @returns {number}
 */


sizeOf.TABLE = function (table) {
  let numBytes = 0;
  const length = table.fields.length;

  for (let i = 0; i < length; i += 1) {
    const field = table.fields[i];
    const sizeOfFunction = sizeOf[field.type];

    _check.default.argument(sizeOfFunction !== undefined, 'No sizeOf function for field type ' + field.type + ' (' + field.name + ')');

    let value = table[field.name];

    if (value === undefined) {
      value = field.value;
    }

    numBytes += sizeOfFunction(value); // Subtables take 2 more bytes for offsets.

    if (field.type === 'TABLE') {
      numBytes += 2;
    }
  }

  return numBytes;
};

encode.RECORD = encode.TABLE;
sizeOf.RECORD = sizeOf.TABLE; // Merge in a list of bytes.

encode.LITERAL = function (v) {
  return v;
};

sizeOf.LITERAL = function (v) {
  return v.length;
};
},{"./check":"../node_modules/opentype.js/src/check.js"}],"../node_modules/opentype.js/src/table.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _check = _interopRequireDefault(require("./check"));

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Table metadata

/**
 * @exports opentype.Table
 * @class
 * @param {string} tableName
 * @param {Array} fields
 * @param {Object} options
 * @constructor
 */
function Table(tableName, fields, options) {
  for (let i = 0; i < fields.length; i += 1) {
    const field = fields[i];
    this[field.name] = field.value;
  }

  this.tableName = tableName;
  this.fields = fields;

  if (options) {
    const optionKeys = Object.keys(options);

    for (let i = 0; i < optionKeys.length; i += 1) {
      const k = optionKeys[i];
      const v = options[k];

      if (this[k] !== undefined) {
        this[k] = v;
      }
    }
  }
}
/**
 * Encodes the table and returns an array of bytes
 * @return {Array}
 */


Table.prototype.encode = function () {
  return _types.encode.TABLE(this);
};
/**
 * Get the size of the table.
 * @return {number}
 */


Table.prototype.sizeOf = function () {
  return _types.sizeOf.TABLE(this);
};
/**
 * @private
 */


function ushortList(itemName, list, count) {
  if (count === undefined) {
    count = list.length;
  }

  const fields = new Array(list.length + 1);
  fields[0] = {
    name: itemName + 'Count',
    type: 'USHORT',
    value: count
  };

  for (let i = 0; i < list.length; i++) {
    fields[i + 1] = {
      name: itemName + i,
      type: 'USHORT',
      value: list[i]
    };
  }

  return fields;
}
/**
 * @private
 */


function tableList(itemName, records, itemCallback) {
  const count = records.length;
  const fields = new Array(count + 1);
  fields[0] = {
    name: itemName + 'Count',
    type: 'USHORT',
    value: count
  };

  for (let i = 0; i < count; i++) {
    fields[i + 1] = {
      name: itemName + i,
      type: 'TABLE',
      value: itemCallback(records[i], i)
    };
  }

  return fields;
}
/**
 * @private
 */


function recordList(itemName, records, itemCallback) {
  const count = records.length;
  let fields = [];
  fields[0] = {
    name: itemName + 'Count',
    type: 'USHORT',
    value: count
  };

  for (let i = 0; i < count; i++) {
    fields = fields.concat(itemCallback(records[i], i));
  }

  return fields;
} // Common Layout Tables

/**
 * @exports opentype.Coverage
 * @class
 * @param {opentype.Table}
 * @constructor
 * @extends opentype.Table
 */


function Coverage(coverageTable) {
  if (coverageTable.format === 1) {
    Table.call(this, 'coverageTable', [{
      name: 'coverageFormat',
      type: 'USHORT',
      value: 1
    }].concat(ushortList('glyph', coverageTable.glyphs)));
  } else {
    _check.default.assert(false, 'Can\'t create coverage table format 2 yet.');
  }
}

Coverage.prototype = Object.create(Table.prototype);
Coverage.prototype.constructor = Coverage;

function ScriptList(scriptListTable) {
  Table.call(this, 'scriptListTable', recordList('scriptRecord', scriptListTable, function (scriptRecord, i) {
    const script = scriptRecord.script;
    let defaultLangSys = script.defaultLangSys;

    _check.default.assert(!!defaultLangSys, 'Unable to write GSUB: script ' + scriptRecord.tag + ' has no default language system.');

    return [{
      name: 'scriptTag' + i,
      type: 'TAG',
      value: scriptRecord.tag
    }, {
      name: 'script' + i,
      type: 'TABLE',
      value: new Table('scriptTable', [{
        name: 'defaultLangSys',
        type: 'TABLE',
        value: new Table('defaultLangSys', [{
          name: 'lookupOrder',
          type: 'USHORT',
          value: 0
        }, {
          name: 'reqFeatureIndex',
          type: 'USHORT',
          value: defaultLangSys.reqFeatureIndex
        }].concat(ushortList('featureIndex', defaultLangSys.featureIndexes)))
      }].concat(recordList('langSys', script.langSysRecords, function (langSysRecord, i) {
        const langSys = langSysRecord.langSys;
        return [{
          name: 'langSysTag' + i,
          type: 'TAG',
          value: langSysRecord.tag
        }, {
          name: 'langSys' + i,
          type: 'TABLE',
          value: new Table('langSys', [{
            name: 'lookupOrder',
            type: 'USHORT',
            value: 0
          }, {
            name: 'reqFeatureIndex',
            type: 'USHORT',
            value: langSys.reqFeatureIndex
          }].concat(ushortList('featureIndex', langSys.featureIndexes)))
        }];
      })))
    }];
  }));
}

ScriptList.prototype = Object.create(Table.prototype);
ScriptList.prototype.constructor = ScriptList;
/**
 * @exports opentype.FeatureList
 * @class
 * @param {opentype.Table}
 * @constructor
 * @extends opentype.Table
 */

function FeatureList(featureListTable) {
  Table.call(this, 'featureListTable', recordList('featureRecord', featureListTable, function (featureRecord, i) {
    const feature = featureRecord.feature;
    return [{
      name: 'featureTag' + i,
      type: 'TAG',
      value: featureRecord.tag
    }, {
      name: 'feature' + i,
      type: 'TABLE',
      value: new Table('featureTable', [{
        name: 'featureParams',
        type: 'USHORT',
        value: feature.featureParams
      }].concat(ushortList('lookupListIndex', feature.lookupListIndexes)))
    }];
  }));
}

FeatureList.prototype = Object.create(Table.prototype);
FeatureList.prototype.constructor = FeatureList;
/**
 * @exports opentype.LookupList
 * @class
 * @param {opentype.Table}
 * @param {Object}
 * @constructor
 * @extends opentype.Table
 */

function LookupList(lookupListTable, subtableMakers) {
  Table.call(this, 'lookupListTable', tableList('lookup', lookupListTable, function (lookupTable) {
    let subtableCallback = subtableMakers[lookupTable.lookupType];

    _check.default.assert(!!subtableCallback, 'Unable to write GSUB lookup type ' + lookupTable.lookupType + ' tables.');

    return new Table('lookupTable', [{
      name: 'lookupType',
      type: 'USHORT',
      value: lookupTable.lookupType
    }, {
      name: 'lookupFlag',
      type: 'USHORT',
      value: lookupTable.lookupFlag
    }].concat(tableList('subtable', lookupTable.subtables, subtableCallback)));
  }));
}

LookupList.prototype = Object.create(Table.prototype);
LookupList.prototype.constructor = LookupList; // Record = same as Table, but inlined (a Table has an offset and its data is further in the stream)
// Don't use offsets inside Records (probable bug), only in Tables.

var _default = {
  Table,
  Record: Table,
  Coverage,
  ScriptList,
  FeatureList,
  LookupList,
  ushortList,
  tableList,
  recordList
};
exports.default = _default;
},{"./check":"../node_modules/opentype.js/src/check.js","./types":"../node_modules/opentype.js/src/types.js"}],"../node_modules/opentype.js/src/parse.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parser = Parser;
exports.default = void 0;

var _check = _interopRequireDefault(require("./check"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Parsing utility functions
// Retrieve an unsigned byte from the DataView.
function getByte(dataView, offset) {
  return dataView.getUint8(offset);
} // Retrieve an unsigned 16-bit short from the DataView.
// The value is stored in big endian.


function getUShort(dataView, offset) {
  return dataView.getUint16(offset, false);
} // Retrieve a signed 16-bit short from the DataView.
// The value is stored in big endian.


function getShort(dataView, offset) {
  return dataView.getInt16(offset, false);
} // Retrieve an unsigned 32-bit long from the DataView.
// The value is stored in big endian.


function getULong(dataView, offset) {
  return dataView.getUint32(offset, false);
} // Retrieve a 32-bit signed fixed-point number (16.16) from the DataView.
// The value is stored in big endian.


function getFixed(dataView, offset) {
  const decimal = dataView.getInt16(offset, false);
  const fraction = dataView.getUint16(offset + 2, false);
  return decimal + fraction / 65535;
} // Retrieve a 4-character tag from the DataView.
// Tags are used to identify tables.


function getTag(dataView, offset) {
  let tag = '';

  for (let i = offset; i < offset + 4; i += 1) {
    tag += String.fromCharCode(dataView.getInt8(i));
  }

  return tag;
} // Retrieve an offset from the DataView.
// Offsets are 1 to 4 bytes in length, depending on the offSize argument.


function getOffset(dataView, offset, offSize) {
  let v = 0;

  for (let i = 0; i < offSize; i += 1) {
    v <<= 8;
    v += dataView.getUint8(offset + i);
  }

  return v;
} // Retrieve a number of bytes from start offset to the end offset from the DataView.


function getBytes(dataView, startOffset, endOffset) {
  const bytes = [];

  for (let i = startOffset; i < endOffset; i += 1) {
    bytes.push(dataView.getUint8(i));
  }

  return bytes;
} // Convert the list of bytes to a string.


function bytesToString(bytes) {
  let s = '';

  for (let i = 0; i < bytes.length; i += 1) {
    s += String.fromCharCode(bytes[i]);
  }

  return s;
}

const typeOffsets = {
  byte: 1,
  uShort: 2,
  short: 2,
  uLong: 4,
  fixed: 4,
  longDateTime: 8,
  tag: 4
}; // A stateful parser that changes the offset whenever a value is retrieved.
// The data is a DataView.

function Parser(data, offset) {
  this.data = data;
  this.offset = offset;
  this.relativeOffset = 0;
}

Parser.prototype.parseByte = function () {
  const v = this.data.getUint8(this.offset + this.relativeOffset);
  this.relativeOffset += 1;
  return v;
};

Parser.prototype.parseChar = function () {
  const v = this.data.getInt8(this.offset + this.relativeOffset);
  this.relativeOffset += 1;
  return v;
};

Parser.prototype.parseCard8 = Parser.prototype.parseByte;

Parser.prototype.parseUShort = function () {
  const v = this.data.getUint16(this.offset + this.relativeOffset);
  this.relativeOffset += 2;
  return v;
};

Parser.prototype.parseCard16 = Parser.prototype.parseUShort;
Parser.prototype.parseSID = Parser.prototype.parseUShort;
Parser.prototype.parseOffset16 = Parser.prototype.parseUShort;

Parser.prototype.parseShort = function () {
  const v = this.data.getInt16(this.offset + this.relativeOffset);
  this.relativeOffset += 2;
  return v;
};

Parser.prototype.parseF2Dot14 = function () {
  const v = this.data.getInt16(this.offset + this.relativeOffset) / 16384;
  this.relativeOffset += 2;
  return v;
};

Parser.prototype.parseULong = function () {
  const v = getULong(this.data, this.offset + this.relativeOffset);
  this.relativeOffset += 4;
  return v;
};

Parser.prototype.parseOffset32 = Parser.prototype.parseULong;

Parser.prototype.parseFixed = function () {
  const v = getFixed(this.data, this.offset + this.relativeOffset);
  this.relativeOffset += 4;
  return v;
};

Parser.prototype.parseString = function (length) {
  const dataView = this.data;
  const offset = this.offset + this.relativeOffset;
  let string = '';
  this.relativeOffset += length;

  for (let i = 0; i < length; i++) {
    string += String.fromCharCode(dataView.getUint8(offset + i));
  }

  return string;
};

Parser.prototype.parseTag = function () {
  return this.parseString(4);
}; // LONGDATETIME is a 64-bit integer.
// JavaScript and unix timestamps traditionally use 32 bits, so we
// only take the last 32 bits.
// + Since until 2038 those bits will be filled by zeros we can ignore them.


Parser.prototype.parseLongDateTime = function () {
  let v = getULong(this.data, this.offset + this.relativeOffset + 4); // Subtract seconds between 01/01/1904 and 01/01/1970
  // to convert Apple Mac timestamp to Standard Unix timestamp

  v -= 2082844800;
  this.relativeOffset += 8;
  return v;
};

Parser.prototype.parseVersion = function (minorBase) {
  const major = getUShort(this.data, this.offset + this.relativeOffset); // How to interpret the minor version is very vague in the spec. 0x5000 is 5, 0x1000 is 1
  // Default returns the correct number if minor = 0xN000 where N is 0-9
  // Set minorBase to 1 for tables that use minor = N where N is 0-9

  const minor = getUShort(this.data, this.offset + this.relativeOffset + 2);
  this.relativeOffset += 4;
  if (minorBase === undefined) minorBase = 0x1000;
  return major + minor / minorBase / 10;
};

Parser.prototype.skip = function (type, amount) {
  if (amount === undefined) {
    amount = 1;
  }

  this.relativeOffset += typeOffsets[type] * amount;
}; ///// Parsing lists and records ///////////////////////////////
// Parse a list of 32 bit unsigned integers.


Parser.prototype.parseULongList = function (count) {
  if (count === undefined) {
    count = this.parseULong();
  }

  const offsets = new Array(count);
  const dataView = this.data;
  let offset = this.offset + this.relativeOffset;

  for (let i = 0; i < count; i++) {
    offsets[i] = dataView.getUint32(offset);
    offset += 4;
  }

  this.relativeOffset += count * 4;
  return offsets;
}; // Parse a list of 16 bit unsigned integers. The length of the list can be read on the stream
// or provided as an argument.


Parser.prototype.parseOffset16List = Parser.prototype.parseUShortList = function (count) {
  if (count === undefined) {
    count = this.parseUShort();
  }

  const offsets = new Array(count);
  const dataView = this.data;
  let offset = this.offset + this.relativeOffset;

  for (let i = 0; i < count; i++) {
    offsets[i] = dataView.getUint16(offset);
    offset += 2;
  }

  this.relativeOffset += count * 2;
  return offsets;
}; // Parses a list of 16 bit signed integers.


Parser.prototype.parseShortList = function (count) {
  const list = new Array(count);
  const dataView = this.data;
  let offset = this.offset + this.relativeOffset;

  for (let i = 0; i < count; i++) {
    list[i] = dataView.getInt16(offset);
    offset += 2;
  }

  this.relativeOffset += count * 2;
  return list;
}; // Parses a list of bytes.


Parser.prototype.parseByteList = function (count) {
  const list = new Array(count);
  const dataView = this.data;
  let offset = this.offset + this.relativeOffset;

  for (let i = 0; i < count; i++) {
    list[i] = dataView.getUint8(offset++);
  }

  this.relativeOffset += count;
  return list;
};
/**
 * Parse a list of items.
 * Record count is optional, if omitted it is read from the stream.
 * itemCallback is one of the Parser methods.
 */


Parser.prototype.parseList = function (count, itemCallback) {
  if (!itemCallback) {
    itemCallback = count;
    count = this.parseUShort();
  }

  const list = new Array(count);

  for (let i = 0; i < count; i++) {
    list[i] = itemCallback.call(this);
  }

  return list;
};

Parser.prototype.parseList32 = function (count, itemCallback) {
  if (!itemCallback) {
    itemCallback = count;
    count = this.parseULong();
  }

  const list = new Array(count);

  for (let i = 0; i < count; i++) {
    list[i] = itemCallback.call(this);
  }

  return list;
};
/**
 * Parse a list of records.
 * Record count is optional, if omitted it is read from the stream.
 * Example of recordDescription: { sequenceIndex: Parser.uShort, lookupListIndex: Parser.uShort }
 */


Parser.prototype.parseRecordList = function (count, recordDescription) {
  // If the count argument is absent, read it in the stream.
  if (!recordDescription) {
    recordDescription = count;
    count = this.parseUShort();
  }

  const records = new Array(count);
  const fields = Object.keys(recordDescription);

  for (let i = 0; i < count; i++) {
    const rec = {};

    for (let j = 0; j < fields.length; j++) {
      const fieldName = fields[j];
      const fieldType = recordDescription[fieldName];
      rec[fieldName] = fieldType.call(this);
    }

    records[i] = rec;
  }

  return records;
};

Parser.prototype.parseRecordList32 = function (count, recordDescription) {
  // If the count argument is absent, read it in the stream.
  if (!recordDescription) {
    recordDescription = count;
    count = this.parseULong();
  }

  const records = new Array(count);
  const fields = Object.keys(recordDescription);

  for (let i = 0; i < count; i++) {
    const rec = {};

    for (let j = 0; j < fields.length; j++) {
      const fieldName = fields[j];
      const fieldType = recordDescription[fieldName];
      rec[fieldName] = fieldType.call(this);
    }

    records[i] = rec;
  }

  return records;
}; // Parse a data structure into an object
// Example of description: { sequenceIndex: Parser.uShort, lookupListIndex: Parser.uShort }


Parser.prototype.parseStruct = function (description) {
  if (typeof description === 'function') {
    return description.call(this);
  } else {
    const fields = Object.keys(description);
    const struct = {};

    for (let j = 0; j < fields.length; j++) {
      const fieldName = fields[j];
      const fieldType = description[fieldName];
      struct[fieldName] = fieldType.call(this);
    }

    return struct;
  }
};
/**
 * Parse a GPOS valueRecord
 * https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#value-record
 * valueFormat is optional, if omitted it is read from the stream.
 */


Parser.prototype.parseValueRecord = function (valueFormat) {
  if (valueFormat === undefined) {
    valueFormat = this.parseUShort();
  }

  if (valueFormat === 0) {
    // valueFormat2 in kerning pairs is most often 0
    // in this case return undefined instead of an empty object, to save space
    return;
  }

  const valueRecord = {};

  if (valueFormat & 0x0001) {
    valueRecord.xPlacement = this.parseShort();
  }

  if (valueFormat & 0x0002) {
    valueRecord.yPlacement = this.parseShort();
  }

  if (valueFormat & 0x0004) {
    valueRecord.xAdvance = this.parseShort();
  }

  if (valueFormat & 0x0008) {
    valueRecord.yAdvance = this.parseShort();
  } // Device table (non-variable font) / VariationIndex table (variable font) not supported
  // https://docs.microsoft.com/fr-fr/typography/opentype/spec/chapter2#devVarIdxTbls


  if (valueFormat & 0x0010) {
    valueRecord.xPlaDevice = undefined;
    this.parseShort();
  }

  if (valueFormat & 0x0020) {
    valueRecord.yPlaDevice = undefined;
    this.parseShort();
  }

  if (valueFormat & 0x0040) {
    valueRecord.xAdvDevice = undefined;
    this.parseShort();
  }

  if (valueFormat & 0x0080) {
    valueRecord.yAdvDevice = undefined;
    this.parseShort();
  }

  return valueRecord;
};
/**
 * Parse a list of GPOS valueRecords
 * https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#value-record
 * valueFormat and valueCount are read from the stream.
 */


Parser.prototype.parseValueRecordList = function () {
  const valueFormat = this.parseUShort();
  const valueCount = this.parseUShort();
  const values = new Array(valueCount);

  for (let i = 0; i < valueCount; i++) {
    values[i] = this.parseValueRecord(valueFormat);
  }

  return values;
};

Parser.prototype.parsePointer = function (description) {
  const structOffset = this.parseOffset16();

  if (structOffset > 0) {
    // NULL offset => return undefined
    return new Parser(this.data, this.offset + structOffset).parseStruct(description);
  }

  return undefined;
};

Parser.prototype.parsePointer32 = function (description) {
  const structOffset = this.parseOffset32();

  if (structOffset > 0) {
    // NULL offset => return undefined
    return new Parser(this.data, this.offset + structOffset).parseStruct(description);
  }

  return undefined;
};
/**
 * Parse a list of offsets to lists of 16-bit integers,
 * or a list of offsets to lists of offsets to any kind of items.
 * If itemCallback is not provided, a list of list of UShort is assumed.
 * If provided, itemCallback is called on each item and must parse the item.
 * See examples in tables/gsub.js
 */


Parser.prototype.parseListOfLists = function (itemCallback) {
  const offsets = this.parseOffset16List();
  const count = offsets.length;
  const relativeOffset = this.relativeOffset;
  const list = new Array(count);

  for (let i = 0; i < count; i++) {
    const start = offsets[i];

    if (start === 0) {
      // NULL offset
      // Add i as owned property to list. Convenient with assert.
      list[i] = undefined;
      continue;
    }

    this.relativeOffset = start;

    if (itemCallback) {
      const subOffsets = this.parseOffset16List();
      const subList = new Array(subOffsets.length);

      for (let j = 0; j < subOffsets.length; j++) {
        this.relativeOffset = start + subOffsets[j];
        subList[j] = itemCallback.call(this);
      }

      list[i] = subList;
    } else {
      list[i] = this.parseUShortList();
    }
  }

  this.relativeOffset = relativeOffset;
  return list;
}; ///// Complex tables parsing //////////////////////////////////
// Parse a coverage table in a GSUB, GPOS or GDEF table.
// https://www.microsoft.com/typography/OTSPEC/chapter2.htm
// parser.offset must point to the start of the table containing the coverage.


Parser.prototype.parseCoverage = function () {
  const startOffset = this.offset + this.relativeOffset;
  const format = this.parseUShort();
  const count = this.parseUShort();

  if (format === 1) {
    return {
      format: 1,
      glyphs: this.parseUShortList(count)
    };
  } else if (format === 2) {
    const ranges = new Array(count);

    for (let i = 0; i < count; i++) {
      ranges[i] = {
        start: this.parseUShort(),
        end: this.parseUShort(),
        index: this.parseUShort()
      };
    }

    return {
      format: 2,
      ranges: ranges
    };
  }

  throw new Error('0x' + startOffset.toString(16) + ': Coverage format must be 1 or 2.');
}; // Parse a Class Definition Table in a GSUB, GPOS or GDEF table.
// https://www.microsoft.com/typography/OTSPEC/chapter2.htm


Parser.prototype.parseClassDef = function () {
  const startOffset = this.offset + this.relativeOffset;
  const format = this.parseUShort();

  if (format === 1) {
    return {
      format: 1,
      startGlyph: this.parseUShort(),
      classes: this.parseUShortList()
    };
  } else if (format === 2) {
    return {
      format: 2,
      ranges: this.parseRecordList({
        start: Parser.uShort,
        end: Parser.uShort,
        classId: Parser.uShort
      })
    };
  }

  throw new Error('0x' + startOffset.toString(16) + ': ClassDef format must be 1 or 2.');
}; ///// Static methods ///////////////////////////////////
// These convenience methods can be used as callbacks and should be called with "this" context set to a Parser instance.


Parser.list = function (count, itemCallback) {
  return function () {
    return this.parseList(count, itemCallback);
  };
};

Parser.list32 = function (count, itemCallback) {
  return function () {
    return this.parseList32(count, itemCallback);
  };
};

Parser.recordList = function (count, recordDescription) {
  return function () {
    return this.parseRecordList(count, recordDescription);
  };
};

Parser.recordList32 = function (count, recordDescription) {
  return function () {
    return this.parseRecordList32(count, recordDescription);
  };
};

Parser.pointer = function (description) {
  return function () {
    return this.parsePointer(description);
  };
};

Parser.pointer32 = function (description) {
  return function () {
    return this.parsePointer32(description);
  };
};

Parser.tag = Parser.prototype.parseTag;
Parser.byte = Parser.prototype.parseByte;
Parser.uShort = Parser.offset16 = Parser.prototype.parseUShort;
Parser.uShortList = Parser.prototype.parseUShortList;
Parser.uLong = Parser.offset32 = Parser.prototype.parseULong;
Parser.uLongList = Parser.prototype.parseULongList;
Parser.struct = Parser.prototype.parseStruct;
Parser.coverage = Parser.prototype.parseCoverage;
Parser.classDef = Parser.prototype.parseClassDef; ///// Script, Feature, Lookup lists ///////////////////////////////////////////////
// https://www.microsoft.com/typography/OTSPEC/chapter2.htm

const langSysTable = {
  reserved: Parser.uShort,
  reqFeatureIndex: Parser.uShort,
  featureIndexes: Parser.uShortList
};

Parser.prototype.parseScriptList = function () {
  return this.parsePointer(Parser.recordList({
    tag: Parser.tag,
    script: Parser.pointer({
      defaultLangSys: Parser.pointer(langSysTable),
      langSysRecords: Parser.recordList({
        tag: Parser.tag,
        langSys: Parser.pointer(langSysTable)
      })
    })
  })) || [];
};

Parser.prototype.parseFeatureList = function () {
  return this.parsePointer(Parser.recordList({
    tag: Parser.tag,
    feature: Parser.pointer({
      featureParams: Parser.offset16,
      lookupListIndexes: Parser.uShortList
    })
  })) || [];
};

Parser.prototype.parseLookupList = function (lookupTableParsers) {
  return this.parsePointer(Parser.list(Parser.pointer(function () {
    const lookupType = this.parseUShort();

    _check.default.argument(1 <= lookupType && lookupType <= 9, 'GPOS/GSUB lookup type ' + lookupType + ' unknown.');

    const lookupFlag = this.parseUShort();
    const useMarkFilteringSet = lookupFlag & 0x10;
    return {
      lookupType: lookupType,
      lookupFlag: lookupFlag,
      subtables: this.parseList(Parser.pointer(lookupTableParsers[lookupType])),
      markFilteringSet: useMarkFilteringSet ? this.parseUShort() : undefined
    };
  }))) || [];
};

Parser.prototype.parseFeatureVariationsList = function () {
  return this.parsePointer32(function () {
    const majorVersion = this.parseUShort();
    const minorVersion = this.parseUShort();

    _check.default.argument(majorVersion === 1 && minorVersion < 1, 'GPOS/GSUB feature variations table unknown.');

    const featureVariations = this.parseRecordList32({
      conditionSetOffset: Parser.offset32,
      featureTableSubstitutionOffset: Parser.offset32
    });
    return featureVariations;
  }) || [];
};

var _default = {
  getByte,
  getCard8: getByte,
  getUShort,
  getCard16: getUShort,
  getShort,
  getULong,
  getFixed,
  getTag,
  getOffset,
  getBytes,
  bytesToString,
  Parser
};
exports.default = _default;
},{"./check":"../node_modules/opentype.js/src/check.js"}],"../node_modules/opentype.js/src/tables/cmap.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _check = _interopRequireDefault(require("../check"));

var _parse = _interopRequireDefault(require("../parse"));

var _table = _interopRequireDefault(require("../table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The `cmap` table stores the mappings from characters to glyphs.
// https://www.microsoft.com/typography/OTSPEC/cmap.htm
function parseCmapTableFormat12(cmap, p) {
  //Skip reserved.
  p.parseUShort(); // Length in bytes of the sub-tables.

  cmap.length = p.parseULong();
  cmap.language = p.parseULong();
  let groupCount;
  cmap.groupCount = groupCount = p.parseULong();
  cmap.glyphIndexMap = {};

  for (let i = 0; i < groupCount; i += 1) {
    const startCharCode = p.parseULong();
    const endCharCode = p.parseULong();
    let startGlyphId = p.parseULong();

    for (let c = startCharCode; c <= endCharCode; c += 1) {
      cmap.glyphIndexMap[c] = startGlyphId;
      startGlyphId++;
    }
  }
}

function parseCmapTableFormat4(cmap, p, data, start, offset) {
  // Length in bytes of the sub-tables.
  cmap.length = p.parseUShort();
  cmap.language = p.parseUShort(); // segCount is stored x 2.

  let segCount;
  cmap.segCount = segCount = p.parseUShort() >> 1; // Skip searchRange, entrySelector, rangeShift.

  p.skip('uShort', 3); // The "unrolled" mapping from character codes to glyph indices.

  cmap.glyphIndexMap = {};
  const endCountParser = new _parse.default.Parser(data, start + offset + 14);
  const startCountParser = new _parse.default.Parser(data, start + offset + 16 + segCount * 2);
  const idDeltaParser = new _parse.default.Parser(data, start + offset + 16 + segCount * 4);
  const idRangeOffsetParser = new _parse.default.Parser(data, start + offset + 16 + segCount * 6);
  let glyphIndexOffset = start + offset + 16 + segCount * 8;

  for (let i = 0; i < segCount - 1; i += 1) {
    let glyphIndex;
    const endCount = endCountParser.parseUShort();
    const startCount = startCountParser.parseUShort();
    const idDelta = idDeltaParser.parseShort();
    const idRangeOffset = idRangeOffsetParser.parseUShort();

    for (let c = startCount; c <= endCount; c += 1) {
      if (idRangeOffset !== 0) {
        // The idRangeOffset is relative to the current position in the idRangeOffset array.
        // Take the current offset in the idRangeOffset array.
        glyphIndexOffset = idRangeOffsetParser.offset + idRangeOffsetParser.relativeOffset - 2; // Add the value of the idRangeOffset, which will move us into the glyphIndex array.

        glyphIndexOffset += idRangeOffset; // Then add the character index of the current segment, multiplied by 2 for USHORTs.

        glyphIndexOffset += (c - startCount) * 2;
        glyphIndex = _parse.default.getUShort(data, glyphIndexOffset);

        if (glyphIndex !== 0) {
          glyphIndex = glyphIndex + idDelta & 0xFFFF;
        }
      } else {
        glyphIndex = c + idDelta & 0xFFFF;
      }

      cmap.glyphIndexMap[c] = glyphIndex;
    }
  }
} // Parse the `cmap` table. This table stores the mappings from characters to glyphs.
// There are many available formats, but we only support the Windows format 4 and 12.
// This function returns a `CmapEncoding` object or null if no supported format could be found.


function parseCmapTable(data, start) {
  const cmap = {};
  cmap.version = _parse.default.getUShort(data, start);

  _check.default.argument(cmap.version === 0, 'cmap table version should be 0.'); // The cmap table can contain many sub-tables, each with their own format.
  // We're only interested in a "platform 0" (Unicode format) and "platform 3" (Windows format) table.


  cmap.numTables = _parse.default.getUShort(data, start + 2);
  let offset = -1;

  for (let i = cmap.numTables - 1; i >= 0; i -= 1) {
    const platformId = _parse.default.getUShort(data, start + 4 + i * 8);

    const encodingId = _parse.default.getUShort(data, start + 4 + i * 8 + 2);

    if (platformId === 3 && (encodingId === 0 || encodingId === 1 || encodingId === 10) || platformId === 0 && (encodingId === 0 || encodingId === 1 || encodingId === 2 || encodingId === 3 || encodingId === 4)) {
      offset = _parse.default.getULong(data, start + 4 + i * 8 + 4);
      break;
    }
  }

  if (offset === -1) {
    // There is no cmap table in the font that we support.
    throw new Error('No valid cmap sub-tables found.');
  }

  const p = new _parse.default.Parser(data, start + offset);
  cmap.format = p.parseUShort();

  if (cmap.format === 12) {
    parseCmapTableFormat12(cmap, p);
  } else if (cmap.format === 4) {
    parseCmapTableFormat4(cmap, p, data, start, offset);
  } else {
    throw new Error('Only format 4 and 12 cmap tables are supported (found format ' + cmap.format + ').');
  }

  return cmap;
}

function addSegment(t, code, glyphIndex) {
  t.segments.push({
    end: code,
    start: code,
    delta: -(code - glyphIndex),
    offset: 0,
    glyphIndex: glyphIndex
  });
}

function addTerminatorSegment(t) {
  t.segments.push({
    end: 0xFFFF,
    start: 0xFFFF,
    delta: 1,
    offset: 0
  });
} // Make cmap table, format 4 by default, 12 if needed only


function makeCmapTable(glyphs) {
  // Plan 0 is the base Unicode Plan but emojis, for example are on another plan, and needs cmap 12 format (with 32bit)
  let isPlan0Only = true;
  let i; // Check if we need to add cmap format 12 or if format 4 only is fine

  for (i = glyphs.length - 1; i > 0; i -= 1) {
    const g = glyphs.get(i);

    if (g.unicode > 65535) {
      console.log('Adding CMAP format 12 (needed!)');
      isPlan0Only = false;
      break;
    }
  }

  let cmapTable = [{
    name: 'version',
    type: 'USHORT',
    value: 0
  }, {
    name: 'numTables',
    type: 'USHORT',
    value: isPlan0Only ? 1 : 2
  }, // CMAP 4 header
  {
    name: 'platformID',
    type: 'USHORT',
    value: 3
  }, {
    name: 'encodingID',
    type: 'USHORT',
    value: 1
  }, {
    name: 'offset',
    type: 'ULONG',
    value: isPlan0Only ? 12 : 12 + 8
  }];
  if (!isPlan0Only) cmapTable = cmapTable.concat([// CMAP 12 header
  {
    name: 'cmap12PlatformID',
    type: 'USHORT',
    value: 3
  }, // We encode only for PlatformID = 3 (Windows) because it is supported everywhere
  {
    name: 'cmap12EncodingID',
    type: 'USHORT',
    value: 10
  }, {
    name: 'cmap12Offset',
    type: 'ULONG',
    value: 0
  }]);
  cmapTable = cmapTable.concat([// CMAP 4 Subtable
  {
    name: 'format',
    type: 'USHORT',
    value: 4
  }, {
    name: 'cmap4Length',
    type: 'USHORT',
    value: 0
  }, {
    name: 'language',
    type: 'USHORT',
    value: 0
  }, {
    name: 'segCountX2',
    type: 'USHORT',
    value: 0
  }, {
    name: 'searchRange',
    type: 'USHORT',
    value: 0
  }, {
    name: 'entrySelector',
    type: 'USHORT',
    value: 0
  }, {
    name: 'rangeShift',
    type: 'USHORT',
    value: 0
  }]);
  const t = new _table.default.Table('cmap', cmapTable);
  t.segments = [];

  for (i = 0; i < glyphs.length; i += 1) {
    const glyph = glyphs.get(i);

    for (let j = 0; j < glyph.unicodes.length; j += 1) {
      addSegment(t, glyph.unicodes[j], i);
    }

    t.segments = t.segments.sort(function (a, b) {
      return a.start - b.start;
    });
  }

  addTerminatorSegment(t);
  const segCount = t.segments.length;
  let segCountToRemove = 0; // CMAP 4
  // Set up parallel segment arrays.

  let endCounts = [];
  let startCounts = [];
  let idDeltas = [];
  let idRangeOffsets = [];
  let glyphIds = []; // CMAP 12

  let cmap12Groups = []; // Reminder this loop is not following the specification at 100%
  // The specification -> find suites of characters and make a group
  // Here we're doing one group for each letter
  // Doing as the spec can save 8 times (or more) space

  for (i = 0; i < segCount; i += 1) {
    const segment = t.segments[i]; // CMAP 4

    if (segment.end <= 65535 && segment.start <= 65535) {
      endCounts = endCounts.concat({
        name: 'end_' + i,
        type: 'USHORT',
        value: segment.end
      });
      startCounts = startCounts.concat({
        name: 'start_' + i,
        type: 'USHORT',
        value: segment.start
      });
      idDeltas = idDeltas.concat({
        name: 'idDelta_' + i,
        type: 'SHORT',
        value: segment.delta
      });
      idRangeOffsets = idRangeOffsets.concat({
        name: 'idRangeOffset_' + i,
        type: 'USHORT',
        value: segment.offset
      });

      if (segment.glyphId !== undefined) {
        glyphIds = glyphIds.concat({
          name: 'glyph_' + i,
          type: 'USHORT',
          value: segment.glyphId
        });
      }
    } else {
      // Skip Unicode > 65535 (16bit unsigned max) for CMAP 4, will be added in CMAP 12
      segCountToRemove += 1;
    } // CMAP 12
    // Skip Terminator Segment


    if (!isPlan0Only && segment.glyphIndex !== undefined) {
      cmap12Groups = cmap12Groups.concat({
        name: 'cmap12Start_' + i,
        type: 'ULONG',
        value: segment.start
      });
      cmap12Groups = cmap12Groups.concat({
        name: 'cmap12End_' + i,
        type: 'ULONG',
        value: segment.end
      });
      cmap12Groups = cmap12Groups.concat({
        name: 'cmap12Glyph_' + i,
        type: 'ULONG',
        value: segment.glyphIndex
      });
    }
  } // CMAP 4 Subtable


  t.segCountX2 = (segCount - segCountToRemove) * 2;
  t.searchRange = Math.pow(2, Math.floor(Math.log(segCount - segCountToRemove) / Math.log(2))) * 2;
  t.entrySelector = Math.log(t.searchRange / 2) / Math.log(2);
  t.rangeShift = t.segCountX2 - t.searchRange;
  t.fields = t.fields.concat(endCounts);
  t.fields.push({
    name: 'reservedPad',
    type: 'USHORT',
    value: 0
  });
  t.fields = t.fields.concat(startCounts);
  t.fields = t.fields.concat(idDeltas);
  t.fields = t.fields.concat(idRangeOffsets);
  t.fields = t.fields.concat(glyphIds);
  t.cmap4Length = 14 + // Subtable header
  endCounts.length * 2 + 2 + // reservedPad
  startCounts.length * 2 + idDeltas.length * 2 + idRangeOffsets.length * 2 + glyphIds.length * 2;

  if (!isPlan0Only) {
    // CMAP 12 Subtable
    const cmap12Length = 16 + // Subtable header
    cmap12Groups.length * 4;
    t.cmap12Offset = 12 + 2 * 2 + 4 + t.cmap4Length;
    t.fields = t.fields.concat([{
      name: 'cmap12Format',
      type: 'USHORT',
      value: 12
    }, {
      name: 'cmap12Reserved',
      type: 'USHORT',
      value: 0
    }, {
      name: 'cmap12Length',
      type: 'ULONG',
      value: cmap12Length
    }, {
      name: 'cmap12Language',
      type: 'ULONG',
      value: 0
    }, {
      name: 'cmap12nGroups',
      type: 'ULONG',
      value: cmap12Groups.length / 3
    }]);
    t.fields = t.fields.concat(cmap12Groups);
  }

  return t;
}

var _default = {
  parse: parseCmapTable,
  make: makeCmapTable
};
exports.default = _default;
},{"../check":"../node_modules/opentype.js/src/check.js","../parse":"../node_modules/opentype.js/src/parse.js","../table":"../node_modules/opentype.js/src/table.js"}],"../node_modules/opentype.js/src/encoding.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultEncoding = DefaultEncoding;
exports.CmapEncoding = CmapEncoding;
exports.CffEncoding = CffEncoding;
exports.GlyphNames = GlyphNames;
exports.addGlyphNames = addGlyphNames;
exports.standardNames = exports.cffExpertEncoding = exports.cffStandardEncoding = exports.cffStandardStrings = void 0;
// Glyph encoding
const cffStandardStrings = ['.notdef', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quoteright', 'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater', 'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore', 'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', 'exclamdown', 'cent', 'sterling', 'fraction', 'yen', 'florin', 'section', 'currency', 'quotesingle', 'quotedblleft', 'guillemotleft', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'endash', 'dagger', 'daggerdbl', 'periodcentered', 'paragraph', 'bullet', 'quotesinglbase', 'quotedblbase', 'quotedblright', 'guillemotright', 'ellipsis', 'perthousand', 'questiondown', 'grave', 'acute', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'dieresis', 'ring', 'cedilla', 'hungarumlaut', 'ogonek', 'caron', 'emdash', 'AE', 'ordfeminine', 'Lslash', 'Oslash', 'OE', 'ordmasculine', 'ae', 'dotlessi', 'lslash', 'oslash', 'oe', 'germandbls', 'onesuperior', 'logicalnot', 'mu', 'trademark', 'Eth', 'onehalf', 'plusminus', 'Thorn', 'onequarter', 'divide', 'brokenbar', 'degree', 'thorn', 'threequarters', 'twosuperior', 'registered', 'minus', 'eth', 'multiply', 'threesuperior', 'copyright', 'Aacute', 'Acircumflex', 'Adieresis', 'Agrave', 'Aring', 'Atilde', 'Ccedilla', 'Eacute', 'Ecircumflex', 'Edieresis', 'Egrave', 'Iacute', 'Icircumflex', 'Idieresis', 'Igrave', 'Ntilde', 'Oacute', 'Ocircumflex', 'Odieresis', 'Ograve', 'Otilde', 'Scaron', 'Uacute', 'Ucircumflex', 'Udieresis', 'Ugrave', 'Yacute', 'Ydieresis', 'Zcaron', 'aacute', 'acircumflex', 'adieresis', 'agrave', 'aring', 'atilde', 'ccedilla', 'eacute', 'ecircumflex', 'edieresis', 'egrave', 'iacute', 'icircumflex', 'idieresis', 'igrave', 'ntilde', 'oacute', 'ocircumflex', 'odieresis', 'ograve', 'otilde', 'scaron', 'uacute', 'ucircumflex', 'udieresis', 'ugrave', 'yacute', 'ydieresis', 'zcaron', 'exclamsmall', 'Hungarumlautsmall', 'dollaroldstyle', 'dollarsuperior', 'ampersandsmall', 'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', '266 ff', 'onedotenleader', 'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle', 'fouroldstyle', 'fiveoldstyle', 'sixoldstyle', 'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'commasuperior', 'threequartersemdash', 'periodsuperior', 'questionsmall', 'asuperior', 'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', 'isuperior', 'lsuperior', 'msuperior', 'nsuperior', 'osuperior', 'rsuperior', 'ssuperior', 'tsuperior', 'ff', 'ffi', 'ffl', 'parenleftinferior', 'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall', 'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall', 'Msmall', 'Nsmall', 'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall', 'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah', 'Tildesmall', 'exclamdownsmall', 'centoldstyle', 'Lslashsmall', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall', 'Brevesmall', 'Caronsmall', 'Dotaccentsmall', 'Macronsmall', 'figuredash', 'hypheninferior', 'Ogoneksmall', 'Ringsmall', 'Cedillasmall', 'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds', 'zerosuperior', 'foursuperior', 'fivesuperior', 'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior', 'zeroinferior', 'oneinferior', 'twoinferior', 'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior', 'seveninferior', 'eightinferior', 'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior', 'commainferior', 'Agravesmall', 'Aacutesmall', 'Acircumflexsmall', 'Atildesmall', 'Adieresissmall', 'Aringsmall', 'AEsmall', 'Ccedillasmall', 'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall', 'Igravesmall', 'Iacutesmall', 'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall', 'Ogravesmall', 'Oacutesmall', 'Ocircumflexsmall', 'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall', 'Uacutesmall', 'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall', 'Ydieresissmall', '001.000', '001.001', '001.002', '001.003', 'Black', 'Bold', 'Book', 'Light', 'Medium', 'Regular', 'Roman', 'Semibold'];
exports.cffStandardStrings = cffStandardStrings;
const cffStandardEncoding = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quoteright', 'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater', 'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore', 'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'exclamdown', 'cent', 'sterling', 'fraction', 'yen', 'florin', 'section', 'currency', 'quotesingle', 'quotedblleft', 'guillemotleft', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', '', 'endash', 'dagger', 'daggerdbl', 'periodcentered', '', 'paragraph', 'bullet', 'quotesinglbase', 'quotedblbase', 'quotedblright', 'guillemotright', 'ellipsis', 'perthousand', '', 'questiondown', '', 'grave', 'acute', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'dieresis', '', 'ring', 'cedilla', '', 'hungarumlaut', 'ogonek', 'caron', 'emdash', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'AE', '', 'ordfeminine', '', '', '', '', 'Lslash', 'Oslash', 'OE', 'ordmasculine', '', '', '', '', '', 'ae', '', '', '', 'dotlessi', '', '', 'lslash', 'oslash', 'oe', 'germandbls'];
exports.cffStandardEncoding = cffStandardEncoding;
const cffExpertEncoding = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'space', 'exclamsmall', 'Hungarumlautsmall', '', 'dollaroldstyle', 'dollarsuperior', 'ampersandsmall', 'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', 'twodotenleader', 'onedotenleader', 'comma', 'hyphen', 'period', 'fraction', 'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle', 'fouroldstyle', 'fiveoldstyle', 'sixoldstyle', 'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'colon', 'semicolon', 'commasuperior', 'threequartersemdash', 'periodsuperior', 'questionsmall', '', 'asuperior', 'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', '', '', 'isuperior', '', '', 'lsuperior', 'msuperior', 'nsuperior', 'osuperior', '', '', 'rsuperior', 'ssuperior', 'tsuperior', '', 'ff', 'fi', 'fl', 'ffi', 'ffl', 'parenleftinferior', '', 'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall', 'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall', 'Msmall', 'Nsmall', 'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall', 'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah', 'Tildesmall', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'exclamdownsmall', 'centoldstyle', 'Lslashsmall', '', '', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall', 'Brevesmall', 'Caronsmall', '', 'Dotaccentsmall', '', '', 'Macronsmall', '', '', 'figuredash', 'hypheninferior', '', '', 'Ogoneksmall', 'Ringsmall', 'Cedillasmall', '', '', '', 'onequarter', 'onehalf', 'threequarters', 'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds', '', '', 'zerosuperior', 'onesuperior', 'twosuperior', 'threesuperior', 'foursuperior', 'fivesuperior', 'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior', 'zeroinferior', 'oneinferior', 'twoinferior', 'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior', 'seveninferior', 'eightinferior', 'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior', 'commainferior', 'Agravesmall', 'Aacutesmall', 'Acircumflexsmall', 'Atildesmall', 'Adieresissmall', 'Aringsmall', 'AEsmall', 'Ccedillasmall', 'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall', 'Igravesmall', 'Iacutesmall', 'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall', 'Ogravesmall', 'Oacutesmall', 'Ocircumflexsmall', 'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall', 'Uacutesmall', 'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall', 'Ydieresissmall'];
exports.cffExpertEncoding = cffExpertEncoding;
const standardNames = ['.notdef', '.null', 'nonmarkingreturn', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quotesingle', 'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater', 'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore', 'grave', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', 'Adieresis', 'Aring', 'Ccedilla', 'Eacute', 'Ntilde', 'Odieresis', 'Udieresis', 'aacute', 'agrave', 'acircumflex', 'adieresis', 'atilde', 'aring', 'ccedilla', 'eacute', 'egrave', 'ecircumflex', 'edieresis', 'iacute', 'igrave', 'icircumflex', 'idieresis', 'ntilde', 'oacute', 'ograve', 'ocircumflex', 'odieresis', 'otilde', 'uacute', 'ugrave', 'ucircumflex', 'udieresis', 'dagger', 'degree', 'cent', 'sterling', 'section', 'bullet', 'paragraph', 'germandbls', 'registered', 'copyright', 'trademark', 'acute', 'dieresis', 'notequal', 'AE', 'Oslash', 'infinity', 'plusminus', 'lessequal', 'greaterequal', 'yen', 'mu', 'partialdiff', 'summation', 'product', 'pi', 'integral', 'ordfeminine', 'ordmasculine', 'Omega', 'ae', 'oslash', 'questiondown', 'exclamdown', 'logicalnot', 'radical', 'florin', 'approxequal', 'Delta', 'guillemotleft', 'guillemotright', 'ellipsis', 'nonbreakingspace', 'Agrave', 'Atilde', 'Otilde', 'OE', 'oe', 'endash', 'emdash', 'quotedblleft', 'quotedblright', 'quoteleft', 'quoteright', 'divide', 'lozenge', 'ydieresis', 'Ydieresis', 'fraction', 'currency', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'daggerdbl', 'periodcentered', 'quotesinglbase', 'quotedblbase', 'perthousand', 'Acircumflex', 'Ecircumflex', 'Aacute', 'Edieresis', 'Egrave', 'Iacute', 'Icircumflex', 'Idieresis', 'Igrave', 'Oacute', 'Ocircumflex', 'apple', 'Ograve', 'Uacute', 'Ucircumflex', 'Ugrave', 'dotlessi', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'ring', 'cedilla', 'hungarumlaut', 'ogonek', 'caron', 'Lslash', 'lslash', 'Scaron', 'scaron', 'Zcaron', 'zcaron', 'brokenbar', 'Eth', 'eth', 'Yacute', 'yacute', 'Thorn', 'thorn', 'minus', 'multiply', 'onesuperior', 'twosuperior', 'threesuperior', 'onehalf', 'onequarter', 'threequarters', 'franc', 'Gbreve', 'gbreve', 'Idotaccent', 'Scedilla', 'scedilla', 'Cacute', 'cacute', 'Ccaron', 'ccaron', 'dcroat'];
/**
 * This is the encoding used for fonts created from scratch.
 * It loops through all glyphs and finds the appropriate unicode value.
 * Since it's linear time, other encodings will be faster.
 * @exports opentype.DefaultEncoding
 * @class
 * @constructor
 * @param {opentype.Font}
 */

exports.standardNames = standardNames;

function DefaultEncoding(font) {
  this.font = font;
}

DefaultEncoding.prototype.charToGlyphIndex = function (c) {
  const code = c.codePointAt(0);
  const glyphs = this.font.glyphs;

  if (glyphs) {
    for (let i = 0; i < glyphs.length; i += 1) {
      const glyph = glyphs.get(i);

      for (let j = 0; j < glyph.unicodes.length; j += 1) {
        if (glyph.unicodes[j] === code) {
          return i;
        }
      }
    }
  }

  return null;
};
/**
 * @exports opentype.CmapEncoding
 * @class
 * @constructor
 * @param {Object} cmap - a object with the cmap encoded data
 */


function CmapEncoding(cmap) {
  this.cmap = cmap;
}
/**
 * @param  {string} c - the character
 * @return {number} The glyph index.
 */


CmapEncoding.prototype.charToGlyphIndex = function (c) {
  return this.cmap.glyphIndexMap[c.codePointAt(0)] || 0;
};
/**
 * @exports opentype.CffEncoding
 * @class
 * @constructor
 * @param {string} encoding - The encoding
 * @param {Array} charset - The character set.
 */


function CffEncoding(encoding, charset) {
  this.encoding = encoding;
  this.charset = charset;
}
/**
 * @param  {string} s - The character
 * @return {number} The index.
 */


CffEncoding.prototype.charToGlyphIndex = function (s) {
  const code = s.codePointAt(0);
  const charName = this.encoding[code];
  return this.charset.indexOf(charName);
};
/**
 * @exports opentype.GlyphNames
 * @class
 * @constructor
 * @param {Object} post
 */


function GlyphNames(post) {
  switch (post.version) {
    case 1:
      this.names = standardNames.slice();
      break;

    case 2:
      this.names = new Array(post.numberOfGlyphs);

      for (let i = 0; i < post.numberOfGlyphs; i++) {
        if (post.glyphNameIndex[i] < standardNames.length) {
          this.names[i] = standardNames[post.glyphNameIndex[i]];
        } else {
          this.names[i] = post.names[post.glyphNameIndex[i] - standardNames.length];
        }
      }

      break;

    case 2.5:
      this.names = new Array(post.numberOfGlyphs);

      for (let i = 0; i < post.numberOfGlyphs; i++) {
        this.names[i] = standardNames[i + post.glyphNameIndex[i]];
      }

      break;

    case 3:
      this.names = [];
      break;

    default:
      this.names = [];
      break;
  }
}
/**
 * Gets the index of a glyph by name.
 * @param  {string} name - The glyph name
 * @return {number} The index
 */


GlyphNames.prototype.nameToGlyphIndex = function (name) {
  return this.names.indexOf(name);
};
/**
 * @param  {number} gid
 * @return {string}
 */


GlyphNames.prototype.glyphIndexToName = function (gid) {
  return this.names[gid];
};

function addGlyphNamesAll(font) {
  let glyph;
  const glyphIndexMap = font.tables.cmap.glyphIndexMap;
  const charCodes = Object.keys(glyphIndexMap);

  for (let i = 0; i < charCodes.length; i += 1) {
    const c = charCodes[i];
    const glyphIndex = glyphIndexMap[c];
    glyph = font.glyphs.get(glyphIndex);
    glyph.addUnicode(parseInt(c));
  }

  for (let i = 0; i < font.glyphs.length; i += 1) {
    glyph = font.glyphs.get(i);

    if (font.cffEncoding) {
      if (font.isCIDFont) {
        glyph.name = 'gid' + i;
      } else {
        glyph.name = font.cffEncoding.charset[i];
      }
    } else if (font.glyphNames.names) {
      glyph.name = font.glyphNames.glyphIndexToName(i);
    }
  }
}

function addGlyphNamesToUnicodeMap(font) {
  font._IndexToUnicodeMap = {};
  const glyphIndexMap = font.tables.cmap.glyphIndexMap;
  const charCodes = Object.keys(glyphIndexMap);

  for (let i = 0; i < charCodes.length; i += 1) {
    const c = charCodes[i];
    let glyphIndex = glyphIndexMap[c];

    if (font._IndexToUnicodeMap[glyphIndex] === undefined) {
      font._IndexToUnicodeMap[glyphIndex] = {
        unicodes: [parseInt(c)]
      };
    } else {
      font._IndexToUnicodeMap[glyphIndex].unicodes.push(parseInt(c));
    }
  }
}
/**
 * @alias opentype.addGlyphNames
 * @param {opentype.Font}
 * @param {Object}
 */


function addGlyphNames(font, opt) {
  if (opt.lowMemory) {
    addGlyphNamesToUnicodeMap(font);
  } else {
    addGlyphNamesAll(font);
  }
}
},{}],"../node_modules/opentype.js/src/draw.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// Drawing utility functions.
// Draw a line on the given context from point `x1,y1` to point `x2,y2`.
function line(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

var _default = {
  line
};
exports.default = _default;
},{}],"../node_modules/opentype.js/src/glyph.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _check = _interopRequireDefault(require("./check"));

var _draw = _interopRequireDefault(require("./draw"));

var _path2 = _interopRequireDefault(require("./path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The Glyph object
// import glyf from './tables/glyf' Can't be imported here, because it's a circular dependency
function getPathDefinition(glyph, path) {
  let _path = path || new _path2.default();

  return {
    configurable: true,
    get: function () {
      if (typeof _path === 'function') {
        _path = _path();
      }

      return _path;
    },
    set: function (p) {
      _path = p;
    }
  };
}
/**
 * @typedef GlyphOptions
 * @type Object
 * @property {string} [name] - The glyph name
 * @property {number} [unicode]
 * @property {Array} [unicodes]
 * @property {number} [xMin]
 * @property {number} [yMin]
 * @property {number} [xMax]
 * @property {number} [yMax]
 * @property {number} [advanceWidth]
 */
// A Glyph is an individual mark that often corresponds to a character.
// Some glyphs, such as ligatures, are a combination of many characters.
// Glyphs are the basic building blocks of a font.
//
// The `Glyph` class contains utility methods for drawing the path and its points.

/**
 * @exports opentype.Glyph
 * @class
 * @param {GlyphOptions}
 * @constructor
 */


function Glyph(options) {
  // By putting all the code on a prototype function (which is only declared once)
  // we reduce the memory requirements for larger fonts by some 2%
  this.bindConstructorValues(options);
}
/**
 * @param  {GlyphOptions}
 */


Glyph.prototype.bindConstructorValues = function (options) {
  this.index = options.index || 0; // These three values cannot be deferred for memory optimization:

  this.name = options.name || null;
  this.unicode = options.unicode || undefined;
  this.unicodes = options.unicodes || options.unicode !== undefined ? [options.unicode] : []; // But by binding these values only when necessary, we reduce can
  // the memory requirements by almost 3% for larger fonts.

  if (options.xMin) {
    this.xMin = options.xMin;
  }

  if (options.yMin) {
    this.yMin = options.yMin;
  }

  if (options.xMax) {
    this.xMax = options.xMax;
  }

  if (options.yMax) {
    this.yMax = options.yMax;
  }

  if (options.advanceWidth) {
    this.advanceWidth = options.advanceWidth;
  } // The path for a glyph is the most memory intensive, and is bound as a value
  // with a getter/setter to ensure we actually do path parsing only once the
  // path is actually needed by anything.


  Object.defineProperty(this, 'path', getPathDefinition(this, options.path));
};
/**
 * @param {number}
 */


Glyph.prototype.addUnicode = function (unicode) {
  if (this.unicodes.length === 0) {
    this.unicode = unicode;
  }

  this.unicodes.push(unicode);
};
/**
 * Calculate the minimum bounding box for this glyph.
 * @return {opentype.BoundingBox}
 */


Glyph.prototype.getBoundingBox = function () {
  return this.path.getBoundingBox();
};
/**
 * Convert the glyph to a Path we can draw on a drawing context.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {Object=} options - xScale, yScale to stretch the glyph.
 * @param  {opentype.Font} if hinting is to be used, the font
 * @return {opentype.Path}
 */


Glyph.prototype.getPath = function (x, y, fontSize, options, font) {
  x = x !== undefined ? x : 0;
  y = y !== undefined ? y : 0;
  fontSize = fontSize !== undefined ? fontSize : 72;
  let commands;
  let hPoints;
  if (!options) options = {};
  let xScale = options.xScale;
  let yScale = options.yScale;

  if (options.hinting && font && font.hinting) {
    // in case of hinting, the hinting engine takes care
    // of scaling the points (not the path) before hinting.
    hPoints = this.path && font.hinting.exec(this, fontSize); // in case the hinting engine failed hPoints is undefined
    // and thus reverts to plain rending
  }

  if (hPoints) {
    // Call font.hinting.getCommands instead of `glyf.getPath(hPoints).commands` to avoid a circular dependency
    commands = font.hinting.getCommands(hPoints);
    x = Math.round(x);
    y = Math.round(y); // TODO in case of hinting xyScaling is not yet supported

    xScale = yScale = 1;
  } else {
    commands = this.path.commands;
    const scale = 1 / (this.path.unitsPerEm || 1000) * fontSize;
    if (xScale === undefined) xScale = scale;
    if (yScale === undefined) yScale = scale;
  }

  const p = new _path2.default();

  for (let i = 0; i < commands.length; i += 1) {
    const cmd = commands[i];

    if (cmd.type === 'M') {
      p.moveTo(x + cmd.x * xScale, y + -cmd.y * yScale);
    } else if (cmd.type === 'L') {
      p.lineTo(x + cmd.x * xScale, y + -cmd.y * yScale);
    } else if (cmd.type === 'Q') {
      p.quadraticCurveTo(x + cmd.x1 * xScale, y + -cmd.y1 * yScale, x + cmd.x * xScale, y + -cmd.y * yScale);
    } else if (cmd.type === 'C') {
      p.curveTo(x + cmd.x1 * xScale, y + -cmd.y1 * yScale, x + cmd.x2 * xScale, y + -cmd.y2 * yScale, x + cmd.x * xScale, y + -cmd.y * yScale);
    } else if (cmd.type === 'Z') {
      p.closePath();
    }
  }

  return p;
};
/**
 * Split the glyph into contours.
 * This function is here for backwards compatibility, and to
 * provide raw access to the TrueType glyph outlines.
 * @return {Array}
 */


Glyph.prototype.getContours = function () {
  if (this.points === undefined) {
    return [];
  }

  const contours = [];
  let currentContour = [];

  for (let i = 0; i < this.points.length; i += 1) {
    const pt = this.points[i];
    currentContour.push(pt);

    if (pt.lastPointOfContour) {
      contours.push(currentContour);
      currentContour = [];
    }
  }

  _check.default.argument(currentContour.length === 0, 'There are still points left in the current contour.');

  return contours;
};
/**
 * Calculate the xMin/yMin/xMax/yMax/lsb/rsb for a Glyph.
 * @return {Object}
 */


Glyph.prototype.getMetrics = function () {
  const commands = this.path.commands;
  const xCoords = [];
  const yCoords = [];

  for (let i = 0; i < commands.length; i += 1) {
    const cmd = commands[i];

    if (cmd.type !== 'Z') {
      xCoords.push(cmd.x);
      yCoords.push(cmd.y);
    }

    if (cmd.type === 'Q' || cmd.type === 'C') {
      xCoords.push(cmd.x1);
      yCoords.push(cmd.y1);
    }

    if (cmd.type === 'C') {
      xCoords.push(cmd.x2);
      yCoords.push(cmd.y2);
    }
  }

  const metrics = {
    xMin: Math.min.apply(null, xCoords),
    yMin: Math.min.apply(null, yCoords),
    xMax: Math.max.apply(null, xCoords),
    yMax: Math.max.apply(null, yCoords),
    leftSideBearing: this.leftSideBearing
  };

  if (!isFinite(metrics.xMin)) {
    metrics.xMin = 0;
  }

  if (!isFinite(metrics.xMax)) {
    metrics.xMax = this.advanceWidth;
  }

  if (!isFinite(metrics.yMin)) {
    metrics.yMin = 0;
  }

  if (!isFinite(metrics.yMax)) {
    metrics.yMax = 0;
  }

  metrics.rightSideBearing = this.advanceWidth - metrics.leftSideBearing - (metrics.xMax - metrics.xMin);
  return metrics;
};
/**
 * Draw the glyph on the given context.
 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {Object=} options - xScale, yScale to stretch the glyph.
 */


Glyph.prototype.draw = function (ctx, x, y, fontSize, options) {
  this.getPath(x, y, fontSize, options).draw(ctx);
};
/**
 * Draw the points of the glyph.
 * On-curve points will be drawn in blue, off-curve points will be drawn in red.
 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 */


Glyph.prototype.drawPoints = function (ctx, x, y, fontSize) {
  function drawCircles(l, x, y, scale) {
    const PI_SQ = Math.PI * 2;
    ctx.beginPath();

    for (let j = 0; j < l.length; j += 1) {
      ctx.moveTo(x + l[j].x * scale, y + l[j].y * scale);
      ctx.arc(x + l[j].x * scale, y + l[j].y * scale, 2, 0, PI_SQ, false);
    }

    ctx.closePath();
    ctx.fill();
  }

  x = x !== undefined ? x : 0;
  y = y !== undefined ? y : 0;
  fontSize = fontSize !== undefined ? fontSize : 24;
  const scale = 1 / this.path.unitsPerEm * fontSize;
  const blueCircles = [];
  const redCircles = [];
  const path = this.path;

  for (let i = 0; i < path.commands.length; i += 1) {
    const cmd = path.commands[i];

    if (cmd.x !== undefined) {
      blueCircles.push({
        x: cmd.x,
        y: -cmd.y
      });
    }

    if (cmd.x1 !== undefined) {
      redCircles.push({
        x: cmd.x1,
        y: -cmd.y1
      });
    }

    if (cmd.x2 !== undefined) {
      redCircles.push({
        x: cmd.x2,
        y: -cmd.y2
      });
    }
  }

  ctx.fillStyle = 'blue';
  drawCircles(blueCircles, x, y, scale);
  ctx.fillStyle = 'red';
  drawCircles(redCircles, x, y, scale);
};
/**
 * Draw lines indicating important font measurements.
 * Black lines indicate the origin of the coordinate system (point 0,0).
 * Blue lines indicate the glyph bounding box.
 * Green line indicates the advance width of the glyph.
 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 */


Glyph.prototype.drawMetrics = function (ctx, x, y, fontSize) {
  let scale;
  x = x !== undefined ? x : 0;
  y = y !== undefined ? y : 0;
  fontSize = fontSize !== undefined ? fontSize : 24;
  scale = 1 / this.path.unitsPerEm * fontSize;
  ctx.lineWidth = 1; // Draw the origin

  ctx.strokeStyle = 'black';

  _draw.default.line(ctx, x, -10000, x, 10000);

  _draw.default.line(ctx, -10000, y, 10000, y); // This code is here due to memory optimization: by not using
  // defaults in the constructor, we save a notable amount of memory.


  const xMin = this.xMin || 0;
  let yMin = this.yMin || 0;
  const xMax = this.xMax || 0;
  let yMax = this.yMax || 0;
  const advanceWidth = this.advanceWidth || 0; // Draw the glyph box

  ctx.strokeStyle = 'blue';

  _draw.default.line(ctx, x + xMin * scale, -10000, x + xMin * scale, 10000);

  _draw.default.line(ctx, x + xMax * scale, -10000, x + xMax * scale, 10000);

  _draw.default.line(ctx, -10000, y + -yMin * scale, 10000, y + -yMin * scale);

  _draw.default.line(ctx, -10000, y + -yMax * scale, 10000, y + -yMax * scale); // Draw the advance width


  ctx.strokeStyle = 'green';

  _draw.default.line(ctx, x + advanceWidth * scale, -10000, x + advanceWidth * scale, 10000);
};

var _default = Glyph;
exports.default = _default;
},{"./check":"../node_modules/opentype.js/src/check.js","./draw":"../node_modules/opentype.js/src/draw.js","./path":"../node_modules/opentype.js/src/path.js"}],"../node_modules/opentype.js/src/glyphset.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _glyph = _interopRequireDefault(require("./glyph"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The GlyphSet object
// Define a property on the glyph that depends on the path being loaded.
function defineDependentProperty(glyph, externalName, internalName) {
  Object.defineProperty(glyph, externalName, {
    get: function () {
      // Request the path property to make sure the path is loaded.
      glyph.path; // jshint ignore:line

      return glyph[internalName];
    },
    set: function (newValue) {
      glyph[internalName] = newValue;
    },
    enumerable: true,
    configurable: true
  });
}
/**
 * A GlyphSet represents all glyphs available in the font, but modelled using
 * a deferred glyph loader, for retrieving glyphs only once they are absolutely
 * necessary, to keep the memory footprint down.
 * @exports opentype.GlyphSet
 * @class
 * @param {opentype.Font}
 * @param {Array}
 */


function GlyphSet(font, glyphs) {
  this.font = font;
  this.glyphs = {};

  if (Array.isArray(glyphs)) {
    for (let i = 0; i < glyphs.length; i++) {
      const glyph = glyphs[i];
      glyph.path.unitsPerEm = font.unitsPerEm;
      this.glyphs[i] = glyph;
    }
  }

  this.length = glyphs && glyphs.length || 0;
}
/**
 * @param  {number} index
 * @return {opentype.Glyph}
 */


GlyphSet.prototype.get = function (index) {
  // this.glyphs[index] is 'undefined' when low memory mode is on. glyph is pushed on request only.
  if (this.glyphs[index] === undefined) {
    this.font._push(index);

    if (typeof this.glyphs[index] === 'function') {
      this.glyphs[index] = this.glyphs[index]();
    }

    let glyph = this.glyphs[index];
    let unicodeObj = this.font._IndexToUnicodeMap[index];

    if (unicodeObj) {
      for (let j = 0; j < unicodeObj.unicodes.length; j++) glyph.addUnicode(unicodeObj.unicodes[j]);
    }

    if (this.font.cffEncoding) {
      if (this.font.isCIDFont) {
        glyph.name = 'gid' + index;
      } else {
        glyph.name = this.font.cffEncoding.charset[index];
      }
    } else if (this.font.glyphNames.names) {
      glyph.name = this.font.glyphNames.glyphIndexToName(index);
    }

    this.glyphs[index].advanceWidth = this.font._hmtxTableData[index].advanceWidth;
    this.glyphs[index].leftSideBearing = this.font._hmtxTableData[index].leftSideBearing;
  } else {
    if (typeof this.glyphs[index] === 'function') {
      this.glyphs[index] = this.glyphs[index]();
    }
  }

  return this.glyphs[index];
};
/**
 * @param  {number} index
 * @param  {Object}
 */


GlyphSet.prototype.push = function (index, loader) {
  this.glyphs[index] = loader;
  this.length++;
};
/**
 * @alias opentype.glyphLoader
 * @param  {opentype.Font} font
 * @param  {number} index
 * @return {opentype.Glyph}
 */


function glyphLoader(font, index) {
  return new _glyph.default({
    index: index,
    font: font
  });
}
/**
 * Generate a stub glyph that can be filled with all metadata *except*
 * the "points" and "path" properties, which must be loaded only once
 * the glyph's path is actually requested for text shaping.
 * @alias opentype.ttfGlyphLoader
 * @param  {opentype.Font} font
 * @param  {number} index
 * @param  {Function} parseGlyph
 * @param  {Object} data
 * @param  {number} position
 * @param  {Function} buildPath
 * @return {opentype.Glyph}
 */


function ttfGlyphLoader(font, index, parseGlyph, data, position, buildPath) {
  return function () {
    const glyph = new _glyph.default({
      index: index,
      font: font
    });

    glyph.path = function () {
      parseGlyph(glyph, data, position);
      const path = buildPath(font.glyphs, glyph);
      path.unitsPerEm = font.unitsPerEm;
      return path;
    };

    defineDependentProperty(glyph, 'xMin', '_xMin');
    defineDependentProperty(glyph, 'xMax', '_xMax');
    defineDependentProperty(glyph, 'yMin', '_yMin');
    defineDependentProperty(glyph, 'yMax', '_yMax');
    return glyph;
  };
}
/**
 * @alias opentype.cffGlyphLoader
 * @param  {opentype.Font} font
 * @param  {number} index
 * @param  {Function} parseCFFCharstring
 * @param  {string} charstring
 * @return {opentype.Glyph}
 */


function cffGlyphLoader(font, index, parseCFFCharstring, charstring) {
  return function () {
    const glyph = new _glyph.default({
      index: index,
      font: font
    });

    glyph.path = function () {
      const path = parseCFFCharstring(font, glyph, charstring);
      path.unitsPerEm = font.unitsPerEm;
      return path;
    };

    return glyph;
  };
}

var _default = {
  GlyphSet,
  glyphLoader,
  ttfGlyphLoader,
  cffGlyphLoader
};
exports.default = _default;
},{"./glyph":"../node_modules/opentype.js/src/glyph.js"}],"../node_modules/opentype.js/src/tables/cff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _encoding = require("../encoding");

var _glyphset = _interopRequireDefault(require("../glyphset"));

var _parse = _interopRequireDefault(require("../parse"));

var _path = _interopRequireDefault(require("../path"));

var _table = _interopRequireDefault(require("../table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The `CFF` table contains the glyph outlines in PostScript format.
// https://www.microsoft.com/typography/OTSPEC/cff.htm
// http://download.microsoft.com/download/8/0/1/801a191c-029d-4af3-9642-555f6fe514ee/cff.pdf
// http://download.microsoft.com/download/8/0/1/801a191c-029d-4af3-9642-555f6fe514ee/type2.pdf
// Custom equals function that can also check lists.
function equals(a, b) {
  if (a === b) {
    return true;
  } else if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i += 1) {
      if (!equals(a[i], b[i])) {
        return false;
      }
    }

    return true;
  } else {
    return false;
  }
} // Subroutines are encoded using the negative half of the number space.
// See type 2 chapter 4.7 "Subroutine operators".


function calcCFFSubroutineBias(subrs) {
  let bias;

  if (subrs.length < 1240) {
    bias = 107;
  } else if (subrs.length < 33900) {
    bias = 1131;
  } else {
    bias = 32768;
  }

  return bias;
} // Parse a `CFF` INDEX array.
// An index array consists of a list of offsets, then a list of objects at those offsets.


function parseCFFIndex(data, start, conversionFn) {
  const offsets = [];
  const objects = [];

  const count = _parse.default.getCard16(data, start);

  let objectOffset;
  let endOffset;

  if (count !== 0) {
    const offsetSize = _parse.default.getByte(data, start + 2);

    objectOffset = start + (count + 1) * offsetSize + 2;
    let pos = start + 3;

    for (let i = 0; i < count + 1; i += 1) {
      offsets.push(_parse.default.getOffset(data, pos, offsetSize));
      pos += offsetSize;
    } // The total size of the index array is 4 header bytes + the value of the last offset.


    endOffset = objectOffset + offsets[count];
  } else {
    endOffset = start + 2;
  }

  for (let i = 0; i < offsets.length - 1; i += 1) {
    let value = _parse.default.getBytes(data, objectOffset + offsets[i], objectOffset + offsets[i + 1]);

    if (conversionFn) {
      value = conversionFn(value);
    }

    objects.push(value);
  }

  return {
    objects: objects,
    startOffset: start,
    endOffset: endOffset
  };
}

function parseCFFIndexLowMemory(data, start) {
  const offsets = [];

  const count = _parse.default.getCard16(data, start);

  let objectOffset;
  let endOffset;

  if (count !== 0) {
    const offsetSize = _parse.default.getByte(data, start + 2);

    objectOffset = start + (count + 1) * offsetSize + 2;
    let pos = start + 3;

    for (let i = 0; i < count + 1; i += 1) {
      offsets.push(_parse.default.getOffset(data, pos, offsetSize));
      pos += offsetSize;
    } // The total size of the index array is 4 header bytes + the value of the last offset.


    endOffset = objectOffset + offsets[count];
  } else {
    endOffset = start + 2;
  }

  return {
    offsets: offsets,
    startOffset: start,
    endOffset: endOffset
  };
}

function getCffIndexObject(i, offsets, data, start, conversionFn) {
  const count = _parse.default.getCard16(data, start);

  let objectOffset = 0;

  if (count !== 0) {
    const offsetSize = _parse.default.getByte(data, start + 2);

    objectOffset = start + (count + 1) * offsetSize + 2;
  }

  let value = _parse.default.getBytes(data, objectOffset + offsets[i], objectOffset + offsets[i + 1]);

  if (conversionFn) {
    value = conversionFn(value);
  }

  return value;
} // Parse a `CFF` DICT real value.


function parseFloatOperand(parser) {
  let s = '';
  const eof = 15;
  const lookup = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'E', 'E-', null, '-'];

  while (true) {
    const b = parser.parseByte();
    const n1 = b >> 4;
    const n2 = b & 15;

    if (n1 === eof) {
      break;
    }

    s += lookup[n1];

    if (n2 === eof) {
      break;
    }

    s += lookup[n2];
  }

  return parseFloat(s);
} // Parse a `CFF` DICT operand.


function parseOperand(parser, b0) {
  let b1;
  let b2;
  let b3;
  let b4;

  if (b0 === 28) {
    b1 = parser.parseByte();
    b2 = parser.parseByte();
    return b1 << 8 | b2;
  }

  if (b0 === 29) {
    b1 = parser.parseByte();
    b2 = parser.parseByte();
    b3 = parser.parseByte();
    b4 = parser.parseByte();
    return b1 << 24 | b2 << 16 | b3 << 8 | b4;
  }

  if (b0 === 30) {
    return parseFloatOperand(parser);
  }

  if (b0 >= 32 && b0 <= 246) {
    return b0 - 139;
  }

  if (b0 >= 247 && b0 <= 250) {
    b1 = parser.parseByte();
    return (b0 - 247) * 256 + b1 + 108;
  }

  if (b0 >= 251 && b0 <= 254) {
    b1 = parser.parseByte();
    return -(b0 - 251) * 256 - b1 - 108;
  }

  throw new Error('Invalid b0 ' + b0);
} // Convert the entries returned by `parseDict` to a proper dictionary.
// If a value is a list of one, it is unpacked.


function entriesToObject(entries) {
  const o = {};

  for (let i = 0; i < entries.length; i += 1) {
    const key = entries[i][0];
    const values = entries[i][1];
    let value;

    if (values.length === 1) {
      value = values[0];
    } else {
      value = values;
    }

    if (o.hasOwnProperty(key) && !isNaN(o[key])) {
      throw new Error('Object ' + o + ' already has key ' + key);
    }

    o[key] = value;
  }

  return o;
} // Parse a `CFF` DICT object.
// A dictionary contains key-value pairs in a compact tokenized format.


function parseCFFDict(data, start, size) {
  start = start !== undefined ? start : 0;
  const parser = new _parse.default.Parser(data, start);
  const entries = [];
  let operands = [];
  size = size !== undefined ? size : data.length;

  while (parser.relativeOffset < size) {
    let op = parser.parseByte(); // The first byte for each dict item distinguishes between operator (key) and operand (value).
    // Values <= 21 are operators.

    if (op <= 21) {
      // Two-byte operators have an initial escape byte of 12.
      if (op === 12) {
        op = 1200 + parser.parseByte();
      }

      entries.push([op, operands]);
      operands = [];
    } else {
      // Since the operands (values) come before the operators (keys), we store all operands in a list
      // until we encounter an operator.
      operands.push(parseOperand(parser, op));
    }
  }

  return entriesToObject(entries);
} // Given a String Index (SID), return the value of the string.
// Strings below index 392 are standard CFF strings and are not encoded in the font.


function getCFFString(strings, index) {
  if (index <= 390) {
    index = _encoding.cffStandardStrings[index];
  } else {
    index = strings[index - 391];
  }

  return index;
} // Interpret a dictionary and return a new dictionary with readable keys and values for missing entries.
// This function takes `meta` which is a list of objects containing `operand`, `name` and `default`.


function interpretDict(dict, meta, strings) {
  const newDict = {};
  let value; // Because we also want to include missing values, we start out from the meta list
  // and lookup values in the dict.

  for (let i = 0; i < meta.length; i += 1) {
    const m = meta[i];

    if (Array.isArray(m.type)) {
      const values = [];
      values.length = m.type.length;

      for (let j = 0; j < m.type.length; j++) {
        value = dict[m.op] !== undefined ? dict[m.op][j] : undefined;

        if (value === undefined) {
          value = m.value !== undefined && m.value[j] !== undefined ? m.value[j] : null;
        }

        if (m.type[j] === 'SID') {
          value = getCFFString(strings, value);
        }

        values[j] = value;
      }

      newDict[m.name] = values;
    } else {
      value = dict[m.op];

      if (value === undefined) {
        value = m.value !== undefined ? m.value : null;
      }

      if (m.type === 'SID') {
        value = getCFFString(strings, value);
      }

      newDict[m.name] = value;
    }
  }

  return newDict;
} // Parse the CFF header.


function parseCFFHeader(data, start) {
  const header = {};
  header.formatMajor = _parse.default.getCard8(data, start);
  header.formatMinor = _parse.default.getCard8(data, start + 1);
  header.size = _parse.default.getCard8(data, start + 2);
  header.offsetSize = _parse.default.getCard8(data, start + 3);
  header.startOffset = start;
  header.endOffset = start + 4;
  return header;
}

const TOP_DICT_META = [{
  name: 'version',
  op: 0,
  type: 'SID'
}, {
  name: 'notice',
  op: 1,
  type: 'SID'
}, {
  name: 'copyright',
  op: 1200,
  type: 'SID'
}, {
  name: 'fullName',
  op: 2,
  type: 'SID'
}, {
  name: 'familyName',
  op: 3,
  type: 'SID'
}, {
  name: 'weight',
  op: 4,
  type: 'SID'
}, {
  name: 'isFixedPitch',
  op: 1201,
  type: 'number',
  value: 0
}, {
  name: 'italicAngle',
  op: 1202,
  type: 'number',
  value: 0
}, {
  name: 'underlinePosition',
  op: 1203,
  type: 'number',
  value: -100
}, {
  name: 'underlineThickness',
  op: 1204,
  type: 'number',
  value: 50
}, {
  name: 'paintType',
  op: 1205,
  type: 'number',
  value: 0
}, {
  name: 'charstringType',
  op: 1206,
  type: 'number',
  value: 2
}, {
  name: 'fontMatrix',
  op: 1207,
  type: ['real', 'real', 'real', 'real', 'real', 'real'],
  value: [0.001, 0, 0, 0.001, 0, 0]
}, {
  name: 'uniqueId',
  op: 13,
  type: 'number'
}, {
  name: 'fontBBox',
  op: 5,
  type: ['number', 'number', 'number', 'number'],
  value: [0, 0, 0, 0]
}, {
  name: 'strokeWidth',
  op: 1208,
  type: 'number',
  value: 0
}, {
  name: 'xuid',
  op: 14,
  type: [],
  value: null
}, {
  name: 'charset',
  op: 15,
  type: 'offset',
  value: 0
}, {
  name: 'encoding',
  op: 16,
  type: 'offset',
  value: 0
}, {
  name: 'charStrings',
  op: 17,
  type: 'offset',
  value: 0
}, {
  name: 'private',
  op: 18,
  type: ['number', 'offset'],
  value: [0, 0]
}, {
  name: 'ros',
  op: 1230,
  type: ['SID', 'SID', 'number']
}, {
  name: 'cidFontVersion',
  op: 1231,
  type: 'number',
  value: 0
}, {
  name: 'cidFontRevision',
  op: 1232,
  type: 'number',
  value: 0
}, {
  name: 'cidFontType',
  op: 1233,
  type: 'number',
  value: 0
}, {
  name: 'cidCount',
  op: 1234,
  type: 'number',
  value: 8720
}, {
  name: 'uidBase',
  op: 1235,
  type: 'number'
}, {
  name: 'fdArray',
  op: 1236,
  type: 'offset'
}, {
  name: 'fdSelect',
  op: 1237,
  type: 'offset'
}, {
  name: 'fontName',
  op: 1238,
  type: 'SID'
}];
const PRIVATE_DICT_META = [{
  name: 'subrs',
  op: 19,
  type: 'offset',
  value: 0
}, {
  name: 'defaultWidthX',
  op: 20,
  type: 'number',
  value: 0
}, {
  name: 'nominalWidthX',
  op: 21,
  type: 'number',
  value: 0
}]; // Parse the CFF top dictionary. A CFF table can contain multiple fonts, each with their own top dictionary.
// The top dictionary contains the essential metadata for the font, together with the private dictionary.

function parseCFFTopDict(data, strings) {
  const dict = parseCFFDict(data, 0, data.byteLength);
  return interpretDict(dict, TOP_DICT_META, strings);
} // Parse the CFF private dictionary. We don't fully parse out all the values, only the ones we need.


function parseCFFPrivateDict(data, start, size, strings) {
  const dict = parseCFFDict(data, start, size);
  return interpretDict(dict, PRIVATE_DICT_META, strings);
} // Returns a list of "Top DICT"s found using an INDEX list.
// Used to read both the usual high-level Top DICTs and also the FDArray
// discovered inside CID-keyed fonts.  When a Top DICT has a reference to
// a Private DICT that is read and saved into the Top DICT.
//
// In addition to the expected/optional values as outlined in TOP_DICT_META
// the following values might be saved into the Top DICT.
//
//    _subrs []        array of local CFF subroutines from Private DICT
//    _subrsBias       bias value computed from number of subroutines
//                      (see calcCFFSubroutineBias() and parseCFFCharstring())
//    _defaultWidthX   default widths for CFF characters
//    _nominalWidthX   bias added to width embedded within glyph description
//
//    _privateDict     saved copy of parsed Private DICT from Top DICT


function gatherCFFTopDicts(data, start, cffIndex, strings) {
  const topDictArray = [];

  for (let iTopDict = 0; iTopDict < cffIndex.length; iTopDict += 1) {
    const topDictData = new DataView(new Uint8Array(cffIndex[iTopDict]).buffer);
    const topDict = parseCFFTopDict(topDictData, strings);
    topDict._subrs = [];
    topDict._subrsBias = 0;
    const privateSize = topDict.private[0];
    const privateOffset = topDict.private[1];

    if (privateSize !== 0 && privateOffset !== 0) {
      const privateDict = parseCFFPrivateDict(data, privateOffset + start, privateSize, strings);
      topDict._defaultWidthX = privateDict.defaultWidthX;
      topDict._nominalWidthX = privateDict.nominalWidthX;

      if (privateDict.subrs !== 0) {
        const subrOffset = privateOffset + privateDict.subrs;
        const subrIndex = parseCFFIndex(data, subrOffset + start);
        topDict._subrs = subrIndex.objects;
        topDict._subrsBias = calcCFFSubroutineBias(topDict._subrs);
      }

      topDict._privateDict = privateDict;
    }

    topDictArray.push(topDict);
  }

  return topDictArray;
} // Parse the CFF charset table, which contains internal names for all the glyphs.
// This function will return a list of glyph names.
// See Adobe TN #5176 chapter 13, "Charsets".


function parseCFFCharset(data, start, nGlyphs, strings) {
  let sid;
  let count;
  const parser = new _parse.default.Parser(data, start); // The .notdef glyph is not included, so subtract 1.

  nGlyphs -= 1;
  const charset = ['.notdef'];
  const format = parser.parseCard8();

  if (format === 0) {
    for (let i = 0; i < nGlyphs; i += 1) {
      sid = parser.parseSID();
      charset.push(getCFFString(strings, sid));
    }
  } else if (format === 1) {
    while (charset.length <= nGlyphs) {
      sid = parser.parseSID();
      count = parser.parseCard8();

      for (let i = 0; i <= count; i += 1) {
        charset.push(getCFFString(strings, sid));
        sid += 1;
      }
    }
  } else if (format === 2) {
    while (charset.length <= nGlyphs) {
      sid = parser.parseSID();
      count = parser.parseCard16();

      for (let i = 0; i <= count; i += 1) {
        charset.push(getCFFString(strings, sid));
        sid += 1;
      }
    }
  } else {
    throw new Error('Unknown charset format ' + format);
  }

  return charset;
} // Parse the CFF encoding data. Only one encoding can be specified per font.
// See Adobe TN #5176 chapter 12, "Encodings".


function parseCFFEncoding(data, start, charset) {
  let code;
  const enc = {};
  const parser = new _parse.default.Parser(data, start);
  const format = parser.parseCard8();

  if (format === 0) {
    const nCodes = parser.parseCard8();

    for (let i = 0; i < nCodes; i += 1) {
      code = parser.parseCard8();
      enc[code] = i;
    }
  } else if (format === 1) {
    const nRanges = parser.parseCard8();
    code = 1;

    for (let i = 0; i < nRanges; i += 1) {
      const first = parser.parseCard8();
      const nLeft = parser.parseCard8();

      for (let j = first; j <= first + nLeft; j += 1) {
        enc[j] = code;
        code += 1;
      }
    }
  } else {
    throw new Error('Unknown encoding format ' + format);
  }

  return new _encoding.CffEncoding(enc, charset);
} // Take in charstring code and return a Glyph object.
// The encoding is described in the Type 2 Charstring Format
// https://www.microsoft.com/typography/OTSPEC/charstr2.htm


function parseCFFCharstring(font, glyph, code) {
  let c1x;
  let c1y;
  let c2x;
  let c2y;
  const p = new _path.default();
  const stack = [];
  let nStems = 0;
  let haveWidth = false;
  let open = false;
  let x = 0;
  let y = 0;
  let subrs;
  let subrsBias;
  let defaultWidthX;
  let nominalWidthX;

  if (font.isCIDFont) {
    const fdIndex = font.tables.cff.topDict._fdSelect[glyph.index];
    const fdDict = font.tables.cff.topDict._fdArray[fdIndex];
    subrs = fdDict._subrs;
    subrsBias = fdDict._subrsBias;
    defaultWidthX = fdDict._defaultWidthX;
    nominalWidthX = fdDict._nominalWidthX;
  } else {
    subrs = font.tables.cff.topDict._subrs;
    subrsBias = font.tables.cff.topDict._subrsBias;
    defaultWidthX = font.tables.cff.topDict._defaultWidthX;
    nominalWidthX = font.tables.cff.topDict._nominalWidthX;
  }

  let width = defaultWidthX;

  function newContour(x, y) {
    if (open) {
      p.closePath();
    }

    p.moveTo(x, y);
    open = true;
  }

  function parseStems() {
    let hasWidthArg; // The number of stem operators on the stack is always even.
    // If the value is uneven, that means a width is specified.

    hasWidthArg = stack.length % 2 !== 0;

    if (hasWidthArg && !haveWidth) {
      width = stack.shift() + nominalWidthX;
    }

    nStems += stack.length >> 1;
    stack.length = 0;
    haveWidth = true;
  }

  function parse(code) {
    let b1;
    let b2;
    let b3;
    let b4;
    let codeIndex;
    let subrCode;
    let jpx;
    let jpy;
    let c3x;
    let c3y;
    let c4x;
    let c4y;
    let i = 0;

    while (i < code.length) {
      let v = code[i];
      i += 1;

      switch (v) {
        case 1:
          // hstem
          parseStems();
          break;

        case 3:
          // vstem
          parseStems();
          break;

        case 4:
          // vmoveto
          if (stack.length > 1 && !haveWidth) {
            width = stack.shift() + nominalWidthX;
            haveWidth = true;
          }

          y += stack.pop();
          newContour(x, y);
          break;

        case 5:
          // rlineto
          while (stack.length > 0) {
            x += stack.shift();
            y += stack.shift();
            p.lineTo(x, y);
          }

          break;

        case 6:
          // hlineto
          while (stack.length > 0) {
            x += stack.shift();
            p.lineTo(x, y);

            if (stack.length === 0) {
              break;
            }

            y += stack.shift();
            p.lineTo(x, y);
          }

          break;

        case 7:
          // vlineto
          while (stack.length > 0) {
            y += stack.shift();
            p.lineTo(x, y);

            if (stack.length === 0) {
              break;
            }

            x += stack.shift();
            p.lineTo(x, y);
          }

          break;

        case 8:
          // rrcurveto
          while (stack.length > 0) {
            c1x = x + stack.shift();
            c1y = y + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x = c2x + stack.shift();
            y = c2y + stack.shift();
            p.curveTo(c1x, c1y, c2x, c2y, x, y);
          }

          break;

        case 10:
          // callsubr
          codeIndex = stack.pop() + subrsBias;
          subrCode = subrs[codeIndex];

          if (subrCode) {
            parse(subrCode);
          }

          break;

        case 11:
          // return
          return;

        case 12:
          // flex operators
          v = code[i];
          i += 1;

          switch (v) {
            case 35:
              // flex
              // |- dx1 dy1 dx2 dy2 dx3 dy3 dx4 dy4 dx5 dy5 dx6 dy6 fd flex (12 35) |-
              c1x = x + stack.shift(); // dx1

              c1y = y + stack.shift(); // dy1

              c2x = c1x + stack.shift(); // dx2

              c2y = c1y + stack.shift(); // dy2

              jpx = c2x + stack.shift(); // dx3

              jpy = c2y + stack.shift(); // dy3

              c3x = jpx + stack.shift(); // dx4

              c3y = jpy + stack.shift(); // dy4

              c4x = c3x + stack.shift(); // dx5

              c4y = c3y + stack.shift(); // dy5

              x = c4x + stack.shift(); // dx6

              y = c4y + stack.shift(); // dy6

              stack.shift(); // flex depth

              p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
              p.curveTo(c3x, c3y, c4x, c4y, x, y);
              break;

            case 34:
              // hflex
              // |- dx1 dx2 dy2 dx3 dx4 dx5 dx6 hflex (12 34) |-
              c1x = x + stack.shift(); // dx1

              c1y = y; // dy1

              c2x = c1x + stack.shift(); // dx2

              c2y = c1y + stack.shift(); // dy2

              jpx = c2x + stack.shift(); // dx3

              jpy = c2y; // dy3

              c3x = jpx + stack.shift(); // dx4

              c3y = c2y; // dy4

              c4x = c3x + stack.shift(); // dx5

              c4y = y; // dy5

              x = c4x + stack.shift(); // dx6

              p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
              p.curveTo(c3x, c3y, c4x, c4y, x, y);
              break;

            case 36:
              // hflex1
              // |- dx1 dy1 dx2 dy2 dx3 dx4 dx5 dy5 dx6 hflex1 (12 36) |-
              c1x = x + stack.shift(); // dx1

              c1y = y + stack.shift(); // dy1

              c2x = c1x + stack.shift(); // dx2

              c2y = c1y + stack.shift(); // dy2

              jpx = c2x + stack.shift(); // dx3

              jpy = c2y; // dy3

              c3x = jpx + stack.shift(); // dx4

              c3y = c2y; // dy4

              c4x = c3x + stack.shift(); // dx5

              c4y = c3y + stack.shift(); // dy5

              x = c4x + stack.shift(); // dx6

              p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
              p.curveTo(c3x, c3y, c4x, c4y, x, y);
              break;

            case 37:
              // flex1
              // |- dx1 dy1 dx2 dy2 dx3 dy3 dx4 dy4 dx5 dy5 d6 flex1 (12 37) |-
              c1x = x + stack.shift(); // dx1

              c1y = y + stack.shift(); // dy1

              c2x = c1x + stack.shift(); // dx2

              c2y = c1y + stack.shift(); // dy2

              jpx = c2x + stack.shift(); // dx3

              jpy = c2y + stack.shift(); // dy3

              c3x = jpx + stack.shift(); // dx4

              c3y = jpy + stack.shift(); // dy4

              c4x = c3x + stack.shift(); // dx5

              c4y = c3y + stack.shift(); // dy5

              if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
                x = c4x + stack.shift();
              } else {
                y = c4y + stack.shift();
              }

              p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
              p.curveTo(c3x, c3y, c4x, c4y, x, y);
              break;

            default:
              console.log('Glyph ' + glyph.index + ': unknown operator ' + 1200 + v);
              stack.length = 0;
          }

          break;

        case 14:
          // endchar
          if (stack.length > 0 && !haveWidth) {
            width = stack.shift() + nominalWidthX;
            haveWidth = true;
          }

          if (open) {
            p.closePath();
            open = false;
          }

          break;

        case 18:
          // hstemhm
          parseStems();
          break;

        case 19: // hintmask

        case 20:
          // cntrmask
          parseStems();
          i += nStems + 7 >> 3;
          break;

        case 21:
          // rmoveto
          if (stack.length > 2 && !haveWidth) {
            width = stack.shift() + nominalWidthX;
            haveWidth = true;
          }

          y += stack.pop();
          x += stack.pop();
          newContour(x, y);
          break;

        case 22:
          // hmoveto
          if (stack.length > 1 && !haveWidth) {
            width = stack.shift() + nominalWidthX;
            haveWidth = true;
          }

          x += stack.pop();
          newContour(x, y);
          break;

        case 23:
          // vstemhm
          parseStems();
          break;

        case 24:
          // rcurveline
          while (stack.length > 2) {
            c1x = x + stack.shift();
            c1y = y + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x = c2x + stack.shift();
            y = c2y + stack.shift();
            p.curveTo(c1x, c1y, c2x, c2y, x, y);
          }

          x += stack.shift();
          y += stack.shift();
          p.lineTo(x, y);
          break;

        case 25:
          // rlinecurve
          while (stack.length > 6) {
            x += stack.shift();
            y += stack.shift();
            p.lineTo(x, y);
          }

          c1x = x + stack.shift();
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x + stack.shift();
          y = c2y + stack.shift();
          p.curveTo(c1x, c1y, c2x, c2y, x, y);
          break;

        case 26:
          // vvcurveto
          if (stack.length % 2) {
            x += stack.shift();
          }

          while (stack.length > 0) {
            c1x = x;
            c1y = y + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x = c2x;
            y = c2y + stack.shift();
            p.curveTo(c1x, c1y, c2x, c2y, x, y);
          }

          break;

        case 27:
          // hhcurveto
          if (stack.length % 2) {
            y += stack.shift();
          }

          while (stack.length > 0) {
            c1x = x + stack.shift();
            c1y = y;
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x = c2x + stack.shift();
            y = c2y;
            p.curveTo(c1x, c1y, c2x, c2y, x, y);
          }

          break;

        case 28:
          // shortint
          b1 = code[i];
          b2 = code[i + 1];
          stack.push((b1 << 24 | b2 << 16) >> 16);
          i += 2;
          break;

        case 29:
          // callgsubr
          codeIndex = stack.pop() + font.gsubrsBias;
          subrCode = font.gsubrs[codeIndex];

          if (subrCode) {
            parse(subrCode);
          }

          break;

        case 30:
          // vhcurveto
          while (stack.length > 0) {
            c1x = x;
            c1y = y + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x = c2x + stack.shift();
            y = c2y + (stack.length === 1 ? stack.shift() : 0);
            p.curveTo(c1x, c1y, c2x, c2y, x, y);

            if (stack.length === 0) {
              break;
            }

            c1x = x + stack.shift();
            c1y = y;
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            y = c2y + stack.shift();
            x = c2x + (stack.length === 1 ? stack.shift() : 0);
            p.curveTo(c1x, c1y, c2x, c2y, x, y);
          }

          break;

        case 31:
          // hvcurveto
          while (stack.length > 0) {
            c1x = x + stack.shift();
            c1y = y;
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            y = c2y + stack.shift();
            x = c2x + (stack.length === 1 ? stack.shift() : 0);
            p.curveTo(c1x, c1y, c2x, c2y, x, y);

            if (stack.length === 0) {
              break;
            }

            c1x = x;
            c1y = y + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x = c2x + stack.shift();
            y = c2y + (stack.length === 1 ? stack.shift() : 0);
            p.curveTo(c1x, c1y, c2x, c2y, x, y);
          }

          break;

        default:
          if (v < 32) {
            console.log('Glyph ' + glyph.index + ': unknown operator ' + v);
          } else if (v < 247) {
            stack.push(v - 139);
          } else if (v < 251) {
            b1 = code[i];
            i += 1;
            stack.push((v - 247) * 256 + b1 + 108);
          } else if (v < 255) {
            b1 = code[i];
            i += 1;
            stack.push(-(v - 251) * 256 - b1 - 108);
          } else {
            b1 = code[i];
            b2 = code[i + 1];
            b3 = code[i + 2];
            b4 = code[i + 3];
            i += 4;
            stack.push((b1 << 24 | b2 << 16 | b3 << 8 | b4) / 65536);
          }

      }
    }
  }

  parse(code);
  glyph.advanceWidth = width;
  return p;
}

function parseCFFFDSelect(data, start, nGlyphs, fdArrayCount) {
  const fdSelect = [];
  let fdIndex;
  const parser = new _parse.default.Parser(data, start);
  const format = parser.parseCard8();

  if (format === 0) {
    // Simple list of nGlyphs elements
    for (let iGid = 0; iGid < nGlyphs; iGid++) {
      fdIndex = parser.parseCard8();

      if (fdIndex >= fdArrayCount) {
        throw new Error('CFF table CID Font FDSelect has bad FD index value ' + fdIndex + ' (FD count ' + fdArrayCount + ')');
      }

      fdSelect.push(fdIndex);
    }
  } else if (format === 3) {
    // Ranges
    const nRanges = parser.parseCard16();
    let first = parser.parseCard16();

    if (first !== 0) {
      throw new Error('CFF Table CID Font FDSelect format 3 range has bad initial GID ' + first);
    }

    let next;

    for (let iRange = 0; iRange < nRanges; iRange++) {
      fdIndex = parser.parseCard8();
      next = parser.parseCard16();

      if (fdIndex >= fdArrayCount) {
        throw new Error('CFF table CID Font FDSelect has bad FD index value ' + fdIndex + ' (FD count ' + fdArrayCount + ')');
      }

      if (next > nGlyphs) {
        throw new Error('CFF Table CID Font FDSelect format 3 range has bad GID ' + next);
      }

      for (; first < next; first++) {
        fdSelect.push(fdIndex);
      }

      first = next;
    }

    if (next !== nGlyphs) {
      throw new Error('CFF Table CID Font FDSelect format 3 range has bad final GID ' + next);
    }
  } else {
    throw new Error('CFF Table CID Font FDSelect table has unsupported format ' + format);
  }

  return fdSelect;
} // Parse the `CFF` table, which contains the glyph outlines in PostScript format.


function parseCFFTable(data, start, font, opt) {
  font.tables.cff = {};
  const header = parseCFFHeader(data, start);
  const nameIndex = parseCFFIndex(data, header.endOffset, _parse.default.bytesToString);
  const topDictIndex = parseCFFIndex(data, nameIndex.endOffset);
  const stringIndex = parseCFFIndex(data, topDictIndex.endOffset, _parse.default.bytesToString);
  const globalSubrIndex = parseCFFIndex(data, stringIndex.endOffset);
  font.gsubrs = globalSubrIndex.objects;
  font.gsubrsBias = calcCFFSubroutineBias(font.gsubrs);
  const topDictArray = gatherCFFTopDicts(data, start, topDictIndex.objects, stringIndex.objects);

  if (topDictArray.length !== 1) {
    throw new Error('CFF table has too many fonts in \'FontSet\' - count of fonts NameIndex.length = ' + topDictArray.length);
  }

  const topDict = topDictArray[0];
  font.tables.cff.topDict = topDict;

  if (topDict._privateDict) {
    font.defaultWidthX = topDict._privateDict.defaultWidthX;
    font.nominalWidthX = topDict._privateDict.nominalWidthX;
  }

  if (topDict.ros[0] !== undefined && topDict.ros[1] !== undefined) {
    font.isCIDFont = true;
  }

  if (font.isCIDFont) {
    let fdArrayOffset = topDict.fdArray;
    let fdSelectOffset = topDict.fdSelect;

    if (fdArrayOffset === 0 || fdSelectOffset === 0) {
      throw new Error('Font is marked as a CID font, but FDArray and/or FDSelect information is missing');
    }

    fdArrayOffset += start;
    const fdArrayIndex = parseCFFIndex(data, fdArrayOffset);
    const fdArray = gatherCFFTopDicts(data, start, fdArrayIndex.objects, stringIndex.objects);
    topDict._fdArray = fdArray;
    fdSelectOffset += start;
    topDict._fdSelect = parseCFFFDSelect(data, fdSelectOffset, font.numGlyphs, fdArray.length);
  }

  const privateDictOffset = start + topDict.private[1];
  const privateDict = parseCFFPrivateDict(data, privateDictOffset, topDict.private[0], stringIndex.objects);
  font.defaultWidthX = privateDict.defaultWidthX;
  font.nominalWidthX = privateDict.nominalWidthX;

  if (privateDict.subrs !== 0) {
    const subrOffset = privateDictOffset + privateDict.subrs;
    const subrIndex = parseCFFIndex(data, subrOffset);
    font.subrs = subrIndex.objects;
    font.subrsBias = calcCFFSubroutineBias(font.subrs);
  } else {
    font.subrs = [];
    font.subrsBias = 0;
  } // Offsets in the top dict are relative to the beginning of the CFF data, so add the CFF start offset.


  let charStringsIndex;

  if (opt.lowMemory) {
    charStringsIndex = parseCFFIndexLowMemory(data, start + topDict.charStrings);
    font.nGlyphs = charStringsIndex.offsets.length;
  } else {
    charStringsIndex = parseCFFIndex(data, start + topDict.charStrings);
    font.nGlyphs = charStringsIndex.objects.length;
  }

  const charset = parseCFFCharset(data, start + topDict.charset, font.nGlyphs, stringIndex.objects);

  if (topDict.encoding === 0) {
    // Standard encoding
    font.cffEncoding = new _encoding.CffEncoding(_encoding.cffStandardEncoding, charset);
  } else if (topDict.encoding === 1) {
    // Expert encoding
    font.cffEncoding = new _encoding.CffEncoding(_encoding.cffExpertEncoding, charset);
  } else {
    font.cffEncoding = parseCFFEncoding(data, start + topDict.encoding, charset);
  } // Prefer the CMAP encoding to the CFF encoding.


  font.encoding = font.encoding || font.cffEncoding;
  font.glyphs = new _glyphset.default.GlyphSet(font);

  if (opt.lowMemory) {
    font._push = function (i) {
      const charString = getCffIndexObject(i, charStringsIndex.offsets, data, start + topDict.charStrings);
      font.glyphs.push(i, _glyphset.default.cffGlyphLoader(font, i, parseCFFCharstring, charString));
    };
  } else {
    for (let i = 0; i < font.nGlyphs; i += 1) {
      const charString = charStringsIndex.objects[i];
      font.glyphs.push(i, _glyphset.default.cffGlyphLoader(font, i, parseCFFCharstring, charString));
    }
  }
} // Convert a string to a String ID (SID).
// The list of strings is modified in place.


function encodeString(s, strings) {
  let sid; // Is the string in the CFF standard strings?

  let i = _encoding.cffStandardStrings.indexOf(s);

  if (i >= 0) {
    sid = i;
  } // Is the string already in the string index?


  i = strings.indexOf(s);

  if (i >= 0) {
    sid = i + _encoding.cffStandardStrings.length;
  } else {
    sid = _encoding.cffStandardStrings.length + strings.length;
    strings.push(s);
  }

  return sid;
}

function makeHeader() {
  return new _table.default.Record('Header', [{
    name: 'major',
    type: 'Card8',
    value: 1
  }, {
    name: 'minor',
    type: 'Card8',
    value: 0
  }, {
    name: 'hdrSize',
    type: 'Card8',
    value: 4
  }, {
    name: 'major',
    type: 'Card8',
    value: 1
  }]);
}

function makeNameIndex(fontNames) {
  const t = new _table.default.Record('Name INDEX', [{
    name: 'names',
    type: 'INDEX',
    value: []
  }]);
  t.names = [];

  for (let i = 0; i < fontNames.length; i += 1) {
    t.names.push({
      name: 'name_' + i,
      type: 'NAME',
      value: fontNames[i]
    });
  }

  return t;
} // Given a dictionary's metadata, create a DICT structure.


function makeDict(meta, attrs, strings) {
  const m = {};

  for (let i = 0; i < meta.length; i += 1) {
    const entry = meta[i];
    let value = attrs[entry.name];

    if (value !== undefined && !equals(value, entry.value)) {
      if (entry.type === 'SID') {
        value = encodeString(value, strings);
      }

      m[entry.op] = {
        name: entry.name,
        type: entry.type,
        value: value
      };
    }
  }

  return m;
} // The Top DICT houses the global font attributes.


function makeTopDict(attrs, strings) {
  const t = new _table.default.Record('Top DICT', [{
    name: 'dict',
    type: 'DICT',
    value: {}
  }]);
  t.dict = makeDict(TOP_DICT_META, attrs, strings);
  return t;
}

function makeTopDictIndex(topDict) {
  const t = new _table.default.Record('Top DICT INDEX', [{
    name: 'topDicts',
    type: 'INDEX',
    value: []
  }]);
  t.topDicts = [{
    name: 'topDict_0',
    type: 'TABLE',
    value: topDict
  }];
  return t;
}

function makeStringIndex(strings) {
  const t = new _table.default.Record('String INDEX', [{
    name: 'strings',
    type: 'INDEX',
    value: []
  }]);
  t.strings = [];

  for (let i = 0; i < strings.length; i += 1) {
    t.strings.push({
      name: 'string_' + i,
      type: 'STRING',
      value: strings[i]
    });
  }

  return t;
}

function makeGlobalSubrIndex() {
  // Currently we don't use subroutines.
  return new _table.default.Record('Global Subr INDEX', [{
    name: 'subrs',
    type: 'INDEX',
    value: []
  }]);
}

function makeCharsets(glyphNames, strings) {
  const t = new _table.default.Record('Charsets', [{
    name: 'format',
    type: 'Card8',
    value: 0
  }]);

  for (let i = 0; i < glyphNames.length; i += 1) {
    const glyphName = glyphNames[i];
    const glyphSID = encodeString(glyphName, strings);
    t.fields.push({
      name: 'glyph_' + i,
      type: 'SID',
      value: glyphSID
    });
  }

  return t;
}

function glyphToOps(glyph) {
  const ops = [];
  const path = glyph.path;
  ops.push({
    name: 'width',
    type: 'NUMBER',
    value: glyph.advanceWidth
  });
  let x = 0;
  let y = 0;

  for (let i = 0; i < path.commands.length; i += 1) {
    let dx;
    let dy;
    let cmd = path.commands[i];

    if (cmd.type === 'Q') {
      // CFF only supports bézier curves, so convert the quad to a bézier.
      const _13 = 1 / 3;

      const _23 = 2 / 3; // We're going to create a new command so we don't change the original path.


      cmd = {
        type: 'C',
        x: cmd.x,
        y: cmd.y,
        x1: _13 * x + _23 * cmd.x1,
        y1: _13 * y + _23 * cmd.y1,
        x2: _13 * cmd.x + _23 * cmd.x1,
        y2: _13 * cmd.y + _23 * cmd.y1
      };
    }

    if (cmd.type === 'M') {
      dx = Math.round(cmd.x - x);
      dy = Math.round(cmd.y - y);
      ops.push({
        name: 'dx',
        type: 'NUMBER',
        value: dx
      });
      ops.push({
        name: 'dy',
        type: 'NUMBER',
        value: dy
      });
      ops.push({
        name: 'rmoveto',
        type: 'OP',
        value: 21
      });
      x = Math.round(cmd.x);
      y = Math.round(cmd.y);
    } else if (cmd.type === 'L') {
      dx = Math.round(cmd.x - x);
      dy = Math.round(cmd.y - y);
      ops.push({
        name: 'dx',
        type: 'NUMBER',
        value: dx
      });
      ops.push({
        name: 'dy',
        type: 'NUMBER',
        value: dy
      });
      ops.push({
        name: 'rlineto',
        type: 'OP',
        value: 5
      });
      x = Math.round(cmd.x);
      y = Math.round(cmd.y);
    } else if (cmd.type === 'C') {
      const dx1 = Math.round(cmd.x1 - x);
      const dy1 = Math.round(cmd.y1 - y);
      const dx2 = Math.round(cmd.x2 - cmd.x1);
      const dy2 = Math.round(cmd.y2 - cmd.y1);
      dx = Math.round(cmd.x - cmd.x2);
      dy = Math.round(cmd.y - cmd.y2);
      ops.push({
        name: 'dx1',
        type: 'NUMBER',
        value: dx1
      });
      ops.push({
        name: 'dy1',
        type: 'NUMBER',
        value: dy1
      });
      ops.push({
        name: 'dx2',
        type: 'NUMBER',
        value: dx2
      });
      ops.push({
        name: 'dy2',
        type: 'NUMBER',
        value: dy2
      });
      ops.push({
        name: 'dx',
        type: 'NUMBER',
        value: dx
      });
      ops.push({
        name: 'dy',
        type: 'NUMBER',
        value: dy
      });
      ops.push({
        name: 'rrcurveto',
        type: 'OP',
        value: 8
      });
      x = Math.round(cmd.x);
      y = Math.round(cmd.y);
    } // Contours are closed automatically.

  }

  ops.push({
    name: 'endchar',
    type: 'OP',
    value: 14
  });
  return ops;
}

function makeCharStringsIndex(glyphs) {
  const t = new _table.default.Record('CharStrings INDEX', [{
    name: 'charStrings',
    type: 'INDEX',
    value: []
  }]);

  for (let i = 0; i < glyphs.length; i += 1) {
    const glyph = glyphs.get(i);
    const ops = glyphToOps(glyph);
    t.charStrings.push({
      name: glyph.name,
      type: 'CHARSTRING',
      value: ops
    });
  }

  return t;
}

function makePrivateDict(attrs, strings) {
  const t = new _table.default.Record('Private DICT', [{
    name: 'dict',
    type: 'DICT',
    value: {}
  }]);
  t.dict = makeDict(PRIVATE_DICT_META, attrs, strings);
  return t;
}

function makeCFFTable(glyphs, options) {
  const t = new _table.default.Table('CFF ', [{
    name: 'header',
    type: 'RECORD'
  }, {
    name: 'nameIndex',
    type: 'RECORD'
  }, {
    name: 'topDictIndex',
    type: 'RECORD'
  }, {
    name: 'stringIndex',
    type: 'RECORD'
  }, {
    name: 'globalSubrIndex',
    type: 'RECORD'
  }, {
    name: 'charsets',
    type: 'RECORD'
  }, {
    name: 'charStringsIndex',
    type: 'RECORD'
  }, {
    name: 'privateDict',
    type: 'RECORD'
  }]);
  const fontScale = 1 / options.unitsPerEm; // We use non-zero values for the offsets so that the DICT encodes them.
  // This is important because the size of the Top DICT plays a role in offset calculation,
  // and the size shouldn't change after we've written correct offsets.

  const attrs = {
    version: options.version,
    fullName: options.fullName,
    familyName: options.familyName,
    weight: options.weightName,
    fontBBox: options.fontBBox || [0, 0, 0, 0],
    fontMatrix: [fontScale, 0, 0, fontScale, 0, 0],
    charset: 999,
    encoding: 0,
    charStrings: 999,
    private: [0, 999]
  };
  const privateAttrs = {};
  const glyphNames = [];
  let glyph; // Skip first glyph (.notdef)

  for (let i = 1; i < glyphs.length; i += 1) {
    glyph = glyphs.get(i);
    glyphNames.push(glyph.name);
  }

  const strings = [];
  t.header = makeHeader();
  t.nameIndex = makeNameIndex([options.postScriptName]);
  let topDict = makeTopDict(attrs, strings);
  t.topDictIndex = makeTopDictIndex(topDict);
  t.globalSubrIndex = makeGlobalSubrIndex();
  t.charsets = makeCharsets(glyphNames, strings);
  t.charStringsIndex = makeCharStringsIndex(glyphs);
  t.privateDict = makePrivateDict(privateAttrs, strings); // Needs to come at the end, to encode all custom strings used in the font.

  t.stringIndex = makeStringIndex(strings);
  const startOffset = t.header.sizeOf() + t.nameIndex.sizeOf() + t.topDictIndex.sizeOf() + t.stringIndex.sizeOf() + t.globalSubrIndex.sizeOf();
  attrs.charset = startOffset; // We use the CFF standard encoding; proper encoding will be handled in cmap.

  attrs.encoding = 0;
  attrs.charStrings = attrs.charset + t.charsets.sizeOf();
  attrs.private[1] = attrs.charStrings + t.charStringsIndex.sizeOf(); // Recreate the Top DICT INDEX with the correct offsets.

  topDict = makeTopDict(attrs, strings);
  t.topDictIndex = makeTopDictIndex(topDict);
  return t;
}

var _default = {
  parse: parseCFFTable,
  make: makeCFFTable
};
exports.default = _default;
},{"../encoding":"../node_modules/opentype.js/src/encoding.js","../glyphset":"../node_modules/opentype.js/src/glyphset.js","../parse":"../node_modules/opentype.js/src/parse.js","../path":"../node_modules/opentype.js/src/path.js","../table":"../node_modules/opentype.js/src/table.js"}],"../node_modules/opentype.js/src/tables/head.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _check = _interopRequireDefault(require("../check"));

var _parse = _interopRequireDefault(require("../parse"));

var _table = _interopRequireDefault(require("../table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The `head` table contains global information about the font.
// https://www.microsoft.com/typography/OTSPEC/head.htm
// Parse the header `head` table
function parseHeadTable(data, start) {
  const head = {};
  const p = new _parse.default.Parser(data, start);
  head.version = p.parseVersion();
  head.fontRevision = Math.round(p.parseFixed() * 1000) / 1000;
  head.checkSumAdjustment = p.parseULong();
  head.magicNumber = p.parseULong();

  _check.default.argument(head.magicNumber === 0x5F0F3CF5, 'Font header has wrong magic number.');

  head.flags = p.parseUShort();
  head.unitsPerEm = p.parseUShort();
  head.created = p.parseLongDateTime();
  head.modified = p.parseLongDateTime();
  head.xMin = p.parseShort();
  head.yMin = p.parseShort();
  head.xMax = p.parseShort();
  head.yMax = p.parseShort();
  head.macStyle = p.parseUShort();
  head.lowestRecPPEM = p.parseUShort();
  head.fontDirectionHint = p.parseShort();
  head.indexToLocFormat = p.parseShort();
  head.glyphDataFormat = p.parseShort();
  return head;
}

function makeHeadTable(options) {
  // Apple Mac timestamp epoch is 01/01/1904 not 01/01/1970
  const timestamp = Math.round(new Date().getTime() / 1000) + 2082844800;
  let createdTimestamp = timestamp;

  if (options.createdTimestamp) {
    createdTimestamp = options.createdTimestamp + 2082844800;
  }

  return new _table.default.Table('head', [{
    name: 'version',
    type: 'FIXED',
    value: 0x00010000
  }, {
    name: 'fontRevision',
    type: 'FIXED',
    value: 0x00010000
  }, {
    name: 'checkSumAdjustment',
    type: 'ULONG',
    value: 0
  }, {
    name: 'magicNumber',
    type: 'ULONG',
    value: 0x5F0F3CF5
  }, {
    name: 'flags',
    type: 'USHORT',
    value: 0
  }, {
    name: 'unitsPerEm',
    type: 'USHORT',
    value: 1000
  }, {
    name: 'created',
    type: 'LONGDATETIME',
    value: createdTimestamp
  }, {
    name: 'modified',
    type: 'LONGDATETIME',
    value: timestamp
  }, {
    name: 'xMin',
    type: 'SHORT',
    value: 0
  }, {
    name: 'yMin',
    type: 'SHORT',
    value: 0
  }, {
    name: 'xMax',
    type: 'SHORT',
    value: 0
  }, {
    name: 'yMax',
    type: 'SHORT',
    value: 0
  }, {
    name: 'macStyle',
    type: 'USHORT',
    value: 0
  }, {
    name: 'lowestRecPPEM',
    type: 'USHORT',
    value: 0
  }, {
    name: 'fontDirectionHint',
    type: 'SHORT',
    value: 2
  }, {
    name: 'indexToLocFormat',
    type: 'SHORT',
    value: 0
  }, {
    name: 'glyphDataFormat',
    type: 'SHORT',
    value: 0
  }], options);
}

var _default = {
  parse: parseHeadTable,
  make: makeHeadTable
};
exports.default = _default;
},{"../check":"../node_modules/opentype.js/src/check.js","../parse":"../node_modules/opentype.js/src/parse.js","../table":"../node_modules/opentype.js/src/table.js"}],"../node_modules/opentype.js/src/tables/hhea.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _parse = _interopRequireDefault(require("../parse"));

var _table = _interopRequireDefault(require("../table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The `hhea` table contains information for horizontal layout.
// https://www.microsoft.com/typography/OTSPEC/hhea.htm
// Parse the horizontal header `hhea` table
function parseHheaTable(data, start) {
  const hhea = {};
  const p = new _parse.default.Parser(data, start);
  hhea.version = p.parseVersion();
  hhea.ascender = p.parseShort();
  hhea.descender = p.parseShort();
  hhea.lineGap = p.parseShort();
  hhea.advanceWidthMax = p.parseUShort();
  hhea.minLeftSideBearing = p.parseShort();
  hhea.minRightSideBearing = p.parseShort();
  hhea.xMaxExtent = p.parseShort();
  hhea.caretSlopeRise = p.parseShort();
  hhea.caretSlopeRun = p.parseShort();
  hhea.caretOffset = p.parseShort();
  p.relativeOffset += 8;
  hhea.metricDataFormat = p.parseShort();
  hhea.numberOfHMetrics = p.parseUShort();
  return hhea;
}

function makeHheaTable(options) {
  return new _table.default.Table('hhea', [{
    name: 'version',
    type: 'FIXED',
    value: 0x00010000
  }, {
    name: 'ascender',
    type: 'FWORD',
    value: 0
  }, {
    name: 'descender',
    type: 'FWORD',
    value: 0
  }, {
    name: 'lineGap',
    type: 'FWORD',
    value: 0
  }, {
    name: 'advanceWidthMax',
    type: 'UFWORD',
    value: 0
  }, {
    name: 'minLeftSideBearing',
    type: 'FWORD',
    value: 0
  }, {
    name: 'minRightSideBearing',
    type: 'FWORD',
    value: 0
  }, {
    name: 'xMaxExtent',
    type: 'FWORD',
    value: 0
  }, {
    name: 'caretSlopeRise',
    type: 'SHORT',
    value: 1
  }, {
    name: 'caretSlopeRun',
    type: 'SHORT',
    value: 0
  }, {
    name: 'caretOffset',
    type: 'SHORT',
    value: 0
  }, {
    name: 'reserved1',
    type: 'SHORT',
    value: 0
  }, {
    name: 'reserved2',
    type: 'SHORT',
    value: 0
  }, {
    name: 'reserved3',
    type: 'SHORT',
    value: 0
  }, {
    name: 'reserved4',
    type: 'SHORT',
    value: 0
  }, {
    name: 'metricDataFormat',
    type: 'SHORT',
    value: 0
  }, {
    name: 'numberOfHMetrics',
    type: 'USHORT',
    value: 0
  }], options);
}

var _default = {
  parse: parseHheaTable,
  make: makeHheaTable
};
exports.default = _default;
},{"../parse":"../node_modules/opentype.js/src/parse.js","../table":"../node_modules/opentype.js/src/table.js"}],"../node_modules/opentype.js/src/tables/hmtx.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _parse = _interopRequireDefault(require("../parse"));

var _table = _interopRequireDefault(require("../table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The `hmtx` table contains the horizontal metrics for all glyphs.
// https://www.microsoft.com/typography/OTSPEC/hmtx.htm
function parseHmtxTableAll(data, start, numMetrics, numGlyphs, glyphs) {
  let advanceWidth;
  let leftSideBearing;
  const p = new _parse.default.Parser(data, start);

  for (let i = 0; i < numGlyphs; i += 1) {
    // If the font is monospaced, only one entry is needed. This last entry applies to all subsequent glyphs.
    if (i < numMetrics) {
      advanceWidth = p.parseUShort();
      leftSideBearing = p.parseShort();
    }

    const glyph = glyphs.get(i);
    glyph.advanceWidth = advanceWidth;
    glyph.leftSideBearing = leftSideBearing;
  }
}

function parseHmtxTableOnLowMemory(font, data, start, numMetrics, numGlyphs) {
  font._hmtxTableData = {};
  let advanceWidth;
  let leftSideBearing;
  const p = new _parse.default.Parser(data, start);

  for (let i = 0; i < numGlyphs; i += 1) {
    // If the font is monospaced, only one entry is needed. This last entry applies to all subsequent glyphs.
    if (i < numMetrics) {
      advanceWidth = p.parseUShort();
      leftSideBearing = p.parseShort();
    }

    font._hmtxTableData[i] = {
      advanceWidth: advanceWidth,
      leftSideBearing: leftSideBearing
    };
  }
} // Parse the `hmtx` table, which contains the horizontal metrics for all glyphs.
// This function augments the glyph array, adding the advanceWidth and leftSideBearing to each glyph.


function parseHmtxTable(font, data, start, numMetrics, numGlyphs, glyphs, opt) {
  if (opt.lowMemory) parseHmtxTableOnLowMemory(font, data, start, numMetrics, numGlyphs);else parseHmtxTableAll(data, start, numMetrics, numGlyphs, glyphs);
}

function makeHmtxTable(glyphs) {
  const t = new _table.default.Table('hmtx', []);

  for (let i = 0; i < glyphs.length; i += 1) {
    const glyph = glyphs.get(i);
    const advanceWidth = glyph.advanceWidth || 0;
    const leftSideBearing = glyph.leftSideBearing || 0;
    t.fields.push({
      name: 'advanceWidth_' + i,
      type: 'USHORT',
      value: advanceWidth
    });
    t.fields.push({
      name: 'leftSideBearing_' + i,
      type: 'SHORT',
      value: leftSideBearing
    });
  }

  return t;
}

var _default = {
  parse: parseHmtxTable,
  make: makeHmtxTable
};
exports.default = _default;
},{"../parse":"../node_modules/opentype.js/src/parse.js","../table":"../node_modules/opentype.js/src/table.js"}],"../node_modules/opentype.js/src/tables/ltag.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _check = _interopRequireDefault(require("../check"));

var _parse = _interopRequireDefault(require("../parse"));

var _table = _interopRequireDefault(require("../table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The `ltag` table stores IETF BCP-47 language tags. It allows supporting
// languages for which TrueType does not assign a numeric code.
// https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6ltag.html
// http://www.w3.org/International/articles/language-tags/
// http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
function makeLtagTable(tags) {
  const result = new _table.default.Table('ltag', [{
    name: 'version',
    type: 'ULONG',
    value: 1
  }, {
    name: 'flags',
    type: 'ULONG',
    value: 0
  }, {
    name: 'numTags',
    type: 'ULONG',
    value: tags.length
  }]);
  let stringPool = '';
  const stringPoolOffset = 12 + tags.length * 4;

  for (let i = 0; i < tags.length; ++i) {
    let pos = stringPool.indexOf(tags[i]);

    if (pos < 0) {
      pos = stringPool.length;
      stringPool += tags[i];
    }

    result.fields.push({
      name: 'offset ' + i,
      type: 'USHORT',
      value: stringPoolOffset + pos
    });
    result.fields.push({
      name: 'length ' + i,
      type: 'USHORT',
      value: tags[i].length
    });
  }

  result.fields.push({
    name: 'stringPool',
    type: 'CHARARRAY',
    value: stringPool
  });
  return result;
}

function parseLtagTable(data, start) {
  const p = new _parse.default.Parser(data, start);
  const tableVersion = p.parseULong();

  _check.default.argument(tableVersion === 1, 'Unsupported ltag table version.'); // The 'ltag' specification does not define any flags; skip the field.


  p.skip('uLong', 1);
  const numTags = p.parseULong();
  const tags = [];

  for (let i = 0; i < numTags; i++) {
    let tag = '';
    const offset = start + p.parseUShort();
    const length = p.parseUShort();

    for (let j = offset; j < offset + length; ++j) {
      tag += String.fromCharCode(data.getInt8(j));
    }

    tags.push(tag);
  }

  return tags;
}

var _default = {
  make: makeLtagTable,
  parse: parseLtagTable
};
exports.default = _default;
},{"../check":"../node_modules/opentype.js/src/check.js","../parse":"../node_modules/opentype.js/src/parse.js","../table":"../node_modules/opentype.js/src/table.js"}],"../node_modules/opentype.js/src/tables/maxp.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _parse = _interopRequireDefault(require("../parse"));

var _table = _interopRequireDefault(require("../table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The `maxp` table establishes the memory requirements for the font.
// We need it just to get the number of glyphs in the font.
// https://www.microsoft.com/typography/OTSPEC/maxp.htm
// Parse the maximum profile `maxp` table.
function parseMaxpTable(data, start) {
  const maxp = {};
  const p = new _parse.default.Parser(data, start);
  maxp.version = p.parseVersion();
  maxp.numGlyphs = p.parseUShort();

  if (maxp.version === 1.0) {
    maxp.maxPoints = p.parseUShort();
    maxp.maxContours = p.parseUShort();
    maxp.maxCompositePoints = p.parseUShort();
    maxp.maxCompositeContours = p.parseUShort();
    maxp.maxZones = p.parseUShort();
    maxp.maxTwilightPoints = p.parseUShort();
    maxp.maxStorage = p.parseUShort();
    maxp.maxFunctionDefs = p.parseUShort();
    maxp.maxInstructionDefs = p.parseUShort();
    maxp.maxStackElements = p.parseUShort();
    maxp.maxSizeOfInstructions = p.parseUShort();
    maxp.maxComponentElements = p.parseUShort();
    maxp.maxComponentDepth = p.parseUShort();
  }

  return maxp;
}

function makeMaxpTable(numGlyphs) {
  return new _table.default.Table('maxp', [{
    name: 'version',
    type: 'FIXED',
    value: 0x00005000
  }, {
    name: 'numGlyphs',
    type: 'USHORT',
    value: numGlyphs
  }]);
}

var _default = {
  parse: parseMaxpTable,
  make: makeMaxpTable
};
exports.default = _default;
},{"../parse":"../node_modules/opentype.js/src/parse.js","../table":"../node_modules/opentype.js/src/table.js"}],"../node_modules/opentype.js/src/tables/name.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _types = require("../types");

var _parse = _interopRequireDefault(require("../parse"));

var _table = _interopRequireDefault(require("../table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The `name` naming table.
// https://www.microsoft.com/typography/OTSPEC/name.htm
// NameIDs for the name table.
const nameTableNames = ['copyright', // 0
'fontFamily', // 1
'fontSubfamily', // 2
'uniqueID', // 3
'fullName', // 4
'version', // 5
'postScriptName', // 6
'trademark', // 7
'manufacturer', // 8
'designer', // 9
'description', // 10
'manufacturerURL', // 11
'designerURL', // 12
'license', // 13
'licenseURL', // 14
'reserved', // 15
'preferredFamily', // 16
'preferredSubfamily', // 17
'compatibleFullName', // 18
'sampleText', // 19
'postScriptFindFontName', // 20
'wwsFamily', // 21
'wwsSubfamily' // 22
];
const macLanguages = {
  0: 'en',
  1: 'fr',
  2: 'de',
  3: 'it',
  4: 'nl',
  5: 'sv',
  6: 'es',
  7: 'da',
  8: 'pt',
  9: 'no',
  10: 'he',
  11: 'ja',
  12: 'ar',
  13: 'fi',
  14: 'el',
  15: 'is',
  16: 'mt',
  17: 'tr',
  18: 'hr',
  19: 'zh-Hant',
  20: 'ur',
  21: 'hi',
  22: 'th',
  23: 'ko',
  24: 'lt',
  25: 'pl',
  26: 'hu',
  27: 'es',
  28: 'lv',
  29: 'se',
  30: 'fo',
  31: 'fa',
  32: 'ru',
  33: 'zh',
  34: 'nl-BE',
  35: 'ga',
  36: 'sq',
  37: 'ro',
  38: 'cz',
  39: 'sk',
  40: 'si',
  41: 'yi',
  42: 'sr',
  43: 'mk',
  44: 'bg',
  45: 'uk',
  46: 'be',
  47: 'uz',
  48: 'kk',
  49: 'az-Cyrl',
  50: 'az-Arab',
  51: 'hy',
  52: 'ka',
  53: 'mo',
  54: 'ky',
  55: 'tg',
  56: 'tk',
  57: 'mn-CN',
  58: 'mn',
  59: 'ps',
  60: 'ks',
  61: 'ku',
  62: 'sd',
  63: 'bo',
  64: 'ne',
  65: 'sa',
  66: 'mr',
  67: 'bn',
  68: 'as',
  69: 'gu',
  70: 'pa',
  71: 'or',
  72: 'ml',
  73: 'kn',
  74: 'ta',
  75: 'te',
  76: 'si',
  77: 'my',
  78: 'km',
  79: 'lo',
  80: 'vi',
  81: 'id',
  82: 'tl',
  83: 'ms',
  84: 'ms-Arab',
  85: 'am',
  86: 'ti',
  87: 'om',
  88: 'so',
  89: 'sw',
  90: 'rw',
  91: 'rn',
  92: 'ny',
  93: 'mg',
  94: 'eo',
  128: 'cy',
  129: 'eu',
  130: 'ca',
  131: 'la',
  132: 'qu',
  133: 'gn',
  134: 'ay',
  135: 'tt',
  136: 'ug',
  137: 'dz',
  138: 'jv',
  139: 'su',
  140: 'gl',
  141: 'af',
  142: 'br',
  143: 'iu',
  144: 'gd',
  145: 'gv',
  146: 'ga',
  147: 'to',
  148: 'el-polyton',
  149: 'kl',
  150: 'az',
  151: 'nn'
}; // MacOS language ID → MacOS script ID
//
// Note that the script ID is not sufficient to determine what encoding
// to use in TrueType files. For some languages, MacOS used a modification
// of a mainstream script. For example, an Icelandic name would be stored
// with smRoman in the TrueType naming table, but the actual encoding
// is a special Icelandic version of the normal Macintosh Roman encoding.
// As another example, Inuktitut uses an 8-bit encoding for Canadian Aboriginal
// Syllables but MacOS had run out of available script codes, so this was
// done as a (pretty radical) "modification" of Ethiopic.
//
// http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/Readme.txt

const macLanguageToScript = {
  0: 0,
  // langEnglish → smRoman
  1: 0,
  // langFrench → smRoman
  2: 0,
  // langGerman → smRoman
  3: 0,
  // langItalian → smRoman
  4: 0,
  // langDutch → smRoman
  5: 0,
  // langSwedish → smRoman
  6: 0,
  // langSpanish → smRoman
  7: 0,
  // langDanish → smRoman
  8: 0,
  // langPortuguese → smRoman
  9: 0,
  // langNorwegian → smRoman
  10: 5,
  // langHebrew → smHebrew
  11: 1,
  // langJapanese → smJapanese
  12: 4,
  // langArabic → smArabic
  13: 0,
  // langFinnish → smRoman
  14: 6,
  // langGreek → smGreek
  15: 0,
  // langIcelandic → smRoman (modified)
  16: 0,
  // langMaltese → smRoman
  17: 0,
  // langTurkish → smRoman (modified)
  18: 0,
  // langCroatian → smRoman (modified)
  19: 2,
  // langTradChinese → smTradChinese
  20: 4,
  // langUrdu → smArabic
  21: 9,
  // langHindi → smDevanagari
  22: 21,
  // langThai → smThai
  23: 3,
  // langKorean → smKorean
  24: 29,
  // langLithuanian → smCentralEuroRoman
  25: 29,
  // langPolish → smCentralEuroRoman
  26: 29,
  // langHungarian → smCentralEuroRoman
  27: 29,
  // langEstonian → smCentralEuroRoman
  28: 29,
  // langLatvian → smCentralEuroRoman
  29: 0,
  // langSami → smRoman
  30: 0,
  // langFaroese → smRoman (modified)
  31: 4,
  // langFarsi → smArabic (modified)
  32: 7,
  // langRussian → smCyrillic
  33: 25,
  // langSimpChinese → smSimpChinese
  34: 0,
  // langFlemish → smRoman
  35: 0,
  // langIrishGaelic → smRoman (modified)
  36: 0,
  // langAlbanian → smRoman
  37: 0,
  // langRomanian → smRoman (modified)
  38: 29,
  // langCzech → smCentralEuroRoman
  39: 29,
  // langSlovak → smCentralEuroRoman
  40: 0,
  // langSlovenian → smRoman (modified)
  41: 5,
  // langYiddish → smHebrew
  42: 7,
  // langSerbian → smCyrillic
  43: 7,
  // langMacedonian → smCyrillic
  44: 7,
  // langBulgarian → smCyrillic
  45: 7,
  // langUkrainian → smCyrillic (modified)
  46: 7,
  // langByelorussian → smCyrillic
  47: 7,
  // langUzbek → smCyrillic
  48: 7,
  // langKazakh → smCyrillic
  49: 7,
  // langAzerbaijani → smCyrillic
  50: 4,
  // langAzerbaijanAr → smArabic
  51: 24,
  // langArmenian → smArmenian
  52: 23,
  // langGeorgian → smGeorgian
  53: 7,
  // langMoldavian → smCyrillic
  54: 7,
  // langKirghiz → smCyrillic
  55: 7,
  // langTajiki → smCyrillic
  56: 7,
  // langTurkmen → smCyrillic
  57: 27,
  // langMongolian → smMongolian
  58: 7,
  // langMongolianCyr → smCyrillic
  59: 4,
  // langPashto → smArabic
  60: 4,
  // langKurdish → smArabic
  61: 4,
  // langKashmiri → smArabic
  62: 4,
  // langSindhi → smArabic
  63: 26,
  // langTibetan → smTibetan
  64: 9,
  // langNepali → smDevanagari
  65: 9,
  // langSanskrit → smDevanagari
  66: 9,
  // langMarathi → smDevanagari
  67: 13,
  // langBengali → smBengali
  68: 13,
  // langAssamese → smBengali
  69: 11,
  // langGujarati → smGujarati
  70: 10,
  // langPunjabi → smGurmukhi
  71: 12,
  // langOriya → smOriya
  72: 17,
  // langMalayalam → smMalayalam
  73: 16,
  // langKannada → smKannada
  74: 14,
  // langTamil → smTamil
  75: 15,
  // langTelugu → smTelugu
  76: 18,
  // langSinhalese → smSinhalese
  77: 19,
  // langBurmese → smBurmese
  78: 20,
  // langKhmer → smKhmer
  79: 22,
  // langLao → smLao
  80: 30,
  // langVietnamese → smVietnamese
  81: 0,
  // langIndonesian → smRoman
  82: 0,
  // langTagalog → smRoman
  83: 0,
  // langMalayRoman → smRoman
  84: 4,
  // langMalayArabic → smArabic
  85: 28,
  // langAmharic → smEthiopic
  86: 28,
  // langTigrinya → smEthiopic
  87: 28,
  // langOromo → smEthiopic
  88: 0,
  // langSomali → smRoman
  89: 0,
  // langSwahili → smRoman
  90: 0,
  // langKinyarwanda → smRoman
  91: 0,
  // langRundi → smRoman
  92: 0,
  // langNyanja → smRoman
  93: 0,
  // langMalagasy → smRoman
  94: 0,
  // langEsperanto → smRoman
  128: 0,
  // langWelsh → smRoman (modified)
  129: 0,
  // langBasque → smRoman
  130: 0,
  // langCatalan → smRoman
  131: 0,
  // langLatin → smRoman
  132: 0,
  // langQuechua → smRoman
  133: 0,
  // langGuarani → smRoman
  134: 0,
  // langAymara → smRoman
  135: 7,
  // langTatar → smCyrillic
  136: 4,
  // langUighur → smArabic
  137: 26,
  // langDzongkha → smTibetan
  138: 0,
  // langJavaneseRom → smRoman
  139: 0,
  // langSundaneseRom → smRoman
  140: 0,
  // langGalician → smRoman
  141: 0,
  // langAfrikaans → smRoman
  142: 0,
  // langBreton → smRoman (modified)
  143: 28,
  // langInuktitut → smEthiopic (modified)
  144: 0,
  // langScottishGaelic → smRoman (modified)
  145: 0,
  // langManxGaelic → smRoman (modified)
  146: 0,
  // langIrishGaelicScript → smRoman (modified)
  147: 0,
  // langTongan → smRoman
  148: 6,
  // langGreekAncient → smRoman
  149: 0,
  // langGreenlandic → smRoman
  150: 0,
  // langAzerbaijanRoman → smRoman
  151: 0 // langNynorsk → smRoman

}; // While Microsoft indicates a region/country for all its language
// IDs, we omit the region code if it's equal to the "most likely
// region subtag" according to Unicode CLDR. For scripts, we omit
// the subtag if it is equal to the Suppress-Script entry in the
// IANA language subtag registry for IETF BCP 47.
//
// For example, Microsoft states that its language code 0x041A is
// Croatian in Croatia. We transform this to the BCP 47 language code 'hr'
// and not 'hr-HR' because Croatia is the default country for Croatian,
// according to Unicode CLDR. As another example, Microsoft states
// that 0x101A is Croatian (Latin) in Bosnia-Herzegovina. We transform
// this to 'hr-BA' and not 'hr-Latn-BA' because Latin is the default script
// for the Croatian language, according to IANA.
//
// http://www.unicode.org/cldr/charts/latest/supplemental/likely_subtags.html
// http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry

const windowsLanguages = {
  0x0436: 'af',
  0x041C: 'sq',
  0x0484: 'gsw',
  0x045E: 'am',
  0x1401: 'ar-DZ',
  0x3C01: 'ar-BH',
  0x0C01: 'ar',
  0x0801: 'ar-IQ',
  0x2C01: 'ar-JO',
  0x3401: 'ar-KW',
  0x3001: 'ar-LB',
  0x1001: 'ar-LY',
  0x1801: 'ary',
  0x2001: 'ar-OM',
  0x4001: 'ar-QA',
  0x0401: 'ar-SA',
  0x2801: 'ar-SY',
  0x1C01: 'aeb',
  0x3801: 'ar-AE',
  0x2401: 'ar-YE',
  0x042B: 'hy',
  0x044D: 'as',
  0x082C: 'az-Cyrl',
  0x042C: 'az',
  0x046D: 'ba',
  0x042D: 'eu',
  0x0423: 'be',
  0x0845: 'bn',
  0x0445: 'bn-IN',
  0x201A: 'bs-Cyrl',
  0x141A: 'bs',
  0x047E: 'br',
  0x0402: 'bg',
  0x0403: 'ca',
  0x0C04: 'zh-HK',
  0x1404: 'zh-MO',
  0x0804: 'zh',
  0x1004: 'zh-SG',
  0x0404: 'zh-TW',
  0x0483: 'co',
  0x041A: 'hr',
  0x101A: 'hr-BA',
  0x0405: 'cs',
  0x0406: 'da',
  0x048C: 'prs',
  0x0465: 'dv',
  0x0813: 'nl-BE',
  0x0413: 'nl',
  0x0C09: 'en-AU',
  0x2809: 'en-BZ',
  0x1009: 'en-CA',
  0x2409: 'en-029',
  0x4009: 'en-IN',
  0x1809: 'en-IE',
  0x2009: 'en-JM',
  0x4409: 'en-MY',
  0x1409: 'en-NZ',
  0x3409: 'en-PH',
  0x4809: 'en-SG',
  0x1C09: 'en-ZA',
  0x2C09: 'en-TT',
  0x0809: 'en-GB',
  0x0409: 'en',
  0x3009: 'en-ZW',
  0x0425: 'et',
  0x0438: 'fo',
  0x0464: 'fil',
  0x040B: 'fi',
  0x080C: 'fr-BE',
  0x0C0C: 'fr-CA',
  0x040C: 'fr',
  0x140C: 'fr-LU',
  0x180C: 'fr-MC',
  0x100C: 'fr-CH',
  0x0462: 'fy',
  0x0456: 'gl',
  0x0437: 'ka',
  0x0C07: 'de-AT',
  0x0407: 'de',
  0x1407: 'de-LI',
  0x1007: 'de-LU',
  0x0807: 'de-CH',
  0x0408: 'el',
  0x046F: 'kl',
  0x0447: 'gu',
  0x0468: 'ha',
  0x040D: 'he',
  0x0439: 'hi',
  0x040E: 'hu',
  0x040F: 'is',
  0x0470: 'ig',
  0x0421: 'id',
  0x045D: 'iu',
  0x085D: 'iu-Latn',
  0x083C: 'ga',
  0x0434: 'xh',
  0x0435: 'zu',
  0x0410: 'it',
  0x0810: 'it-CH',
  0x0411: 'ja',
  0x044B: 'kn',
  0x043F: 'kk',
  0x0453: 'km',
  0x0486: 'quc',
  0x0487: 'rw',
  0x0441: 'sw',
  0x0457: 'kok',
  0x0412: 'ko',
  0x0440: 'ky',
  0x0454: 'lo',
  0x0426: 'lv',
  0x0427: 'lt',
  0x082E: 'dsb',
  0x046E: 'lb',
  0x042F: 'mk',
  0x083E: 'ms-BN',
  0x043E: 'ms',
  0x044C: 'ml',
  0x043A: 'mt',
  0x0481: 'mi',
  0x047A: 'arn',
  0x044E: 'mr',
  0x047C: 'moh',
  0x0450: 'mn',
  0x0850: 'mn-CN',
  0x0461: 'ne',
  0x0414: 'nb',
  0x0814: 'nn',
  0x0482: 'oc',
  0x0448: 'or',
  0x0463: 'ps',
  0x0415: 'pl',
  0x0416: 'pt',
  0x0816: 'pt-PT',
  0x0446: 'pa',
  0x046B: 'qu-BO',
  0x086B: 'qu-EC',
  0x0C6B: 'qu',
  0x0418: 'ro',
  0x0417: 'rm',
  0x0419: 'ru',
  0x243B: 'smn',
  0x103B: 'smj-NO',
  0x143B: 'smj',
  0x0C3B: 'se-FI',
  0x043B: 'se',
  0x083B: 'se-SE',
  0x203B: 'sms',
  0x183B: 'sma-NO',
  0x1C3B: 'sms',
  0x044F: 'sa',
  0x1C1A: 'sr-Cyrl-BA',
  0x0C1A: 'sr',
  0x181A: 'sr-Latn-BA',
  0x081A: 'sr-Latn',
  0x046C: 'nso',
  0x0432: 'tn',
  0x045B: 'si',
  0x041B: 'sk',
  0x0424: 'sl',
  0x2C0A: 'es-AR',
  0x400A: 'es-BO',
  0x340A: 'es-CL',
  0x240A: 'es-CO',
  0x140A: 'es-CR',
  0x1C0A: 'es-DO',
  0x300A: 'es-EC',
  0x440A: 'es-SV',
  0x100A: 'es-GT',
  0x480A: 'es-HN',
  0x080A: 'es-MX',
  0x4C0A: 'es-NI',
  0x180A: 'es-PA',
  0x3C0A: 'es-PY',
  0x280A: 'es-PE',
  0x500A: 'es-PR',
  // Microsoft has defined two different language codes for
  // “Spanish with modern sorting” and “Spanish with traditional
  // sorting”. This makes sense for collation APIs, and it would be
  // possible to express this in BCP 47 language tags via Unicode
  // extensions (eg., es-u-co-trad is Spanish with traditional
  // sorting). However, for storing names in fonts, the distinction
  // does not make sense, so we give “es” in both cases.
  0x0C0A: 'es',
  0x040A: 'es',
  0x540A: 'es-US',
  0x380A: 'es-UY',
  0x200A: 'es-VE',
  0x081D: 'sv-FI',
  0x041D: 'sv',
  0x045A: 'syr',
  0x0428: 'tg',
  0x085F: 'tzm',
  0x0449: 'ta',
  0x0444: 'tt',
  0x044A: 'te',
  0x041E: 'th',
  0x0451: 'bo',
  0x041F: 'tr',
  0x0442: 'tk',
  0x0480: 'ug',
  0x0422: 'uk',
  0x042E: 'hsb',
  0x0420: 'ur',
  0x0843: 'uz-Cyrl',
  0x0443: 'uz',
  0x042A: 'vi',
  0x0452: 'cy',
  0x0488: 'wo',
  0x0485: 'sah',
  0x0478: 'ii',
  0x046A: 'yo'
}; // Returns a IETF BCP 47 language code, for example 'zh-Hant'
// for 'Chinese in the traditional script'.

function getLanguageCode(platformID, languageID, ltag) {
  switch (platformID) {
    case 0:
      // Unicode
      if (languageID === 0xFFFF) {
        return 'und';
      } else if (ltag) {
        return ltag[languageID];
      }

      break;

    case 1:
      // Macintosh
      return macLanguages[languageID];

    case 3:
      // Windows
      return windowsLanguages[languageID];
  }

  return undefined;
}

const utf16 = 'utf-16'; // MacOS script ID → encoding. This table stores the default case,
// which can be overridden by macLanguageEncodings.

const macScriptEncodings = {
  0: 'macintosh',
  // smRoman
  1: 'x-mac-japanese',
  // smJapanese
  2: 'x-mac-chinesetrad',
  // smTradChinese
  3: 'x-mac-korean',
  // smKorean
  6: 'x-mac-greek',
  // smGreek
  7: 'x-mac-cyrillic',
  // smCyrillic
  9: 'x-mac-devanagai',
  // smDevanagari
  10: 'x-mac-gurmukhi',
  // smGurmukhi
  11: 'x-mac-gujarati',
  // smGujarati
  12: 'x-mac-oriya',
  // smOriya
  13: 'x-mac-bengali',
  // smBengali
  14: 'x-mac-tamil',
  // smTamil
  15: 'x-mac-telugu',
  // smTelugu
  16: 'x-mac-kannada',
  // smKannada
  17: 'x-mac-malayalam',
  // smMalayalam
  18: 'x-mac-sinhalese',
  // smSinhalese
  19: 'x-mac-burmese',
  // smBurmese
  20: 'x-mac-khmer',
  // smKhmer
  21: 'x-mac-thai',
  // smThai
  22: 'x-mac-lao',
  // smLao
  23: 'x-mac-georgian',
  // smGeorgian
  24: 'x-mac-armenian',
  // smArmenian
  25: 'x-mac-chinesesimp',
  // smSimpChinese
  26: 'x-mac-tibetan',
  // smTibetan
  27: 'x-mac-mongolian',
  // smMongolian
  28: 'x-mac-ethiopic',
  // smEthiopic
  29: 'x-mac-ce',
  // smCentralEuroRoman
  30: 'x-mac-vietnamese',
  // smVietnamese
  31: 'x-mac-extarabic' // smExtArabic

}; // MacOS language ID → encoding. This table stores the exceptional
// cases, which override macScriptEncodings. For writing MacOS naming
// tables, we need to emit a MacOS script ID. Therefore, we cannot
// merge macScriptEncodings into macLanguageEncodings.
//
// http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/Readme.txt

const macLanguageEncodings = {
  15: 'x-mac-icelandic',
  // langIcelandic
  17: 'x-mac-turkish',
  // langTurkish
  18: 'x-mac-croatian',
  // langCroatian
  24: 'x-mac-ce',
  // langLithuanian
  25: 'x-mac-ce',
  // langPolish
  26: 'x-mac-ce',
  // langHungarian
  27: 'x-mac-ce',
  // langEstonian
  28: 'x-mac-ce',
  // langLatvian
  30: 'x-mac-icelandic',
  // langFaroese
  37: 'x-mac-romanian',
  // langRomanian
  38: 'x-mac-ce',
  // langCzech
  39: 'x-mac-ce',
  // langSlovak
  40: 'x-mac-ce',
  // langSlovenian
  143: 'x-mac-inuit',
  // langInuktitut
  146: 'x-mac-gaelic' // langIrishGaelicScript

};

function getEncoding(platformID, encodingID, languageID) {
  switch (platformID) {
    case 0:
      // Unicode
      return utf16;

    case 1:
      // Apple Macintosh
      return macLanguageEncodings[languageID] || macScriptEncodings[encodingID];

    case 3:
      // Microsoft Windows
      if (encodingID === 1 || encodingID === 10) {
        return utf16;
      }

      break;
  }

  return undefined;
} // Parse the naming `name` table.
// FIXME: Format 1 additional fields are not supported yet.
// ltag is the content of the `ltag' table, such as ['en', 'zh-Hans', 'de-CH-1904'].


function parseNameTable(data, start, ltag) {
  const name = {};
  const p = new _parse.default.Parser(data, start);
  const format = p.parseUShort();
  const count = p.parseUShort();
  const stringOffset = p.offset + p.parseUShort();

  for (let i = 0; i < count; i++) {
    const platformID = p.parseUShort();
    const encodingID = p.parseUShort();
    const languageID = p.parseUShort();
    const nameID = p.parseUShort();
    const property = nameTableNames[nameID] || nameID;
    const byteLength = p.parseUShort();
    const offset = p.parseUShort();
    const language = getLanguageCode(platformID, languageID, ltag);
    const encoding = getEncoding(platformID, encodingID, languageID);

    if (encoding !== undefined && language !== undefined) {
      let text;

      if (encoding === utf16) {
        text = _types.decode.UTF16(data, stringOffset + offset, byteLength);
      } else {
        text = _types.decode.MACSTRING(data, stringOffset + offset, byteLength, encoding);
      }

      if (text) {
        let translations = name[property];

        if (translations === undefined) {
          translations = name[property] = {};
        }

        translations[language] = text;
      }
    }
  }

  let langTagCount = 0;

  if (format === 1) {
    // FIXME: Also handle Microsoft's 'name' table 1.
    langTagCount = p.parseUShort();
  }

  return name;
} // {23: 'foo'} → {'foo': 23}
// ['bar', 'baz'] → {'bar': 0, 'baz': 1}


function reverseDict(dict) {
  const result = {};

  for (let key in dict) {
    result[dict[key]] = parseInt(key);
  }

  return result;
}

function makeNameRecord(platformID, encodingID, languageID, nameID, length, offset) {
  return new _table.default.Record('NameRecord', [{
    name: 'platformID',
    type: 'USHORT',
    value: platformID
  }, {
    name: 'encodingID',
    type: 'USHORT',
    value: encodingID
  }, {
    name: 'languageID',
    type: 'USHORT',
    value: languageID
  }, {
    name: 'nameID',
    type: 'USHORT',
    value: nameID
  }, {
    name: 'length',
    type: 'USHORT',
    value: length
  }, {
    name: 'offset',
    type: 'USHORT',
    value: offset
  }]);
} // Finds the position of needle in haystack, or -1 if not there.
// Like String.indexOf(), but for arrays.


function findSubArray(needle, haystack) {
  const needleLength = needle.length;
  const limit = haystack.length - needleLength + 1;

  loop: for (let pos = 0; pos < limit; pos++) {
    for (; pos < limit; pos++) {
      for (let k = 0; k < needleLength; k++) {
        if (haystack[pos + k] !== needle[k]) {
          continue loop;
        }
      }

      return pos;
    }
  }

  return -1;
}

function addStringToPool(s, pool) {
  let offset = findSubArray(s, pool);

  if (offset < 0) {
    offset = pool.length;
    let i = 0;
    const len = s.length;

    for (; i < len; ++i) {
      pool.push(s[i]);
    }
  }

  return offset;
}

function makeNameTable(names, ltag) {
  let nameID;
  const nameIDs = [];
  const namesWithNumericKeys = {};
  const nameTableIds = reverseDict(nameTableNames);

  for (let key in names) {
    let id = nameTableIds[key];

    if (id === undefined) {
      id = key;
    }

    nameID = parseInt(id);

    if (isNaN(nameID)) {
      throw new Error('Name table entry "' + key + '" does not exist, see nameTableNames for complete list.');
    }

    namesWithNumericKeys[nameID] = names[key];
    nameIDs.push(nameID);
  }

  const macLanguageIds = reverseDict(macLanguages);
  const windowsLanguageIds = reverseDict(windowsLanguages);
  const nameRecords = [];
  const stringPool = [];

  for (let i = 0; i < nameIDs.length; i++) {
    nameID = nameIDs[i];
    const translations = namesWithNumericKeys[nameID];

    for (let lang in translations) {
      const text = translations[lang]; // For MacOS, we try to emit the name in the form that was introduced
      // in the initial version of the TrueType spec (in the late 1980s).
      // However, this can fail for various reasons: the requested BCP 47
      // language code might not have an old-style Mac equivalent;
      // we might not have a codec for the needed character encoding;
      // or the name might contain characters that cannot be expressed
      // in the old-style Macintosh encoding. In case of failure, we emit
      // the name in a more modern fashion (Unicode encoding with BCP 47
      // language tags) that is recognized by MacOS 10.5, released in 2009.
      // If fonts were only read by operating systems, we could simply
      // emit all names in the modern form; this would be much easier.
      // However, there are many applications and libraries that read
      // 'name' tables directly, and these will usually only recognize
      // the ancient form (silently skipping the unrecognized names).

      let macPlatform = 1; // Macintosh

      let macLanguage = macLanguageIds[lang];
      let macScript = macLanguageToScript[macLanguage];
      const macEncoding = getEncoding(macPlatform, macScript, macLanguage);

      let macName = _types.encode.MACSTRING(text, macEncoding);

      if (macName === undefined) {
        macPlatform = 0; // Unicode

        macLanguage = ltag.indexOf(lang);

        if (macLanguage < 0) {
          macLanguage = ltag.length;
          ltag.push(lang);
        }

        macScript = 4; // Unicode 2.0 and later

        macName = _types.encode.UTF16(text);
      }

      const macNameOffset = addStringToPool(macName, stringPool);
      nameRecords.push(makeNameRecord(macPlatform, macScript, macLanguage, nameID, macName.length, macNameOffset));
      const winLanguage = windowsLanguageIds[lang];

      if (winLanguage !== undefined) {
        const winName = _types.encode.UTF16(text);

        const winNameOffset = addStringToPool(winName, stringPool);
        nameRecords.push(makeNameRecord(3, 1, winLanguage, nameID, winName.length, winNameOffset));
      }
    }
  }

  nameRecords.sort(function (a, b) {
    return a.platformID - b.platformID || a.encodingID - b.encodingID || a.languageID - b.languageID || a.nameID - b.nameID;
  });
  const t = new _table.default.Table('name', [{
    name: 'format',
    type: 'USHORT',
    value: 0
  }, {
    name: 'count',
    type: 'USHORT',
    value: nameRecords.length
  }, {
    name: 'stringOffset',
    type: 'USHORT',
    value: 6 + nameRecords.length * 12
  }]);

  for (let r = 0; r < nameRecords.length; r++) {
    t.fields.push({
      name: 'record_' + r,
      type: 'RECORD',
      value: nameRecords[r]
    });
  }

  t.fields.push({
    name: 'strings',
    type: 'LITERAL',
    value: stringPool
  });
  return t;
}

var _default = {
  parse: parseNameTable,
  make: makeNameTable
};
exports.default = _default;
},{"../types":"../node_modules/opentype.js/src/types.js","../parse":"../node_modules/opentype.js/src/parse.js","../table":"../node_modules/opentype.js/src/table.js"}],"../node_modules/opentype.js/src/tables/os2.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _parse = _interopRequireDefault(require("../parse"));

var _table = _interopRequireDefault(require("../table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The `OS/2` table contains metrics required in OpenType fonts.
// https://www.microsoft.com/typography/OTSPEC/os2.htm
const unicodeRanges = [{
  begin: 0x0000,
  end: 0x007F
}, // Basic Latin
{
  begin: 0x0080,
  end: 0x00FF
}, // Latin-1 Supplement
{
  begin: 0x0100,
  end: 0x017F
}, // Latin Extended-A
{
  begin: 0x0180,
  end: 0x024F
}, // Latin Extended-B
{
  begin: 0x0250,
  end: 0x02AF
}, // IPA Extensions
{
  begin: 0x02B0,
  end: 0x02FF
}, // Spacing Modifier Letters
{
  begin: 0x0300,
  end: 0x036F
}, // Combining Diacritical Marks
{
  begin: 0x0370,
  end: 0x03FF
}, // Greek and Coptic
{
  begin: 0x2C80,
  end: 0x2CFF
}, // Coptic
{
  begin: 0x0400,
  end: 0x04FF
}, // Cyrillic
{
  begin: 0x0530,
  end: 0x058F
}, // Armenian
{
  begin: 0x0590,
  end: 0x05FF
}, // Hebrew
{
  begin: 0xA500,
  end: 0xA63F
}, // Vai
{
  begin: 0x0600,
  end: 0x06FF
}, // Arabic
{
  begin: 0x07C0,
  end: 0x07FF
}, // NKo
{
  begin: 0x0900,
  end: 0x097F
}, // Devanagari
{
  begin: 0x0980,
  end: 0x09FF
}, // Bengali
{
  begin: 0x0A00,
  end: 0x0A7F
}, // Gurmukhi
{
  begin: 0x0A80,
  end: 0x0AFF
}, // Gujarati
{
  begin: 0x0B00,
  end: 0x0B7F
}, // Oriya
{
  begin: 0x0B80,
  end: 0x0BFF
}, // Tamil
{
  begin: 0x0C00,
  end: 0x0C7F
}, // Telugu
{
  begin: 0x0C80,
  end: 0x0CFF
}, // Kannada
{
  begin: 0x0D00,
  end: 0x0D7F
}, // Malayalam
{
  begin: 0x0E00,
  end: 0x0E7F
}, // Thai
{
  begin: 0x0E80,
  end: 0x0EFF
}, // Lao
{
  begin: 0x10A0,
  end: 0x10FF
}, // Georgian
{
  begin: 0x1B00,
  end: 0x1B7F
}, // Balinese
{
  begin: 0x1100,
  end: 0x11FF
}, // Hangul Jamo
{
  begin: 0x1E00,
  end: 0x1EFF
}, // Latin Extended Additional
{
  begin: 0x1F00,
  end: 0x1FFF
}, // Greek Extended
{
  begin: 0x2000,
  end: 0x206F
}, // General Punctuation
{
  begin: 0x2070,
  end: 0x209F
}, // Superscripts And Subscripts
{
  begin: 0x20A0,
  end: 0x20CF
}, // Currency Symbol
{
  begin: 0x20D0,
  end: 0x20FF
}, // Combining Diacritical Marks For Symbols
{
  begin: 0x2100,
  end: 0x214F
}, // Letterlike Symbols
{
  begin: 0x2150,
  end: 0x218F
}, // Number Forms
{
  begin: 0x2190,
  end: 0x21FF
}, // Arrows
{
  begin: 0x2200,
  end: 0x22FF
}, // Mathematical Operators
{
  begin: 0x2300,
  end: 0x23FF
}, // Miscellaneous Technical
{
  begin: 0x2400,
  end: 0x243F
}, // Control Pictures
{
  begin: 0x2440,
  end: 0x245F
}, // Optical Character Recognition
{
  begin: 0x2460,
  end: 0x24FF
}, // Enclosed Alphanumerics
{
  begin: 0x2500,
  end: 0x257F
}, // Box Drawing
{
  begin: 0x2580,
  end: 0x259F
}, // Block Elements
{
  begin: 0x25A0,
  end: 0x25FF
}, // Geometric Shapes
{
  begin: 0x2600,
  end: 0x26FF
}, // Miscellaneous Symbols
{
  begin: 0x2700,
  end: 0x27BF
}, // Dingbats
{
  begin: 0x3000,
  end: 0x303F
}, // CJK Symbols And Punctuation
{
  begin: 0x3040,
  end: 0x309F
}, // Hiragana
{
  begin: 0x30A0,
  end: 0x30FF
}, // Katakana
{
  begin: 0x3100,
  end: 0x312F
}, // Bopomofo
{
  begin: 0x3130,
  end: 0x318F
}, // Hangul Compatibility Jamo
{
  begin: 0xA840,
  end: 0xA87F
}, // Phags-pa
{
  begin: 0x3200,
  end: 0x32FF
}, // Enclosed CJK Letters And Months
{
  begin: 0x3300,
  end: 0x33FF
}, // CJK Compatibility
{
  begin: 0xAC00,
  end: 0xD7AF
}, // Hangul Syllables
{
  begin: 0xD800,
  end: 0xDFFF
}, // Non-Plane 0 *
{
  begin: 0x10900,
  end: 0x1091F
}, // Phoenicia
{
  begin: 0x4E00,
  end: 0x9FFF
}, // CJK Unified Ideographs
{
  begin: 0xE000,
  end: 0xF8FF
}, // Private Use Area (plane 0)
{
  begin: 0x31C0,
  end: 0x31EF
}, // CJK Strokes
{
  begin: 0xFB00,
  end: 0xFB4F
}, // Alphabetic Presentation Forms
{
  begin: 0xFB50,
  end: 0xFDFF
}, // Arabic Presentation Forms-A
{
  begin: 0xFE20,
  end: 0xFE2F
}, // Combining Half Marks
{
  begin: 0xFE10,
  end: 0xFE1F
}, // Vertical Forms
{
  begin: 0xFE50,
  end: 0xFE6F
}, // Small Form Variants
{
  begin: 0xFE70,
  end: 0xFEFF
}, // Arabic Presentation Forms-B
{
  begin: 0xFF00,
  end: 0xFFEF
}, // Halfwidth And Fullwidth Forms
{
  begin: 0xFFF0,
  end: 0xFFFF
}, // Specials
{
  begin: 0x0F00,
  end: 0x0FFF
}, // Tibetan
{
  begin: 0x0700,
  end: 0x074F
}, // Syriac
{
  begin: 0x0780,
  end: 0x07BF
}, // Thaana
{
  begin: 0x0D80,
  end: 0x0DFF
}, // Sinhala
{
  begin: 0x1000,
  end: 0x109F
}, // Myanmar
{
  begin: 0x1200,
  end: 0x137F
}, // Ethiopic
{
  begin: 0x13A0,
  end: 0x13FF
}, // Cherokee
{
  begin: 0x1400,
  end: 0x167F
}, // Unified Canadian Aboriginal Syllabics
{
  begin: 0x1680,
  end: 0x169F
}, // Ogham
{
  begin: 0x16A0,
  end: 0x16FF
}, // Runic
{
  begin: 0x1780,
  end: 0x17FF
}, // Khmer
{
  begin: 0x1800,
  end: 0x18AF
}, // Mongolian
{
  begin: 0x2800,
  end: 0x28FF
}, // Braille Patterns
{
  begin: 0xA000,
  end: 0xA48F
}, // Yi Syllables
{
  begin: 0x1700,
  end: 0x171F
}, // Tagalog
{
  begin: 0x10300,
  end: 0x1032F
}, // Old Italic
{
  begin: 0x10330,
  end: 0x1034F
}, // Gothic
{
  begin: 0x10400,
  end: 0x1044F
}, // Deseret
{
  begin: 0x1D000,
  end: 0x1D0FF
}, // Byzantine Musical Symbols
{
  begin: 0x1D400,
  end: 0x1D7FF
}, // Mathematical Alphanumeric Symbols
{
  begin: 0xFF000,
  end: 0xFFFFD
}, // Private Use (plane 15)
{
  begin: 0xFE00,
  end: 0xFE0F
}, // Variation Selectors
{
  begin: 0xE0000,
  end: 0xE007F
}, // Tags
{
  begin: 0x1900,
  end: 0x194F
}, // Limbu
{
  begin: 0x1950,
  end: 0x197F
}, // Tai Le
{
  begin: 0x1980,
  end: 0x19DF
}, // New Tai Lue
{
  begin: 0x1A00,
  end: 0x1A1F
}, // Buginese
{
  begin: 0x2C00,
  end: 0x2C5F
}, // Glagolitic
{
  begin: 0x2D30,
  end: 0x2D7F
}, // Tifinagh
{
  begin: 0x4DC0,
  end: 0x4DFF
}, // Yijing Hexagram Symbols
{
  begin: 0xA800,
  end: 0xA82F
}, // Syloti Nagri
{
  begin: 0x10000,
  end: 0x1007F
}, // Linear B Syllabary
{
  begin: 0x10140,
  end: 0x1018F
}, // Ancient Greek Numbers
{
  begin: 0x10380,
  end: 0x1039F
}, // Ugaritic
{
  begin: 0x103A0,
  end: 0x103DF
}, // Old Persian
{
  begin: 0x10450,
  end: 0x1047F
}, // Shavian
{
  begin: 0x10480,
  end: 0x104AF
}, // Osmanya
{
  begin: 0x10800,
  end: 0x1083F
}, // Cypriot Syllabary
{
  begin: 0x10A00,
  end: 0x10A5F
}, // Kharoshthi
{
  begin: 0x1D300,
  end: 0x1D35F
}, // Tai Xuan Jing Symbols
{
  begin: 0x12000,
  end: 0x123FF
}, // Cuneiform
{
  begin: 0x1D360,
  end: 0x1D37F
}, // Counting Rod Numerals
{
  begin: 0x1B80,
  end: 0x1BBF
}, // Sundanese
{
  begin: 0x1C00,
  end: 0x1C4F
}, // Lepcha
{
  begin: 0x1C50,
  end: 0x1C7F
}, // Ol Chiki
{
  begin: 0xA880,
  end: 0xA8DF
}, // Saurashtra
{
  begin: 0xA900,
  end: 0xA92F
}, // Kayah Li
{
  begin: 0xA930,
  end: 0xA95F
}, // Rejang
{
  begin: 0xAA00,
  end: 0xAA5F
}, // Cham
{
  begin: 0x10190,
  end: 0x101CF
}, // Ancient Symbols
{
  begin: 0x101D0,
  end: 0x101FF
}, // Phaistos Disc
{
  begin: 0x102A0,
  end: 0x102DF
}, // Carian
{
  begin: 0x1F030,
  end: 0x1F09F // Domino Tiles

}];

function getUnicodeRange(unicode) {
  for (let i = 0; i < unicodeRanges.length; i += 1) {
    const range = unicodeRanges[i];

    if (unicode >= range.begin && unicode < range.end) {
      return i;
    }
  }

  return -1;
} // Parse the OS/2 and Windows metrics `OS/2` table


function parseOS2Table(data, start) {
  const os2 = {};
  const p = new _parse.default.Parser(data, start);
  os2.version = p.parseUShort();
  os2.xAvgCharWidth = p.parseShort();
  os2.usWeightClass = p.parseUShort();
  os2.usWidthClass = p.parseUShort();
  os2.fsType = p.parseUShort();
  os2.ySubscriptXSize = p.parseShort();
  os2.ySubscriptYSize = p.parseShort();
  os2.ySubscriptXOffset = p.parseShort();
  os2.ySubscriptYOffset = p.parseShort();
  os2.ySuperscriptXSize = p.parseShort();
  os2.ySuperscriptYSize = p.parseShort();
  os2.ySuperscriptXOffset = p.parseShort();
  os2.ySuperscriptYOffset = p.parseShort();
  os2.yStrikeoutSize = p.parseShort();
  os2.yStrikeoutPosition = p.parseShort();
  os2.sFamilyClass = p.parseShort();
  os2.panose = [];

  for (let i = 0; i < 10; i++) {
    os2.panose[i] = p.parseByte();
  }

  os2.ulUnicodeRange1 = p.parseULong();
  os2.ulUnicodeRange2 = p.parseULong();
  os2.ulUnicodeRange3 = p.parseULong();
  os2.ulUnicodeRange4 = p.parseULong();
  os2.achVendID = String.fromCharCode(p.parseByte(), p.parseByte(), p.parseByte(), p.parseByte());
  os2.fsSelection = p.parseUShort();
  os2.usFirstCharIndex = p.parseUShort();
  os2.usLastCharIndex = p.parseUShort();
  os2.sTypoAscender = p.parseShort();
  os2.sTypoDescender = p.parseShort();
  os2.sTypoLineGap = p.parseShort();
  os2.usWinAscent = p.parseUShort();
  os2.usWinDescent = p.parseUShort();

  if (os2.version >= 1) {
    os2.ulCodePageRange1 = p.parseULong();
    os2.ulCodePageRange2 = p.parseULong();
  }

  if (os2.version >= 2) {
    os2.sxHeight = p.parseShort();
    os2.sCapHeight = p.parseShort();
    os2.usDefaultChar = p.parseUShort();
    os2.usBreakChar = p.parseUShort();
    os2.usMaxContent = p.parseUShort();
  }

  return os2;
}

function makeOS2Table(options) {
  return new _table.default.Table('OS/2', [{
    name: 'version',
    type: 'USHORT',
    value: 0x0003
  }, {
    name: 'xAvgCharWidth',
    type: 'SHORT',
    value: 0
  }, {
    name: 'usWeightClass',
    type: 'USHORT',
    value: 0
  }, {
    name: 'usWidthClass',
    type: 'USHORT',
    value: 0
  }, {
    name: 'fsType',
    type: 'USHORT',
    value: 0
  }, {
    name: 'ySubscriptXSize',
    type: 'SHORT',
    value: 650
  }, {
    name: 'ySubscriptYSize',
    type: 'SHORT',
    value: 699
  }, {
    name: 'ySubscriptXOffset',
    type: 'SHORT',
    value: 0
  }, {
    name: 'ySubscriptYOffset',
    type: 'SHORT',
    value: 140
  }, {
    name: 'ySuperscriptXSize',
    type: 'SHORT',
    value: 650
  }, {
    name: 'ySuperscriptYSize',
    type: 'SHORT',
    value: 699
  }, {
    name: 'ySuperscriptXOffset',
    type: 'SHORT',
    value: 0
  }, {
    name: 'ySuperscriptYOffset',
    type: 'SHORT',
    value: 479
  }, {
    name: 'yStrikeoutSize',
    type: 'SHORT',
    value: 49
  }, {
    name: 'yStrikeoutPosition',
    type: 'SHORT',
    value: 258
  }, {
    name: 'sFamilyClass',
    type: 'SHORT',
    value: 0
  }, {
    name: 'bFamilyType',
    type: 'BYTE',
    value: 0
  }, {
    name: 'bSerifStyle',
    type: 'BYTE',
    value: 0
  }, {
    name: 'bWeight',
    type: 'BYTE',
    value: 0
  }, {
    name: 'bProportion',
    type: 'BYTE',
    value: 0
  }, {
    name: 'bContrast',
    type: 'BYTE',
    value: 0
  }, {
    name: 'bStrokeVariation',
    type: 'BYTE',
    value: 0
  }, {
    name: 'bArmStyle',
    type: 'BYTE',
    value: 0
  }, {
    name: 'bLetterform',
    type: 'BYTE',
    value: 0
  }, {
    name: 'bMidline',
    type: 'BYTE',
    value: 0
  }, {
    name: 'bXHeight',
    type: 'BYTE',
    value: 0
  }, {
    name: 'ulUnicodeRange1',
    type: 'ULONG',
    value: 0
  }, {
    name: 'ulUnicodeRange2',
    type: 'ULONG',
    value: 0
  }, {
    name: 'ulUnicodeRange3',
    type: 'ULONG',
    value: 0
  }, {
    name: 'ulUnicodeRange4',
    type: 'ULONG',
    value: 0
  }, {
    name: 'achVendID',
    type: 'CHARARRAY',
    value: 'XXXX'
  }, {
    name: 'fsSelection',
    type: 'USHORT',
    value: 0
  }, {
    name: 'usFirstCharIndex',
    type: 'USHORT',
    value: 0
  }, {
    name: 'usLastCharIndex',
    type: 'USHORT',
    value: 0
  }, {
    name: 'sTypoAscender',
    type: 'SHORT',
    value: 0
  }, {
    name: 'sTypoDescender',
    type: 'SHORT',
    value: 0
  }, {
    name: 'sTypoLineGap',
    type: 'SHORT',
    value: 0
  }, {
    name: 'usWinAscent',
    type: 'USHORT',
    value: 0
  }, {
    name: 'usWinDescent',
    type: 'USHORT',
    value: 0
  }, {
    name: 'ulCodePageRange1',
    type: 'ULONG',
    value: 0
  }, {
    name: 'ulCodePageRange2',
    type: 'ULONG',
    value: 0
  }, {
    name: 'sxHeight',
    type: 'SHORT',
    value: 0
  }, {
    name: 'sCapHeight',
    type: 'SHORT',
    value: 0
  }, {
    name: 'usDefaultChar',
    type: 'USHORT',
    value: 0
  }, {
    name: 'usBreakChar',
    type: 'USHORT',
    value: 0
  }, {
    name: 'usMaxContext',
    type: 'USHORT',
    value: 0
  }], options);
}

var _default = {
  parse: parseOS2Table,
  make: makeOS2Table,
  unicodeRanges,
  getUnicodeRange
};
exports.default = _default;
},{"../parse":"../node_modules/opentype.js/src/parse.js","../table":"../node_modules/opentype.js/src/table.js"}],"../node_modules/opentype.js/src/tables/post.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _encoding = require("../encoding");

var _parse = _interopRequireDefault(require("../parse"));

var _table = _interopRequireDefault(require("../table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The `post` table stores additional PostScript information, such as glyph names.
// https://www.microsoft.com/typography/OTSPEC/post.htm
// Parse the PostScript `post` table
function parsePostTable(data, start) {
  const post = {};
  const p = new _parse.default.Parser(data, start);
  post.version = p.parseVersion();
  post.italicAngle = p.parseFixed();
  post.underlinePosition = p.parseShort();
  post.underlineThickness = p.parseShort();
  post.isFixedPitch = p.parseULong();
  post.minMemType42 = p.parseULong();
  post.maxMemType42 = p.parseULong();
  post.minMemType1 = p.parseULong();
  post.maxMemType1 = p.parseULong();

  switch (post.version) {
    case 1:
      post.names = _encoding.standardNames.slice();
      break;

    case 2:
      post.numberOfGlyphs = p.parseUShort();
      post.glyphNameIndex = new Array(post.numberOfGlyphs);

      for (let i = 0; i < post.numberOfGlyphs; i++) {
        post.glyphNameIndex[i] = p.parseUShort();
      }

      post.names = [];

      for (let i = 0; i < post.numberOfGlyphs; i++) {
        if (post.glyphNameIndex[i] >= _encoding.standardNames.length) {
          const nameLength = p.parseChar();
          post.names.push(p.parseString(nameLength));
        }
      }

      break;

    case 2.5:
      post.numberOfGlyphs = p.parseUShort();
      post.offset = new Array(post.numberOfGlyphs);

      for (let i = 0; i < post.numberOfGlyphs; i++) {
        post.offset[i] = p.parseChar();
      }

      break;
  }

  return post;
}

function makePostTable() {
  return new _table.default.Table('post', [{
    name: 'version',
    type: 'FIXED',
    value: 0x00030000
  }, {
    name: 'italicAngle',
    type: 'FIXED',
    value: 0
  }, {
    name: 'underlinePosition',
    type: 'FWORD',
    value: 0
  }, {
    name: 'underlineThickness',
    type: 'FWORD',
    value: 0
  }, {
    name: 'isFixedPitch',
    type: 'ULONG',
    value: 0
  }, {
    name: 'minMemType42',
    type: 'ULONG',
    value: 0
  }, {
    name: 'maxMemType42',
    type: 'ULONG',
    value: 0
  }, {
    name: 'minMemType1',
    type: 'ULONG',
    value: 0
  }, {
    name: 'maxMemType1',
    type: 'ULONG',
    value: 0
  }]);
}

var _default = {
  parse: parsePostTable,
  make: makePostTable
};
exports.default = _default;
},{"../encoding":"../node_modules/opentype.js/src/encoding.js","../parse":"../node_modules/opentype.js/src/parse.js","../table":"../node_modules/opentype.js/src/table.js"}],"../node_modules/opentype.js/src/tables/gsub.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _check = _interopRequireDefault(require("../check"));

var _parse = require("../parse");

var _table = _interopRequireDefault(require("../table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The `GSUB` table contains ligatures, among other things.
// https://www.microsoft.com/typography/OTSPEC/gsub.htm
const subtableParsers = new Array(9); // subtableParsers[0] is unused
// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#SS

subtableParsers[1] = function parseLookup1() {
  const start = this.offset + this.relativeOffset;
  const substFormat = this.parseUShort();

  if (substFormat === 1) {
    return {
      substFormat: 1,
      coverage: this.parsePointer(_parse.Parser.coverage),
      deltaGlyphId: this.parseUShort()
    };
  } else if (substFormat === 2) {
    return {
      substFormat: 2,
      coverage: this.parsePointer(_parse.Parser.coverage),
      substitute: this.parseOffset16List()
    };
  }

  _check.default.assert(false, '0x' + start.toString(16) + ': lookup type 1 format must be 1 or 2.');
}; // https://www.microsoft.com/typography/OTSPEC/GSUB.htm#MS


subtableParsers[2] = function parseLookup2() {
  const substFormat = this.parseUShort();

  _check.default.argument(substFormat === 1, 'GSUB Multiple Substitution Subtable identifier-format must be 1');

  return {
    substFormat: substFormat,
    coverage: this.parsePointer(_parse.Parser.coverage),
    sequences: this.parseListOfLists()
  };
}; // https://www.microsoft.com/typography/OTSPEC/GSUB.htm#AS


subtableParsers[3] = function parseLookup3() {
  const substFormat = this.parseUShort();

  _check.default.argument(substFormat === 1, 'GSUB Alternate Substitution Subtable identifier-format must be 1');

  return {
    substFormat: substFormat,
    coverage: this.parsePointer(_parse.Parser.coverage),
    alternateSets: this.parseListOfLists()
  };
}; // https://www.microsoft.com/typography/OTSPEC/GSUB.htm#LS


subtableParsers[4] = function parseLookup4() {
  const substFormat = this.parseUShort();

  _check.default.argument(substFormat === 1, 'GSUB ligature table identifier-format must be 1');

  return {
    substFormat: substFormat,
    coverage: this.parsePointer(_parse.Parser.coverage),
    ligatureSets: this.parseListOfLists(function () {
      return {
        ligGlyph: this.parseUShort(),
        components: this.parseUShortList(this.parseUShort() - 1)
      };
    })
  };
};

const lookupRecordDesc = {
  sequenceIndex: _parse.Parser.uShort,
  lookupListIndex: _parse.Parser.uShort
}; // https://www.microsoft.com/typography/OTSPEC/GSUB.htm#CSF

subtableParsers[5] = function parseLookup5() {
  const start = this.offset + this.relativeOffset;
  const substFormat = this.parseUShort();

  if (substFormat === 1) {
    return {
      substFormat: substFormat,
      coverage: this.parsePointer(_parse.Parser.coverage),
      ruleSets: this.parseListOfLists(function () {
        const glyphCount = this.parseUShort();
        const substCount = this.parseUShort();
        return {
          input: this.parseUShortList(glyphCount - 1),
          lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
        };
      })
    };
  } else if (substFormat === 2) {
    return {
      substFormat: substFormat,
      coverage: this.parsePointer(_parse.Parser.coverage),
      classDef: this.parsePointer(_parse.Parser.classDef),
      classSets: this.parseListOfLists(function () {
        const glyphCount = this.parseUShort();
        const substCount = this.parseUShort();
        return {
          classes: this.parseUShortList(glyphCount - 1),
          lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
        };
      })
    };
  } else if (substFormat === 3) {
    const glyphCount = this.parseUShort();
    const substCount = this.parseUShort();
    return {
      substFormat: substFormat,
      coverages: this.parseList(glyphCount, _parse.Parser.pointer(_parse.Parser.coverage)),
      lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
    };
  }

  _check.default.assert(false, '0x' + start.toString(16) + ': lookup type 5 format must be 1, 2 or 3.');
}; // https://www.microsoft.com/typography/OTSPEC/GSUB.htm#CC


subtableParsers[6] = function parseLookup6() {
  const start = this.offset + this.relativeOffset;
  const substFormat = this.parseUShort();

  if (substFormat === 1) {
    return {
      substFormat: 1,
      coverage: this.parsePointer(_parse.Parser.coverage),
      chainRuleSets: this.parseListOfLists(function () {
        return {
          backtrack: this.parseUShortList(),
          input: this.parseUShortList(this.parseShort() - 1),
          lookahead: this.parseUShortList(),
          lookupRecords: this.parseRecordList(lookupRecordDesc)
        };
      })
    };
  } else if (substFormat === 2) {
    return {
      substFormat: 2,
      coverage: this.parsePointer(_parse.Parser.coverage),
      backtrackClassDef: this.parsePointer(_parse.Parser.classDef),
      inputClassDef: this.parsePointer(_parse.Parser.classDef),
      lookaheadClassDef: this.parsePointer(_parse.Parser.classDef),
      chainClassSet: this.parseListOfLists(function () {
        return {
          backtrack: this.parseUShortList(),
          input: this.parseUShortList(this.parseShort() - 1),
          lookahead: this.parseUShortList(),
          lookupRecords: this.parseRecordList(lookupRecordDesc)
        };
      })
    };
  } else if (substFormat === 3) {
    return {
      substFormat: 3,
      backtrackCoverage: this.parseList(_parse.Parser.pointer(_parse.Parser.coverage)),
      inputCoverage: this.parseList(_parse.Parser.pointer(_parse.Parser.coverage)),
      lookaheadCoverage: this.parseList(_parse.Parser.pointer(_parse.Parser.coverage)),
      lookupRecords: this.parseRecordList(lookupRecordDesc)
    };
  }

  _check.default.assert(false, '0x' + start.toString(16) + ': lookup type 6 format must be 1, 2 or 3.');
}; // https://www.microsoft.com/typography/OTSPEC/GSUB.htm#ES


subtableParsers[7] = function parseLookup7() {
  // Extension Substitution subtable
  const substFormat = this.parseUShort();

  _check.default.argument(substFormat === 1, 'GSUB Extension Substitution subtable identifier-format must be 1');

  const extensionLookupType = this.parseUShort();
  const extensionParser = new _parse.Parser(this.data, this.offset + this.parseULong());
  return {
    substFormat: 1,
    lookupType: extensionLookupType,
    extension: subtableParsers[extensionLookupType].call(extensionParser)
  };
}; // https://www.microsoft.com/typography/OTSPEC/GSUB.htm#RCCS


subtableParsers[8] = function parseLookup8() {
  const substFormat = this.parseUShort();

  _check.default.argument(substFormat === 1, 'GSUB Reverse Chaining Contextual Single Substitution Subtable identifier-format must be 1');

  return {
    substFormat: substFormat,
    coverage: this.parsePointer(_parse.Parser.coverage),
    backtrackCoverage: this.parseList(_parse.Parser.pointer(_parse.Parser.coverage)),
    lookaheadCoverage: this.parseList(_parse.Parser.pointer(_parse.Parser.coverage)),
    substitutes: this.parseUShortList()
  };
}; // https://www.microsoft.com/typography/OTSPEC/gsub.htm


function parseGsubTable(data, start) {
  start = start || 0;
  const p = new _parse.Parser(data, start);
  const tableVersion = p.parseVersion(1);

  _check.default.argument(tableVersion === 1 || tableVersion === 1.1, 'Unsupported GSUB table version.');

  if (tableVersion === 1) {
    return {
      version: tableVersion,
      scripts: p.parseScriptList(),
      features: p.parseFeatureList(),
      lookups: p.parseLookupList(subtableParsers)
    };
  } else {
    return {
      version: tableVersion,
      scripts: p.parseScriptList(),
      features: p.parseFeatureList(),
      lookups: p.parseLookupList(subtableParsers),
      variations: p.parseFeatureVariationsList()
    };
  }
} // GSUB Writing //////////////////////////////////////////////


const subtableMakers = new Array(9);

subtableMakers[1] = function makeLookup1(subtable) {
  if (subtable.substFormat === 1) {
    return new _table.default.Table('substitutionTable', [{
      name: 'substFormat',
      type: 'USHORT',
      value: 1
    }, {
      name: 'coverage',
      type: 'TABLE',
      value: new _table.default.Coverage(subtable.coverage)
    }, {
      name: 'deltaGlyphID',
      type: 'USHORT',
      value: subtable.deltaGlyphId
    }]);
  } else {
    return new _table.default.Table('substitutionTable', [{
      name: 'substFormat',
      type: 'USHORT',
      value: 2
    }, {
      name: 'coverage',
      type: 'TABLE',
      value: new _table.default.Coverage(subtable.coverage)
    }].concat(_table.default.ushortList('substitute', subtable.substitute)));
  }

  _check.default.fail('Lookup type 1 substFormat must be 1 or 2.');
};

subtableMakers[3] = function makeLookup3(subtable) {
  _check.default.assert(subtable.substFormat === 1, 'Lookup type 3 substFormat must be 1.');

  return new _table.default.Table('substitutionTable', [{
    name: 'substFormat',
    type: 'USHORT',
    value: 1
  }, {
    name: 'coverage',
    type: 'TABLE',
    value: new _table.default.Coverage(subtable.coverage)
  }].concat(_table.default.tableList('altSet', subtable.alternateSets, function (alternateSet) {
    return new _table.default.Table('alternateSetTable', _table.default.ushortList('alternate', alternateSet));
  })));
};

subtableMakers[4] = function makeLookup4(subtable) {
  _check.default.assert(subtable.substFormat === 1, 'Lookup type 4 substFormat must be 1.');

  return new _table.default.Table('substitutionTable', [{
    name: 'substFormat',
    type: 'USHORT',
    value: 1
  }, {
    name: 'coverage',
    type: 'TABLE',
    value: new _table.default.Coverage(subtable.coverage)
  }].concat(_table.default.tableList('ligSet', subtable.ligatureSets, function (ligatureSet) {
    return new _table.default.Table('ligatureSetTable', _table.default.tableList('ligature', ligatureSet, function (ligature) {
      return new _table.default.Table('ligatureTable', [{
        name: 'ligGlyph',
        type: 'USHORT',
        value: ligature.ligGlyph
      }].concat(_table.default.ushortList('component', ligature.components, ligature.components.length + 1)));
    }));
  })));
};

function makeGsubTable(gsub) {
  return new _table.default.Table('GSUB', [{
    name: 'version',
    type: 'ULONG',
    value: 0x10000
  }, {
    name: 'scripts',
    type: 'TABLE',
    value: new _table.default.ScriptList(gsub.scripts)
  }, {
    name: 'features',
    type: 'TABLE',
    value: new _table.default.FeatureList(gsub.features)
  }, {
    name: 'lookups',
    type: 'TABLE',
    value: new _table.default.LookupList(gsub.lookups, subtableMakers)
  }]);
}

var _default = {
  parse: parseGsubTable,
  make: makeGsubTable
};
exports.default = _default;
},{"../check":"../node_modules/opentype.js/src/check.js","../parse":"../node_modules/opentype.js/src/parse.js","../table":"../node_modules/opentype.js/src/table.js"}],"../node_modules/opentype.js/src/tables/meta.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _check = _interopRequireDefault(require("../check"));

var _types = require("../types");

var _parse = _interopRequireDefault(require("../parse"));

var _table = _interopRequireDefault(require("../table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The `GPOS` table contains kerning pairs, among other things.
// https://www.microsoft.com/typography/OTSPEC/gpos.htm
// Parse the metadata `meta` table.
// https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6meta.html
function parseMetaTable(data, start) {
  const p = new _parse.default.Parser(data, start);
  const tableVersion = p.parseULong();

  _check.default.argument(tableVersion === 1, 'Unsupported META table version.');

  p.parseULong(); // flags - currently unused and set to 0

  p.parseULong(); // tableOffset

  const numDataMaps = p.parseULong();
  const tags = {};

  for (let i = 0; i < numDataMaps; i++) {
    const tag = p.parseTag();
    const dataOffset = p.parseULong();
    const dataLength = p.parseULong();

    const text = _types.decode.UTF8(data, start + dataOffset, dataLength);

    tags[tag] = text;
  }

  return tags;
}

function makeMetaTable(tags) {
  const numTags = Object.keys(tags).length;
  let stringPool = '';
  const stringPoolOffset = 16 + numTags * 12;
  const result = new _table.default.Table('meta', [{
    name: 'version',
    type: 'ULONG',
    value: 1
  }, {
    name: 'flags',
    type: 'ULONG',
    value: 0
  }, {
    name: 'offset',
    type: 'ULONG',
    value: stringPoolOffset
  }, {
    name: 'numTags',
    type: 'ULONG',
    value: numTags
  }]);

  for (let tag in tags) {
    const pos = stringPool.length;
    stringPool += tags[tag];
    result.fields.push({
      name: 'tag ' + tag,
      type: 'TAG',
      value: tag
    });
    result.fields.push({
      name: 'offset ' + tag,
      type: 'ULONG',
      value: stringPoolOffset + pos
    });
    result.fields.push({
      name: 'length ' + tag,
      type: 'ULONG',
      value: tags[tag].length
    });
  }

  result.fields.push({
    name: 'stringPool',
    type: 'CHARARRAY',
    value: stringPool
  });
  return result;
}

var _default = {
  parse: parseMetaTable,
  make: makeMetaTable
};
exports.default = _default;
},{"../check":"../node_modules/opentype.js/src/check.js","../types":"../node_modules/opentype.js/src/types.js","../parse":"../node_modules/opentype.js/src/parse.js","../table":"../node_modules/opentype.js/src/table.js"}],"../node_modules/opentype.js/src/tables/sfnt.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _check = _interopRequireDefault(require("../check"));

var _table = _interopRequireDefault(require("../table"));

var _cmap = _interopRequireDefault(require("./cmap"));

var _cff = _interopRequireDefault(require("./cff"));

var _head = _interopRequireDefault(require("./head"));

var _hhea = _interopRequireDefault(require("./hhea"));

var _hmtx = _interopRequireDefault(require("./hmtx"));

var _ltag = _interopRequireDefault(require("./ltag"));

var _maxp = _interopRequireDefault(require("./maxp"));

var _name2 = _interopRequireDefault(require("./name"));

var _os = _interopRequireDefault(require("./os2"));

var _post = _interopRequireDefault(require("./post"));

var _gsub = _interopRequireDefault(require("./gsub"));

var _meta = _interopRequireDefault(require("./meta"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The `sfnt` wrapper provides organization for the tables in the font.
// It is the top-level data structure in a font.
// https://www.microsoft.com/typography/OTSPEC/otff.htm
// Recommendations for creating OpenType Fonts:
// http://www.microsoft.com/typography/otspec140/recom.htm
function log2(v) {
  return Math.log(v) / Math.log(2) | 0;
}

function computeCheckSum(bytes) {
  while (bytes.length % 4 !== 0) {
    bytes.push(0);
  }

  let sum = 0;

  for (let i = 0; i < bytes.length; i += 4) {
    sum += (bytes[i] << 24) + (bytes[i + 1] << 16) + (bytes[i + 2] << 8) + bytes[i + 3];
  }

  sum %= Math.pow(2, 32);
  return sum;
}

function makeTableRecord(tag, checkSum, offset, length) {
  return new _table.default.Record('Table Record', [{
    name: 'tag',
    type: 'TAG',
    value: tag !== undefined ? tag : ''
  }, {
    name: 'checkSum',
    type: 'ULONG',
    value: checkSum !== undefined ? checkSum : 0
  }, {
    name: 'offset',
    type: 'ULONG',
    value: offset !== undefined ? offset : 0
  }, {
    name: 'length',
    type: 'ULONG',
    value: length !== undefined ? length : 0
  }]);
}

function makeSfntTable(tables) {
  const sfnt = new _table.default.Table('sfnt', [{
    name: 'version',
    type: 'TAG',
    value: 'OTTO'
  }, {
    name: 'numTables',
    type: 'USHORT',
    value: 0
  }, {
    name: 'searchRange',
    type: 'USHORT',
    value: 0
  }, {
    name: 'entrySelector',
    type: 'USHORT',
    value: 0
  }, {
    name: 'rangeShift',
    type: 'USHORT',
    value: 0
  }]);
  sfnt.tables = tables;
  sfnt.numTables = tables.length;
  const highestPowerOf2 = Math.pow(2, log2(sfnt.numTables));
  sfnt.searchRange = 16 * highestPowerOf2;
  sfnt.entrySelector = log2(highestPowerOf2);
  sfnt.rangeShift = sfnt.numTables * 16 - sfnt.searchRange;
  const recordFields = [];
  const tableFields = [];
  let offset = sfnt.sizeOf() + makeTableRecord().sizeOf() * sfnt.numTables;

  while (offset % 4 !== 0) {
    offset += 1;
    tableFields.push({
      name: 'padding',
      type: 'BYTE',
      value: 0
    });
  }

  for (let i = 0; i < tables.length; i += 1) {
    const t = tables[i];

    _check.default.argument(t.tableName.length === 4, 'Table name' + t.tableName + ' is invalid.');

    const tableLength = t.sizeOf();
    const tableRecord = makeTableRecord(t.tableName, computeCheckSum(t.encode()), offset, tableLength);
    recordFields.push({
      name: tableRecord.tag + ' Table Record',
      type: 'RECORD',
      value: tableRecord
    });
    tableFields.push({
      name: t.tableName + ' table',
      type: 'RECORD',
      value: t
    });
    offset += tableLength;

    _check.default.argument(!isNaN(offset), 'Something went wrong calculating the offset.');

    while (offset % 4 !== 0) {
      offset += 1;
      tableFields.push({
        name: 'padding',
        type: 'BYTE',
        value: 0
      });
    }
  } // Table records need to be sorted alphabetically.


  recordFields.sort(function (r1, r2) {
    if (r1.value.tag > r2.value.tag) {
      return 1;
    } else {
      return -1;
    }
  });
  sfnt.fields = sfnt.fields.concat(recordFields);
  sfnt.fields = sfnt.fields.concat(tableFields);
  return sfnt;
} // Get the metrics for a character. If the string has more than one character
// this function returns metrics for the first available character.
// You can provide optional fallback metrics if no characters are available.


function metricsForChar(font, chars, notFoundMetrics) {
  for (let i = 0; i < chars.length; i += 1) {
    const glyphIndex = font.charToGlyphIndex(chars[i]);

    if (glyphIndex > 0) {
      const glyph = font.glyphs.get(glyphIndex);
      return glyph.getMetrics();
    }
  }

  return notFoundMetrics;
}

function average(vs) {
  let sum = 0;

  for (let i = 0; i < vs.length; i += 1) {
    sum += vs[i];
  }

  return sum / vs.length;
} // Convert the font object to a SFNT data structure.
// This structure contains all the necessary tables and metadata to create a binary OTF file.


function fontToSfntTable(font) {
  const xMins = [];
  const yMins = [];
  const xMaxs = [];
  const yMaxs = [];
  const advanceWidths = [];
  const leftSideBearings = [];
  const rightSideBearings = [];
  let firstCharIndex;
  let lastCharIndex = 0;
  let ulUnicodeRange1 = 0;
  let ulUnicodeRange2 = 0;
  let ulUnicodeRange3 = 0;
  let ulUnicodeRange4 = 0;

  for (let i = 0; i < font.glyphs.length; i += 1) {
    const glyph = font.glyphs.get(i);
    const unicode = glyph.unicode | 0;

    if (isNaN(glyph.advanceWidth)) {
      throw new Error('Glyph ' + glyph.name + ' (' + i + '): advanceWidth is not a number.');
    }

    if (firstCharIndex > unicode || firstCharIndex === undefined) {
      // ignore .notdef char
      if (unicode > 0) {
        firstCharIndex = unicode;
      }
    }

    if (lastCharIndex < unicode) {
      lastCharIndex = unicode;
    }

    const position = _os.default.getUnicodeRange(unicode);

    if (position < 32) {
      ulUnicodeRange1 |= 1 << position;
    } else if (position < 64) {
      ulUnicodeRange2 |= 1 << position - 32;
    } else if (position < 96) {
      ulUnicodeRange3 |= 1 << position - 64;
    } else if (position < 123) {
      ulUnicodeRange4 |= 1 << position - 96;
    } else {
      throw new Error('Unicode ranges bits > 123 are reserved for internal usage');
    } // Skip non-important characters.


    if (glyph.name === '.notdef') continue;
    const metrics = glyph.getMetrics();
    xMins.push(metrics.xMin);
    yMins.push(metrics.yMin);
    xMaxs.push(metrics.xMax);
    yMaxs.push(metrics.yMax);
    leftSideBearings.push(metrics.leftSideBearing);
    rightSideBearings.push(metrics.rightSideBearing);
    advanceWidths.push(glyph.advanceWidth);
  }

  const globals = {
    xMin: Math.min.apply(null, xMins),
    yMin: Math.min.apply(null, yMins),
    xMax: Math.max.apply(null, xMaxs),
    yMax: Math.max.apply(null, yMaxs),
    advanceWidthMax: Math.max.apply(null, advanceWidths),
    advanceWidthAvg: average(advanceWidths),
    minLeftSideBearing: Math.min.apply(null, leftSideBearings),
    maxLeftSideBearing: Math.max.apply(null, leftSideBearings),
    minRightSideBearing: Math.min.apply(null, rightSideBearings)
  };
  globals.ascender = font.ascender;
  globals.descender = font.descender;

  const headTable = _head.default.make({
    flags: 3,
    // 00000011 (baseline for font at y=0; left sidebearing point at x=0)
    unitsPerEm: font.unitsPerEm,
    xMin: globals.xMin,
    yMin: globals.yMin,
    xMax: globals.xMax,
    yMax: globals.yMax,
    lowestRecPPEM: 3,
    createdTimestamp: font.createdTimestamp
  });

  const hheaTable = _hhea.default.make({
    ascender: globals.ascender,
    descender: globals.descender,
    advanceWidthMax: globals.advanceWidthMax,
    minLeftSideBearing: globals.minLeftSideBearing,
    minRightSideBearing: globals.minRightSideBearing,
    xMaxExtent: globals.maxLeftSideBearing + (globals.xMax - globals.xMin),
    numberOfHMetrics: font.glyphs.length
  });

  const maxpTable = _maxp.default.make(font.glyphs.length);

  const os2Table = _os.default.make({
    xAvgCharWidth: Math.round(globals.advanceWidthAvg),
    usWeightClass: font.tables.os2.usWeightClass,
    usWidthClass: font.tables.os2.usWidthClass,
    usFirstCharIndex: firstCharIndex,
    usLastCharIndex: lastCharIndex,
    ulUnicodeRange1: ulUnicodeRange1,
    ulUnicodeRange2: ulUnicodeRange2,
    ulUnicodeRange3: ulUnicodeRange3,
    ulUnicodeRange4: ulUnicodeRange4,
    fsSelection: font.tables.os2.fsSelection,
    // REGULAR
    // See http://typophile.com/node/13081 for more info on vertical metrics.
    // We get metrics for typical characters (such as "x" for xHeight).
    // We provide some fallback characters if characters are unavailable: their
    // ordering was chosen experimentally.
    sTypoAscender: globals.ascender,
    sTypoDescender: globals.descender,
    sTypoLineGap: 0,
    usWinAscent: globals.yMax,
    usWinDescent: Math.abs(globals.yMin),
    ulCodePageRange1: 1,
    // FIXME: hard-code Latin 1 support for now
    sxHeight: metricsForChar(font, 'xyvw', {
      yMax: Math.round(globals.ascender / 2)
    }).yMax,
    sCapHeight: metricsForChar(font, 'HIKLEFJMNTZBDPRAGOQSUVWXY', globals).yMax,
    usDefaultChar: font.hasChar(' ') ? 32 : 0,
    // Use space as the default character, if available.
    usBreakChar: font.hasChar(' ') ? 32 : 0 // Use space as the break character, if available.

  });

  const hmtxTable = _hmtx.default.make(font.glyphs);

  const cmapTable = _cmap.default.make(font.glyphs);

  const englishFamilyName = font.getEnglishName('fontFamily');
  const englishStyleName = font.getEnglishName('fontSubfamily');
  const englishFullName = englishFamilyName + ' ' + englishStyleName;
  let postScriptName = font.getEnglishName('postScriptName');

  if (!postScriptName) {
    postScriptName = englishFamilyName.replace(/\s/g, '') + '-' + englishStyleName;
  }

  const names = {};

  for (let n in font.names) {
    names[n] = font.names[n];
  }

  if (!names.uniqueID) {
    names.uniqueID = {
      en: font.getEnglishName('manufacturer') + ':' + englishFullName
    };
  }

  if (!names.postScriptName) {
    names.postScriptName = {
      en: postScriptName
    };
  }

  if (!names.preferredFamily) {
    names.preferredFamily = font.names.fontFamily;
  }

  if (!names.preferredSubfamily) {
    names.preferredSubfamily = font.names.fontSubfamily;
  }

  const languageTags = [];

  const nameTable = _name2.default.make(names, languageTags);

  const ltagTable = languageTags.length > 0 ? _ltag.default.make(languageTags) : undefined;

  const postTable = _post.default.make();

  const cffTable = _cff.default.make(font.glyphs, {
    version: font.getEnglishName('version'),
    fullName: englishFullName,
    familyName: englishFamilyName,
    weightName: englishStyleName,
    postScriptName: postScriptName,
    unitsPerEm: font.unitsPerEm,
    fontBBox: [0, globals.yMin, globals.ascender, globals.advanceWidthMax]
  });

  const metaTable = font.metas && Object.keys(font.metas).length > 0 ? _meta.default.make(font.metas) : undefined; // The order does not matter because makeSfntTable() will sort them.

  const tables = [headTable, hheaTable, maxpTable, os2Table, nameTable, cmapTable, postTable, cffTable, hmtxTable];

  if (ltagTable) {
    tables.push(ltagTable);
  } // Optional tables


  if (font.tables.gsub) {
    tables.push(_gsub.default.make(font.tables.gsub));
  }

  if (metaTable) {
    tables.push(metaTable);
  }

  const sfntTable = makeSfntTable(tables); // Compute the font's checkSum and store it in head.checkSumAdjustment.

  const bytes = sfntTable.encode();
  const checkSum = computeCheckSum(bytes);
  const tableFields = sfntTable.fields;
  let checkSumAdjusted = false;

  for (let i = 0; i < tableFields.length; i += 1) {
    if (tableFields[i].name === 'head table') {
      tableFields[i].value.checkSumAdjustment = 0xB1B0AFBA - checkSum;
      checkSumAdjusted = true;
      break;
    }
  }

  if (!checkSumAdjusted) {
    throw new Error('Could not find head table with checkSum to adjust.');
  }

  return sfntTable;
}

var _default = {
  make: makeSfntTable,
  fontToTable: fontToSfntTable,
  computeCheckSum
};
exports.default = _default;
},{"../check":"../node_modules/opentype.js/src/check.js","../table":"../node_modules/opentype.js/src/table.js","./cmap":"../node_modules/opentype.js/src/tables/cmap.js","./cff":"../node_modules/opentype.js/src/tables/cff.js","./head":"../node_modules/opentype.js/src/tables/head.js","./hhea":"../node_modules/opentype.js/src/tables/hhea.js","./hmtx":"../node_modules/opentype.js/src/tables/hmtx.js","./ltag":"../node_modules/opentype.js/src/tables/ltag.js","./maxp":"../node_modules/opentype.js/src/tables/maxp.js","./name":"../node_modules/opentype.js/src/tables/name.js","./os2":"../node_modules/opentype.js/src/tables/os2.js","./post":"../node_modules/opentype.js/src/tables/post.js","./gsub":"../node_modules/opentype.js/src/tables/gsub.js","./meta":"../node_modules/opentype.js/src/tables/meta.js"}],"../node_modules/opentype.js/src/layout.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _check = _interopRequireDefault(require("./check"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The Layout object is the prototype of Substitution objects, and provides
// utility methods to manipulate common layout tables (GPOS, GSUB, GDEF...)
function searchTag(arr, tag) {
  /* jshint bitwise: false */
  let imin = 0;
  let imax = arr.length - 1;

  while (imin <= imax) {
    const imid = imin + imax >>> 1;
    const val = arr[imid].tag;

    if (val === tag) {
      return imid;
    } else if (val < tag) {
      imin = imid + 1;
    } else {
      imax = imid - 1;
    }
  } // Not found: return -1-insertion point


  return -imin - 1;
}

function binSearch(arr, value) {
  /* jshint bitwise: false */
  let imin = 0;
  let imax = arr.length - 1;

  while (imin <= imax) {
    const imid = imin + imax >>> 1;
    const val = arr[imid];

    if (val === value) {
      return imid;
    } else if (val < value) {
      imin = imid + 1;
    } else {
      imax = imid - 1;
    }
  } // Not found: return -1-insertion point


  return -imin - 1;
} // binary search in a list of ranges (coverage, class definition)


function searchRange(ranges, value) {
  // jshint bitwise: false
  let range;
  let imin = 0;
  let imax = ranges.length - 1;

  while (imin <= imax) {
    const imid = imin + imax >>> 1;
    range = ranges[imid];
    const start = range.start;

    if (start === value) {
      return range;
    } else if (start < value) {
      imin = imid + 1;
    } else {
      imax = imid - 1;
    }
  }

  if (imin > 0) {
    range = ranges[imin - 1];
    if (value > range.end) return 0;
    return range;
  }
}
/**
 * @exports opentype.Layout
 * @class
 */


function Layout(font, tableName) {
  this.font = font;
  this.tableName = tableName;
}

Layout.prototype = {
  /**
   * Binary search an object by "tag" property
   * @instance
   * @function searchTag
   * @memberof opentype.Layout
   * @param  {Array} arr
   * @param  {string} tag
   * @return {number}
   */
  searchTag: searchTag,

  /**
   * Binary search in a list of numbers
   * @instance
   * @function binSearch
   * @memberof opentype.Layout
   * @param  {Array} arr
   * @param  {number} value
   * @return {number}
   */
  binSearch: binSearch,

  /**
   * Get or create the Layout table (GSUB, GPOS etc).
   * @param  {boolean} create - Whether to create a new one.
   * @return {Object} The GSUB or GPOS table.
   */
  getTable: function (create) {
    let layout = this.font.tables[this.tableName];

    if (!layout && create) {
      layout = this.font.tables[this.tableName] = this.createDefaultTable();
    }

    return layout;
  },

  /**
   * Returns all scripts in the substitution table.
   * @instance
   * @return {Array}
   */
  getScriptNames: function () {
    let layout = this.getTable();

    if (!layout) {
      return [];
    }

    return layout.scripts.map(function (script) {
      return script.tag;
    });
  },

  /**
   * Returns the best bet for a script name.
   * Returns 'DFLT' if it exists.
   * If not, returns 'latn' if it exists.
   * If neither exist, returns undefined.
   */
  getDefaultScriptName: function () {
    let layout = this.getTable();

    if (!layout) {
      return;
    }

    let hasLatn = false;

    for (let i = 0; i < layout.scripts.length; i++) {
      const name = layout.scripts[i].tag;
      if (name === 'DFLT') return name;
      if (name === 'latn') hasLatn = true;
    }

    if (hasLatn) return 'latn';
  },

  /**
   * Returns all LangSysRecords in the given script.
   * @instance
   * @param {string} [script='DFLT']
   * @param {boolean} create - forces the creation of this script table if it doesn't exist.
   * @return {Object} An object with tag and script properties.
   */
  getScriptTable: function (script, create) {
    const layout = this.getTable(create);

    if (layout) {
      script = script || 'DFLT';
      const scripts = layout.scripts;
      const pos = searchTag(layout.scripts, script);

      if (pos >= 0) {
        return scripts[pos].script;
      } else if (create) {
        const scr = {
          tag: script,
          script: {
            defaultLangSys: {
              reserved: 0,
              reqFeatureIndex: 0xffff,
              featureIndexes: []
            },
            langSysRecords: []
          }
        };
        scripts.splice(-1 - pos, 0, scr);
        return scr.script;
      }
    }
  },

  /**
   * Returns a language system table
   * @instance
   * @param {string} [script='DFLT']
   * @param {string} [language='dlft']
   * @param {boolean} create - forces the creation of this langSysTable if it doesn't exist.
   * @return {Object}
   */
  getLangSysTable: function (script, language, create) {
    const scriptTable = this.getScriptTable(script, create);

    if (scriptTable) {
      if (!language || language === 'dflt' || language === 'DFLT') {
        return scriptTable.defaultLangSys;
      }

      const pos = searchTag(scriptTable.langSysRecords, language);

      if (pos >= 0) {
        return scriptTable.langSysRecords[pos].langSys;
      } else if (create) {
        const langSysRecord = {
          tag: language,
          langSys: {
            reserved: 0,
            reqFeatureIndex: 0xffff,
            featureIndexes: []
          }
        };
        scriptTable.langSysRecords.splice(-1 - pos, 0, langSysRecord);
        return langSysRecord.langSys;
      }
    }
  },

  /**
   * Get a specific feature table.
   * @instance
   * @param {string} [script='DFLT']
   * @param {string} [language='dlft']
   * @param {string} feature - One of the codes listed at https://www.microsoft.com/typography/OTSPEC/featurelist.htm
   * @param {boolean} create - forces the creation of the feature table if it doesn't exist.
   * @return {Object}
   */
  getFeatureTable: function (script, language, feature, create) {
    const langSysTable = this.getLangSysTable(script, language, create);

    if (langSysTable) {
      let featureRecord;
      const featIndexes = langSysTable.featureIndexes;
      const allFeatures = this.font.tables[this.tableName].features; // The FeatureIndex array of indices is in arbitrary order,
      // even if allFeatures is sorted alphabetically by feature tag.

      for (let i = 0; i < featIndexes.length; i++) {
        featureRecord = allFeatures[featIndexes[i]];

        if (featureRecord.tag === feature) {
          return featureRecord.feature;
        }
      }

      if (create) {
        const index = allFeatures.length; // Automatic ordering of features would require to shift feature indexes in the script list.

        _check.default.assert(index === 0 || feature >= allFeatures[index - 1].tag, 'Features must be added in alphabetical order.');

        featureRecord = {
          tag: feature,
          feature: {
            params: 0,
            lookupListIndexes: []
          }
        };
        allFeatures.push(featureRecord);
        featIndexes.push(index);
        return featureRecord.feature;
      }
    }
  },

  /**
   * Get the lookup tables of a given type for a script/language/feature.
   * @instance
   * @param {string} [script='DFLT']
   * @param {string} [language='dlft']
   * @param {string} feature - 4-letter feature code
   * @param {number} lookupType - 1 to 9
   * @param {boolean} create - forces the creation of the lookup table if it doesn't exist, with no subtables.
   * @return {Object[]}
   */
  getLookupTables: function (script, language, feature, lookupType, create) {
    const featureTable = this.getFeatureTable(script, language, feature, create);
    const tables = [];

    if (featureTable) {
      let lookupTable;
      const lookupListIndexes = featureTable.lookupListIndexes;
      const allLookups = this.font.tables[this.tableName].lookups; // lookupListIndexes are in no particular order, so use naive search.

      for (let i = 0; i < lookupListIndexes.length; i++) {
        lookupTable = allLookups[lookupListIndexes[i]];

        if (lookupTable.lookupType === lookupType) {
          tables.push(lookupTable);
        }
      }

      if (tables.length === 0 && create) {
        lookupTable = {
          lookupType: lookupType,
          lookupFlag: 0,
          subtables: [],
          markFilteringSet: undefined
        };
        const index = allLookups.length;
        allLookups.push(lookupTable);
        lookupListIndexes.push(index);
        return [lookupTable];
      }
    }

    return tables;
  },

  /**
   * Find a glyph in a class definition table
   * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#class-definition-table
   * @param {object} classDefTable - an OpenType Layout class definition table
   * @param {number} glyphIndex - the index of the glyph to find
   * @returns {number} -1 if not found
   */
  getGlyphClass: function (classDefTable, glyphIndex) {
    switch (classDefTable.format) {
      case 1:
        if (classDefTable.startGlyph <= glyphIndex && glyphIndex < classDefTable.startGlyph + classDefTable.classes.length) {
          return classDefTable.classes[glyphIndex - classDefTable.startGlyph];
        }

        return 0;

      case 2:
        const range = searchRange(classDefTable.ranges, glyphIndex);
        return range ? range.classId : 0;
    }
  },

  /**
   * Find a glyph in a coverage table
   * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#coverage-table
   * @param {object} coverageTable - an OpenType Layout coverage table
   * @param {number} glyphIndex - the index of the glyph to find
   * @returns {number} -1 if not found
   */
  getCoverageIndex: function (coverageTable, glyphIndex) {
    switch (coverageTable.format) {
      case 1:
        const index = binSearch(coverageTable.glyphs, glyphIndex);
        return index >= 0 ? index : -1;

      case 2:
        const range = searchRange(coverageTable.ranges, glyphIndex);
        return range ? range.index + glyphIndex - range.start : -1;
    }
  },

  /**
   * Returns the list of glyph indexes of a coverage table.
   * Format 1: the list is stored raw
   * Format 2: compact list as range records.
   * @instance
   * @param  {Object} coverageTable
   * @return {Array}
   */
  expandCoverage: function (coverageTable) {
    if (coverageTable.format === 1) {
      return coverageTable.glyphs;
    } else {
      const glyphs = [];
      const ranges = coverageTable.ranges;

      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        const start = range.start;
        const end = range.end;

        for (let j = start; j <= end; j++) {
          glyphs.push(j);
        }
      }

      return glyphs;
    }
  }
};
var _default = Layout;
exports.default = _default;
},{"./check":"../node_modules/opentype.js/src/check.js"}],"../node_modules/opentype.js/src/position.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _layout = _interopRequireDefault(require("./layout"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The Position object provides utility methods to manipulate
// the GPOS position table.

/**
 * @exports opentype.Position
 * @class
 * @extends opentype.Layout
 * @param {opentype.Font}
 * @constructor
 */
function Position(font) {
  _layout.default.call(this, font, 'gpos');
}

Position.prototype = _layout.default.prototype;
/**
 * Init some data for faster and easier access later.
 */

Position.prototype.init = function () {
  const script = this.getDefaultScriptName();
  this.defaultKerningTables = this.getKerningTables(script);
};
/**
 * Find a glyph pair in a list of lookup tables of type 2 and retrieve the xAdvance kerning value.
 *
 * @param {integer} leftIndex - left glyph index
 * @param {integer} rightIndex - right glyph index
 * @returns {integer}
 */


Position.prototype.getKerningValue = function (kerningLookups, leftIndex, rightIndex) {
  for (let i = 0; i < kerningLookups.length; i++) {
    const subtables = kerningLookups[i].subtables;

    for (let j = 0; j < subtables.length; j++) {
      const subtable = subtables[j];
      const covIndex = this.getCoverageIndex(subtable.coverage, leftIndex);
      if (covIndex < 0) continue;

      switch (subtable.posFormat) {
        case 1:
          // Search Pair Adjustment Positioning Format 1
          let pairSet = subtable.pairSets[covIndex];

          for (let k = 0; k < pairSet.length; k++) {
            let pair = pairSet[k];

            if (pair.secondGlyph === rightIndex) {
              return pair.value1 && pair.value1.xAdvance || 0;
            }
          }

          break;
        // left glyph found, not right glyph - try next subtable

        case 2:
          // Search Pair Adjustment Positioning Format 2
          const class1 = this.getGlyphClass(subtable.classDef1, leftIndex);
          const class2 = this.getGlyphClass(subtable.classDef2, rightIndex);
          const pair = subtable.classRecords[class1][class2];
          return pair.value1 && pair.value1.xAdvance || 0;
      }
    }
  }

  return 0;
};
/**
 * List all kerning lookup tables.
 *
 * @param {string} [script='DFLT'] - use font.position.getDefaultScriptName() for a better default value
 * @param {string} [language='dflt']
 * @return {object[]} The list of kerning lookup tables (may be empty), or undefined if there is no GPOS table (and we should use the kern table)
 */


Position.prototype.getKerningTables = function (script, language) {
  if (this.font.tables.gpos) {
    return this.getLookupTables(script, language, 'kern', 2);
  }
};

var _default = Position;
exports.default = _default;
},{"./layout":"../node_modules/opentype.js/src/layout.js"}],"../node_modules/opentype.js/src/substitution.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _check = _interopRequireDefault(require("./check"));

var _layout = _interopRequireDefault(require("./layout"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The Substitution object provides utility methods to manipulate
// the GSUB substitution table.

/**
 * @exports opentype.Substitution
 * @class
 * @extends opentype.Layout
 * @param {opentype.Font}
 * @constructor
 */
function Substitution(font) {
  _layout.default.call(this, font, 'gsub');
} // Check if 2 arrays of primitives are equal.


function arraysEqual(ar1, ar2) {
  const n = ar1.length;

  if (n !== ar2.length) {
    return false;
  }

  for (let i = 0; i < n; i++) {
    if (ar1[i] !== ar2[i]) {
      return false;
    }
  }

  return true;
} // Find the first subtable of a lookup table in a particular format.


function getSubstFormat(lookupTable, format, defaultSubtable) {
  const subtables = lookupTable.subtables;

  for (let i = 0; i < subtables.length; i++) {
    const subtable = subtables[i];

    if (subtable.substFormat === format) {
      return subtable;
    }
  }

  if (defaultSubtable) {
    subtables.push(defaultSubtable);
    return defaultSubtable;
  }

  return undefined;
}

Substitution.prototype = _layout.default.prototype;
/**
 * Create a default GSUB table.
 * @return {Object} gsub - The GSUB table.
 */

Substitution.prototype.createDefaultTable = function () {
  // Generate a default empty GSUB table with just a DFLT script and dflt lang sys.
  return {
    version: 1,
    scripts: [{
      tag: 'DFLT',
      script: {
        defaultLangSys: {
          reserved: 0,
          reqFeatureIndex: 0xffff,
          featureIndexes: []
        },
        langSysRecords: []
      }
    }],
    features: [],
    lookups: []
  };
};
/**
 * List all single substitutions (lookup type 1) for a given script, language, and feature.
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @param {string} feature - 4-character feature name ('aalt', 'salt', 'ss01'...)
 * @return {Array} substitutions - The list of substitutions.
 */


Substitution.prototype.getSingle = function (feature, script, language) {
  const substitutions = [];
  const lookupTables = this.getLookupTables(script, language, feature, 1);

  for (let idx = 0; idx < lookupTables.length; idx++) {
    const subtables = lookupTables[idx].subtables;

    for (let i = 0; i < subtables.length; i++) {
      const subtable = subtables[i];
      const glyphs = this.expandCoverage(subtable.coverage);
      let j;

      if (subtable.substFormat === 1) {
        const delta = subtable.deltaGlyphId;

        for (j = 0; j < glyphs.length; j++) {
          const glyph = glyphs[j];
          substitutions.push({
            sub: glyph,
            by: glyph + delta
          });
        }
      } else {
        const substitute = subtable.substitute;

        for (j = 0; j < glyphs.length; j++) {
          substitutions.push({
            sub: glyphs[j],
            by: substitute[j]
          });
        }
      }
    }
  }

  return substitutions;
};
/**
 * List all alternates (lookup type 3) for a given script, language, and feature.
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @param {string} feature - 4-character feature name ('aalt', 'salt'...)
 * @return {Array} alternates - The list of alternates
 */


Substitution.prototype.getAlternates = function (feature, script, language) {
  const alternates = [];
  const lookupTables = this.getLookupTables(script, language, feature, 3);

  for (let idx = 0; idx < lookupTables.length; idx++) {
    const subtables = lookupTables[idx].subtables;

    for (let i = 0; i < subtables.length; i++) {
      const subtable = subtables[i];
      const glyphs = this.expandCoverage(subtable.coverage);
      const alternateSets = subtable.alternateSets;

      for (let j = 0; j < glyphs.length; j++) {
        alternates.push({
          sub: glyphs[j],
          by: alternateSets[j]
        });
      }
    }
  }

  return alternates;
};
/**
 * List all ligatures (lookup type 4) for a given script, language, and feature.
 * The result is an array of ligature objects like { sub: [ids], by: id }
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @return {Array} ligatures - The list of ligatures.
 */


Substitution.prototype.getLigatures = function (feature, script, language) {
  const ligatures = [];
  const lookupTables = this.getLookupTables(script, language, feature, 4);

  for (let idx = 0; idx < lookupTables.length; idx++) {
    const subtables = lookupTables[idx].subtables;

    for (let i = 0; i < subtables.length; i++) {
      const subtable = subtables[i];
      const glyphs = this.expandCoverage(subtable.coverage);
      const ligatureSets = subtable.ligatureSets;

      for (let j = 0; j < glyphs.length; j++) {
        const startGlyph = glyphs[j];
        const ligSet = ligatureSets[j];

        for (let k = 0; k < ligSet.length; k++) {
          const lig = ligSet[k];
          ligatures.push({
            sub: [startGlyph].concat(lig.components),
            by: lig.ligGlyph
          });
        }
      }
    }
  }

  return ligatures;
};
/**
 * Add or modify a single substitution (lookup type 1)
 * Format 2, more flexible, is always used.
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {Object} substitution - { sub: id, delta: number } for format 1 or { sub: id, by: id } for format 2.
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */


Substitution.prototype.addSingle = function (feature, substitution, script, language) {
  const lookupTable = this.getLookupTables(script, language, feature, 1, true)[0];
  const subtable = getSubstFormat(lookupTable, 2, {
    // lookup type 1 subtable, format 2, coverage format 1
    substFormat: 2,
    coverage: {
      format: 1,
      glyphs: []
    },
    substitute: []
  });

  _check.default.assert(subtable.coverage.format === 1, 'Ligature: unable to modify coverage table format ' + subtable.coverage.format);

  const coverageGlyph = substitution.sub;
  let pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);

  if (pos < 0) {
    pos = -1 - pos;
    subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
    subtable.substitute.splice(pos, 0, 0);
  }

  subtable.substitute[pos] = substitution.by;
};
/**
 * Add or modify an alternate substitution (lookup type 1)
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {Object} substitution - { sub: id, by: [ids] }
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */


Substitution.prototype.addAlternate = function (feature, substitution, script, language) {
  const lookupTable = this.getLookupTables(script, language, feature, 3, true)[0];
  const subtable = getSubstFormat(lookupTable, 1, {
    // lookup type 3 subtable, format 1, coverage format 1
    substFormat: 1,
    coverage: {
      format: 1,
      glyphs: []
    },
    alternateSets: []
  });

  _check.default.assert(subtable.coverage.format === 1, 'Ligature: unable to modify coverage table format ' + subtable.coverage.format);

  const coverageGlyph = substitution.sub;
  let pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);

  if (pos < 0) {
    pos = -1 - pos;
    subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
    subtable.alternateSets.splice(pos, 0, 0);
  }

  subtable.alternateSets[pos] = substitution.by;
};
/**
 * Add a ligature (lookup type 4)
 * Ligatures with more components must be stored ahead of those with fewer components in order to be found
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {Object} ligature - { sub: [ids], by: id }
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */


Substitution.prototype.addLigature = function (feature, ligature, script, language) {
  const lookupTable = this.getLookupTables(script, language, feature, 4, true)[0];
  let subtable = lookupTable.subtables[0];

  if (!subtable) {
    subtable = {
      // lookup type 4 subtable, format 1, coverage format 1
      substFormat: 1,
      coverage: {
        format: 1,
        glyphs: []
      },
      ligatureSets: []
    };
    lookupTable.subtables[0] = subtable;
  }

  _check.default.assert(subtable.coverage.format === 1, 'Ligature: unable to modify coverage table format ' + subtable.coverage.format);

  const coverageGlyph = ligature.sub[0];
  const ligComponents = ligature.sub.slice(1);
  const ligatureTable = {
    ligGlyph: ligature.by,
    components: ligComponents
  };
  let pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);

  if (pos >= 0) {
    // ligatureSet already exists
    const ligatureSet = subtable.ligatureSets[pos];

    for (let i = 0; i < ligatureSet.length; i++) {
      // If ligature already exists, return.
      if (arraysEqual(ligatureSet[i].components, ligComponents)) {
        return;
      }
    } // ligature does not exist: add it.


    ligatureSet.push(ligatureTable);
  } else {
    // Create a new ligatureSet and add coverage for the first glyph.
    pos = -1 - pos;
    subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
    subtable.ligatureSets.splice(pos, 0, [ligatureTable]);
  }
};
/**
 * List all feature data for a given script and language.
 * @param {string} feature - 4-letter feature name
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @return {Array} substitutions - The list of substitutions.
 */


Substitution.prototype.getFeature = function (feature, script, language) {
  if (/ss\d\d/.test(feature)) {
    // ss01 - ss20
    return this.getSingle(feature, script, language);
  }

  switch (feature) {
    case 'aalt':
    case 'salt':
      return this.getSingle(feature, script, language).concat(this.getAlternates(feature, script, language));

    case 'dlig':
    case 'liga':
    case 'rlig':
      return this.getLigatures(feature, script, language);
  }

  return undefined;
};
/**
 * Add a substitution to a feature for a given script and language.
 * @param {string} feature - 4-letter feature name
 * @param {Object} sub - the substitution to add (an object like { sub: id or [ids], by: id or [ids] })
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */


Substitution.prototype.add = function (feature, sub, script, language) {
  if (/ss\d\d/.test(feature)) {
    // ss01 - ss20
    return this.addSingle(feature, sub, script, language);
  }

  switch (feature) {
    case 'aalt':
    case 'salt':
      if (typeof sub.by === 'number') {
        return this.addSingle(feature, sub, script, language);
      }

      return this.addAlternate(feature, sub, script, language);

    case 'dlig':
    case 'liga':
    case 'rlig':
      return this.addLigature(feature, sub, script, language);
  }

  return undefined;
};

var _default = Substitution;
exports.default = _default;
},{"./check":"../node_modules/opentype.js/src/check.js","./layout":"../node_modules/opentype.js/src/layout.js"}],"../node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"../node_modules/ieee754/index.js":[function(require,module,exports) {
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"../node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"../node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"../node_modules/base64-js/index.js","ieee754":"../node_modules/ieee754/index.js","isarray":"../node_modules/isarray/index.js","buffer":"../node_modules/buffer/index.js"}],"../node_modules/opentype.js/src/util.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isBrowser = isBrowser;
exports.isNode = isNode;
exports.nodeBufferToArrayBuffer = nodeBufferToArrayBuffer;
exports.arrayBufferToNodeBuffer = arrayBufferToNodeBuffer;
exports.checkArgument = checkArgument;

function isBrowser() {
  return typeof window !== 'undefined';
}

function isNode() {
  return typeof window === 'undefined';
}

function nodeBufferToArrayBuffer(buffer) {
  const ab = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(ab);

  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }

  return ab;
}

function arrayBufferToNodeBuffer(ab) {
  const buffer = new Buffer(ab.byteLength);
  const view = new Uint8Array(ab);

  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }

  return buffer;
}

function checkArgument(expression, message) {
  if (!expression) {
    throw message;
  }
}
},{"buffer":"../node_modules/buffer/index.js"}],"../node_modules/opentype.js/src/tables/glyf.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _check = _interopRequireDefault(require("../check"));

var _glyphset = _interopRequireDefault(require("../glyphset"));

var _parse = _interopRequireDefault(require("../parse"));

var _path = _interopRequireDefault(require("../path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The `glyf` table describes the glyphs in TrueType outline format.
// http://www.microsoft.com/typography/otspec/glyf.htm
// Parse the coordinate data for a glyph.
function parseGlyphCoordinate(p, flag, previousValue, shortVectorBitMask, sameBitMask) {
  let v;

  if ((flag & shortVectorBitMask) > 0) {
    // The coordinate is 1 byte long.
    v = p.parseByte(); // The `same` bit is re-used for short values to signify the sign of the value.

    if ((flag & sameBitMask) === 0) {
      v = -v;
    }

    v = previousValue + v;
  } else {
    //  The coordinate is 2 bytes long.
    // If the `same` bit is set, the coordinate is the same as the previous coordinate.
    if ((flag & sameBitMask) > 0) {
      v = previousValue;
    } else {
      // Parse the coordinate as a signed 16-bit delta value.
      v = previousValue + p.parseShort();
    }
  }

  return v;
} // Parse a TrueType glyph.


function parseGlyph(glyph, data, start) {
  const p = new _parse.default.Parser(data, start);
  glyph.numberOfContours = p.parseShort();
  glyph._xMin = p.parseShort();
  glyph._yMin = p.parseShort();
  glyph._xMax = p.parseShort();
  glyph._yMax = p.parseShort();
  let flags;
  let flag;

  if (glyph.numberOfContours > 0) {
    // This glyph is not a composite.
    const endPointIndices = glyph.endPointIndices = [];

    for (let i = 0; i < glyph.numberOfContours; i += 1) {
      endPointIndices.push(p.parseUShort());
    }

    glyph.instructionLength = p.parseUShort();
    glyph.instructions = [];

    for (let i = 0; i < glyph.instructionLength; i += 1) {
      glyph.instructions.push(p.parseByte());
    }

    const numberOfCoordinates = endPointIndices[endPointIndices.length - 1] + 1;
    flags = [];

    for (let i = 0; i < numberOfCoordinates; i += 1) {
      flag = p.parseByte();
      flags.push(flag); // If bit 3 is set, we repeat this flag n times, where n is the next byte.

      if ((flag & 8) > 0) {
        const repeatCount = p.parseByte();

        for (let j = 0; j < repeatCount; j += 1) {
          flags.push(flag);
          i += 1;
        }
      }
    }

    _check.default.argument(flags.length === numberOfCoordinates, 'Bad flags.');

    if (endPointIndices.length > 0) {
      const points = [];
      let point; // X/Y coordinates are relative to the previous point, except for the first point which is relative to 0,0.

      if (numberOfCoordinates > 0) {
        for (let i = 0; i < numberOfCoordinates; i += 1) {
          flag = flags[i];
          point = {};
          point.onCurve = !!(flag & 1);
          point.lastPointOfContour = endPointIndices.indexOf(i) >= 0;
          points.push(point);
        }

        let px = 0;

        for (let i = 0; i < numberOfCoordinates; i += 1) {
          flag = flags[i];
          point = points[i];
          point.x = parseGlyphCoordinate(p, flag, px, 2, 16);
          px = point.x;
        }

        let py = 0;

        for (let i = 0; i < numberOfCoordinates; i += 1) {
          flag = flags[i];
          point = points[i];
          point.y = parseGlyphCoordinate(p, flag, py, 4, 32);
          py = point.y;
        }
      }

      glyph.points = points;
    } else {
      glyph.points = [];
    }
  } else if (glyph.numberOfContours === 0) {
    glyph.points = [];
  } else {
    glyph.isComposite = true;
    glyph.points = [];
    glyph.components = [];
    let moreComponents = true;

    while (moreComponents) {
      flags = p.parseUShort();
      const component = {
        glyphIndex: p.parseUShort(),
        xScale: 1,
        scale01: 0,
        scale10: 0,
        yScale: 1,
        dx: 0,
        dy: 0
      };

      if ((flags & 1) > 0) {
        // The arguments are words
        if ((flags & 2) > 0) {
          // values are offset
          component.dx = p.parseShort();
          component.dy = p.parseShort();
        } else {
          // values are matched points
          component.matchedPoints = [p.parseUShort(), p.parseUShort()];
        }
      } else {
        // The arguments are bytes
        if ((flags & 2) > 0) {
          // values are offset
          component.dx = p.parseChar();
          component.dy = p.parseChar();
        } else {
          // values are matched points
          component.matchedPoints = [p.parseByte(), p.parseByte()];
        }
      }

      if ((flags & 8) > 0) {
        // We have a scale
        component.xScale = component.yScale = p.parseF2Dot14();
      } else if ((flags & 64) > 0) {
        // We have an X / Y scale
        component.xScale = p.parseF2Dot14();
        component.yScale = p.parseF2Dot14();
      } else if ((flags & 128) > 0) {
        // We have a 2x2 transformation
        component.xScale = p.parseF2Dot14();
        component.scale01 = p.parseF2Dot14();
        component.scale10 = p.parseF2Dot14();
        component.yScale = p.parseF2Dot14();
      }

      glyph.components.push(component);
      moreComponents = !!(flags & 32);
    }

    if (flags & 0x100) {
      // We have instructions
      glyph.instructionLength = p.parseUShort();
      glyph.instructions = [];

      for (let i = 0; i < glyph.instructionLength; i += 1) {
        glyph.instructions.push(p.parseByte());
      }
    }
  }
} // Transform an array of points and return a new array.


function transformPoints(points, transform) {
  const newPoints = [];

  for (let i = 0; i < points.length; i += 1) {
    const pt = points[i];
    const newPt = {
      x: transform.xScale * pt.x + transform.scale01 * pt.y + transform.dx,
      y: transform.scale10 * pt.x + transform.yScale * pt.y + transform.dy,
      onCurve: pt.onCurve,
      lastPointOfContour: pt.lastPointOfContour
    };
    newPoints.push(newPt);
  }

  return newPoints;
}

function getContours(points) {
  const contours = [];
  let currentContour = [];

  for (let i = 0; i < points.length; i += 1) {
    const pt = points[i];
    currentContour.push(pt);

    if (pt.lastPointOfContour) {
      contours.push(currentContour);
      currentContour = [];
    }
  }

  _check.default.argument(currentContour.length === 0, 'There are still points left in the current contour.');

  return contours;
} // Convert the TrueType glyph outline to a Path.


function getPath(points) {
  const p = new _path.default();

  if (!points) {
    return p;
  }

  const contours = getContours(points);

  for (let contourIndex = 0; contourIndex < contours.length; ++contourIndex) {
    const contour = contours[contourIndex];
    let prev = null;
    let curr = contour[contour.length - 1];
    let next = contour[0];

    if (curr.onCurve) {
      p.moveTo(curr.x, curr.y);
    } else {
      if (next.onCurve) {
        p.moveTo(next.x, next.y);
      } else {
        // If both first and last points are off-curve, start at their middle.
        const start = {
          x: (curr.x + next.x) * 0.5,
          y: (curr.y + next.y) * 0.5
        };
        p.moveTo(start.x, start.y);
      }
    }

    for (let i = 0; i < contour.length; ++i) {
      prev = curr;
      curr = next;
      next = contour[(i + 1) % contour.length];

      if (curr.onCurve) {
        // This is a straight line.
        p.lineTo(curr.x, curr.y);
      } else {
        let prev2 = prev;
        let next2 = next;

        if (!prev.onCurve) {
          prev2 = {
            x: (curr.x + prev.x) * 0.5,
            y: (curr.y + prev.y) * 0.5
          };
        }

        if (!next.onCurve) {
          next2 = {
            x: (curr.x + next.x) * 0.5,
            y: (curr.y + next.y) * 0.5
          };
        }

        p.quadraticCurveTo(curr.x, curr.y, next2.x, next2.y);
      }
    }

    p.closePath();
  }

  return p;
}

function buildPath(glyphs, glyph) {
  if (glyph.isComposite) {
    for (let j = 0; j < glyph.components.length; j += 1) {
      const component = glyph.components[j];
      const componentGlyph = glyphs.get(component.glyphIndex); // Force the ttfGlyphLoader to parse the glyph.

      componentGlyph.getPath();

      if (componentGlyph.points) {
        let transformedPoints;

        if (component.matchedPoints === undefined) {
          // component positioned by offset
          transformedPoints = transformPoints(componentGlyph.points, component);
        } else {
          // component positioned by matched points
          if (component.matchedPoints[0] > glyph.points.length - 1 || component.matchedPoints[1] > componentGlyph.points.length - 1) {
            throw Error('Matched points out of range in ' + glyph.name);
          }

          const firstPt = glyph.points[component.matchedPoints[0]];
          let secondPt = componentGlyph.points[component.matchedPoints[1]];
          const transform = {
            xScale: component.xScale,
            scale01: component.scale01,
            scale10: component.scale10,
            yScale: component.yScale,
            dx: 0,
            dy: 0
          };
          secondPt = transformPoints([secondPt], transform)[0];
          transform.dx = firstPt.x - secondPt.x;
          transform.dy = firstPt.y - secondPt.y;
          transformedPoints = transformPoints(componentGlyph.points, transform);
        }

        glyph.points = glyph.points.concat(transformedPoints);
      }
    }
  }

  return getPath(glyph.points);
}

function parseGlyfTableAll(data, start, loca, font) {
  const glyphs = new _glyphset.default.GlyphSet(font); // The last element of the loca table is invalid.

  for (let i = 0; i < loca.length - 1; i += 1) {
    const offset = loca[i];
    const nextOffset = loca[i + 1];

    if (offset !== nextOffset) {
      glyphs.push(i, _glyphset.default.ttfGlyphLoader(font, i, parseGlyph, data, start + offset, buildPath));
    } else {
      glyphs.push(i, _glyphset.default.glyphLoader(font, i));
    }
  }

  return glyphs;
}

function parseGlyfTableOnLowMemory(data, start, loca, font) {
  const glyphs = new _glyphset.default.GlyphSet(font);

  font._push = function (i) {
    const offset = loca[i];
    const nextOffset = loca[i + 1];

    if (offset !== nextOffset) {
      glyphs.push(i, _glyphset.default.ttfGlyphLoader(font, i, parseGlyph, data, start + offset, buildPath));
    } else {
      glyphs.push(i, _glyphset.default.glyphLoader(font, i));
    }
  };

  return glyphs;
} // Parse all the glyphs according to the offsets from the `loca` table.


function parseGlyfTable(data, start, loca, font, opt) {
  if (opt.lowMemory) return parseGlyfTableOnLowMemory(data, start, loca, font);else return parseGlyfTableAll(data, start, loca, font);
}

var _default = {
  getPath,
  parse: parseGlyfTable
};
exports.default = _default;
},{"../check":"../node_modules/opentype.js/src/check.js","../glyphset":"../node_modules/opentype.js/src/glyphset.js","../parse":"../node_modules/opentype.js/src/parse.js","../path":"../node_modules/opentype.js/src/path.js"}],"../node_modules/opentype.js/src/hintingtt.js":[function(require,module,exports) {
/* A TrueType font hinting interpreter.
*
* (c) 2017 Axel Kittenberger
*
* This interpreter has been implemented according to this documentation:
* https://developer.apple.com/fonts/TrueType-Reference-Manual/RM05/Chap5.html
*
* According to the documentation F24DOT6 values are used for pixels.
* That means calculation is 1/64 pixel accurate and uses integer operations.
* However, Javascript has floating point operations by default and only
* those are available. One could make a case to simulate the 1/64 accuracy
* exactly by truncating after every division operation
* (for example with << 0) to get pixel exactly results as other TrueType
* implementations. It may make sense since some fonts are pixel optimized
* by hand using DELTAP instructions. The current implementation doesn't
* and rather uses full floating point precision.
*
* xScale, yScale and rotation is currently ignored.
*
* A few non-trivial instructions are missing as I didn't encounter yet
* a font that used them to test a possible implementation.
*
* Some fonts seem to use undocumented features regarding the twilight zone.
* Only some of them are implemented as they were encountered.
*
* The exports.DEBUG statements are removed on the minified distribution file.
*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _glyf = _interopRequireDefault(require("./tables/glyf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let instructionTable;
let exec;
let execGlyph;
let execComponent;
/*
* Creates a hinting object.
*
* There ought to be exactly one
* for each truetype font that is used for hinting.
*/

function Hinting(font) {
  // the font this hinting object is for
  this.font = font;

  this.getCommands = function (hPoints) {
    return _glyf.default.getPath(hPoints).commands;
  }; // cached states


  this._fpgmState = this._prepState = undefined; // errorState
  // 0 ... all okay
  // 1 ... had an error in a glyf,
  //       continue working but stop spamming
  //       the console
  // 2 ... error at prep, stop hinting at this ppem
  // 3 ... error at fpeg, stop hinting for this font at all

  this._errorState = 0;
}
/*
* Not rounding.
*/


function roundOff(v) {
  return v;
}
/*
* Rounding to grid.
*/


function roundToGrid(v) {
  //Rounding in TT is supposed to "symmetrical around zero"
  return Math.sign(v) * Math.round(Math.abs(v));
}
/*
* Rounding to double grid.
*/


function roundToDoubleGrid(v) {
  return Math.sign(v) * Math.round(Math.abs(v * 2)) / 2;
}
/*
* Rounding to half grid.
*/


function roundToHalfGrid(v) {
  return Math.sign(v) * (Math.round(Math.abs(v) + 0.5) - 0.5);
}
/*
* Rounding to up to grid.
*/


function roundUpToGrid(v) {
  return Math.sign(v) * Math.ceil(Math.abs(v));
}
/*
* Rounding to down to grid.
*/


function roundDownToGrid(v) {
  return Math.sign(v) * Math.floor(Math.abs(v));
}
/*
* Super rounding.
*/


const roundSuper = function (v) {
  const period = this.srPeriod;
  let phase = this.srPhase;
  const threshold = this.srThreshold;
  let sign = 1;

  if (v < 0) {
    v = -v;
    sign = -1;
  }

  v += threshold - phase;
  v = Math.trunc(v / period) * period;
  v += phase; // according to http://xgridfit.sourceforge.net/round.html

  if (v < 0) return phase * sign;
  return v * sign;
};
/*
* Unit vector of x-axis.
*/


const xUnitVector = {
  x: 1,
  y: 0,
  axis: 'x',
  // Gets the projected distance between two points.
  // o1/o2 ... if true, respective original position is used.
  distance: function (p1, p2, o1, o2) {
    return (o1 ? p1.xo : p1.x) - (o2 ? p2.xo : p2.x);
  },
  // Moves point p so the moved position has the same relative
  // position to the moved positions of rp1 and rp2 than the
  // original positions had.
  //
  // See APPENDIX on INTERPOLATE at the bottom of this file.
  interpolate: function (p, rp1, rp2, pv) {
    let do1;
    let do2;
    let doa1;
    let doa2;
    let dm1;
    let dm2;
    let dt;

    if (!pv || pv === this) {
      do1 = p.xo - rp1.xo;
      do2 = p.xo - rp2.xo;
      dm1 = rp1.x - rp1.xo;
      dm2 = rp2.x - rp2.xo;
      doa1 = Math.abs(do1);
      doa2 = Math.abs(do2);
      dt = doa1 + doa2;

      if (dt === 0) {
        p.x = p.xo + (dm1 + dm2) / 2;
        return;
      }

      p.x = p.xo + (dm1 * doa2 + dm2 * doa1) / dt;
      return;
    }

    do1 = pv.distance(p, rp1, true, true);
    do2 = pv.distance(p, rp2, true, true);
    dm1 = pv.distance(rp1, rp1, false, true);
    dm2 = pv.distance(rp2, rp2, false, true);
    doa1 = Math.abs(do1);
    doa2 = Math.abs(do2);
    dt = doa1 + doa2;

    if (dt === 0) {
      xUnitVector.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
      return;
    }

    xUnitVector.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
  },
  // Slope of line normal to this
  normalSlope: Number.NEGATIVE_INFINITY,
  // Sets the point 'p' relative to point 'rp'
  // by the distance 'd'.
  //
  // See APPENDIX on SETRELATIVE at the bottom of this file.
  //
  // p   ... point to set
  // rp  ... reference point
  // d   ... distance on projection vector
  // pv  ... projection vector (undefined = this)
  // org ... if true, uses the original position of rp as reference.
  setRelative: function (p, rp, d, pv, org) {
    if (!pv || pv === this) {
      p.x = (org ? rp.xo : rp.x) + d;
      return;
    }

    const rpx = org ? rp.xo : rp.x;
    const rpy = org ? rp.yo : rp.y;
    const rpdx = rpx + d * pv.x;
    const rpdy = rpy + d * pv.y;
    p.x = rpdx + (p.y - rpdy) / pv.normalSlope;
  },
  // Slope of vector line.
  slope: 0,
  // Touches the point p.
  touch: function (p) {
    p.xTouched = true;
  },
  // Tests if a point p is touched.
  touched: function (p) {
    return p.xTouched;
  },
  // Untouches the point p.
  untouch: function (p) {
    p.xTouched = false;
  }
};
/*
* Unit vector of y-axis.
*/

const yUnitVector = {
  x: 0,
  y: 1,
  axis: 'y',
  // Gets the projected distance between two points.
  // o1/o2 ... if true, respective original position is used.
  distance: function (p1, p2, o1, o2) {
    return (o1 ? p1.yo : p1.y) - (o2 ? p2.yo : p2.y);
  },
  // Moves point p so the moved position has the same relative
  // position to the moved positions of rp1 and rp2 than the
  // original positions had.
  //
  // See APPENDIX on INTERPOLATE at the bottom of this file.
  interpolate: function (p, rp1, rp2, pv) {
    let do1;
    let do2;
    let doa1;
    let doa2;
    let dm1;
    let dm2;
    let dt;

    if (!pv || pv === this) {
      do1 = p.yo - rp1.yo;
      do2 = p.yo - rp2.yo;
      dm1 = rp1.y - rp1.yo;
      dm2 = rp2.y - rp2.yo;
      doa1 = Math.abs(do1);
      doa2 = Math.abs(do2);
      dt = doa1 + doa2;

      if (dt === 0) {
        p.y = p.yo + (dm1 + dm2) / 2;
        return;
      }

      p.y = p.yo + (dm1 * doa2 + dm2 * doa1) / dt;
      return;
    }

    do1 = pv.distance(p, rp1, true, true);
    do2 = pv.distance(p, rp2, true, true);
    dm1 = pv.distance(rp1, rp1, false, true);
    dm2 = pv.distance(rp2, rp2, false, true);
    doa1 = Math.abs(do1);
    doa2 = Math.abs(do2);
    dt = doa1 + doa2;

    if (dt === 0) {
      yUnitVector.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
      return;
    }

    yUnitVector.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
  },
  // Slope of line normal to this.
  normalSlope: 0,
  // Sets the point 'p' relative to point 'rp'
  // by the distance 'd'
  //
  // See APPENDIX on SETRELATIVE at the bottom of this file.
  //
  // p   ... point to set
  // rp  ... reference point
  // d   ... distance on projection vector
  // pv  ... projection vector (undefined = this)
  // org ... if true, uses the original position of rp as reference.
  setRelative: function (p, rp, d, pv, org) {
    if (!pv || pv === this) {
      p.y = (org ? rp.yo : rp.y) + d;
      return;
    }

    const rpx = org ? rp.xo : rp.x;
    const rpy = org ? rp.yo : rp.y;
    const rpdx = rpx + d * pv.x;
    const rpdy = rpy + d * pv.y;
    p.y = rpdy + pv.normalSlope * (p.x - rpdx);
  },
  // Slope of vector line.
  slope: Number.POSITIVE_INFINITY,
  // Touches the point p.
  touch: function (p) {
    p.yTouched = true;
  },
  // Tests if a point p is touched.
  touched: function (p) {
    return p.yTouched;
  },
  // Untouches the point p.
  untouch: function (p) {
    p.yTouched = false;
  }
};
Object.freeze(xUnitVector);
Object.freeze(yUnitVector);
/*
* Creates a unit vector that is not x- or y-axis.
*/

function UnitVector(x, y) {
  this.x = x;
  this.y = y;
  this.axis = undefined;
  this.slope = y / x;
  this.normalSlope = -x / y;
  Object.freeze(this);
}
/*
* Gets the projected distance between two points.
* o1/o2 ... if true, respective original position is used.
*/


UnitVector.prototype.distance = function (p1, p2, o1, o2) {
  return this.x * xUnitVector.distance(p1, p2, o1, o2) + this.y * yUnitVector.distance(p1, p2, o1, o2);
};
/*
* Moves point p so the moved position has the same relative
* position to the moved positions of rp1 and rp2 than the
* original positions had.
*
* See APPENDIX on INTERPOLATE at the bottom of this file.
*/


UnitVector.prototype.interpolate = function (p, rp1, rp2, pv) {
  let dm1;
  let dm2;
  let do1;
  let do2;
  let doa1;
  let doa2;
  let dt;
  do1 = pv.distance(p, rp1, true, true);
  do2 = pv.distance(p, rp2, true, true);
  dm1 = pv.distance(rp1, rp1, false, true);
  dm2 = pv.distance(rp2, rp2, false, true);
  doa1 = Math.abs(do1);
  doa2 = Math.abs(do2);
  dt = doa1 + doa2;

  if (dt === 0) {
    this.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
    return;
  }

  this.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
};
/*
* Sets the point 'p' relative to point 'rp'
* by the distance 'd'
*
* See APPENDIX on SETRELATIVE at the bottom of this file.
*
* p   ...  point to set
* rp  ... reference point
* d   ... distance on projection vector
* pv  ... projection vector (undefined = this)
* org ... if true, uses the original position of rp as reference.
*/


UnitVector.prototype.setRelative = function (p, rp, d, pv, org) {
  pv = pv || this;
  const rpx = org ? rp.xo : rp.x;
  const rpy = org ? rp.yo : rp.y;
  const rpdx = rpx + d * pv.x;
  const rpdy = rpy + d * pv.y;
  const pvns = pv.normalSlope;
  const fvs = this.slope;
  const px = p.x;
  const py = p.y;
  p.x = (fvs * px - pvns * rpdx + rpdy - py) / (fvs - pvns);
  p.y = fvs * (p.x - px) + py;
};
/*
* Touches the point p.
*/


UnitVector.prototype.touch = function (p) {
  p.xTouched = true;
  p.yTouched = true;
};
/*
* Returns a unit vector with x/y coordinates.
*/


function getUnitVector(x, y) {
  const d = Math.sqrt(x * x + y * y);
  x /= d;
  y /= d;
  if (x === 1 && y === 0) return xUnitVector;else if (x === 0 && y === 1) return yUnitVector;else return new UnitVector(x, y);
}
/*
* Creates a point in the hinting engine.
*/


function HPoint(x, y, lastPointOfContour, onCurve) {
  this.x = this.xo = Math.round(x * 64) / 64; // hinted x value and original x-value

  this.y = this.yo = Math.round(y * 64) / 64; // hinted y value and original y-value

  this.lastPointOfContour = lastPointOfContour;
  this.onCurve = onCurve;
  this.prevPointOnContour = undefined;
  this.nextPointOnContour = undefined;
  this.xTouched = false;
  this.yTouched = false;
  Object.preventExtensions(this);
}
/*
* Returns the next touched point on the contour.
*
* v  ... unit vector to test touch axis.
*/


HPoint.prototype.nextTouched = function (v) {
  let p = this.nextPointOnContour;

  while (!v.touched(p) && p !== this) p = p.nextPointOnContour;

  return p;
};
/*
* Returns the previous touched point on the contour
*
* v  ... unit vector to test touch axis.
*/


HPoint.prototype.prevTouched = function (v) {
  let p = this.prevPointOnContour;

  while (!v.touched(p) && p !== this) p = p.prevPointOnContour;

  return p;
};
/*
* The zero point.
*/


const HPZero = Object.freeze(new HPoint(0, 0));
/*
* The default state of the interpreter.
*
* Note: Freezing the defaultState and then deriving from it
* makes the V8 Javascript engine going awkward,
* so this is avoided, albeit the defaultState shouldn't
* ever change.
*/

const defaultState = {
  cvCutIn: 17 / 16,
  // control value cut in
  deltaBase: 9,
  deltaShift: 0.125,
  loop: 1,
  // loops some instructions
  minDis: 1,
  // minimum distance
  autoFlip: true
};
/*
* The current state of the interpreter.
*
* env  ... 'fpgm' or 'prep' or 'glyf'
* prog ... the program
*/

function State(env, prog) {
  this.env = env;
  this.stack = [];
  this.prog = prog;

  switch (env) {
    case 'glyf':
      this.zp0 = this.zp1 = this.zp2 = 1;
      this.rp0 = this.rp1 = this.rp2 = 0;

    /* fall through */

    case 'prep':
      this.fv = this.pv = this.dpv = xUnitVector;
      this.round = roundToGrid;
  }
}
/*
* Executes a glyph program.
*
* This does the hinting for each glyph.
*
* Returns an array of moved points.
*
* glyph: the glyph to hint
* ppem: the size the glyph is rendered for
*/


Hinting.prototype.exec = function (glyph, ppem) {
  if (typeof ppem !== 'number') {
    throw new Error('Point size is not a number!');
  } // Received a fatal error, don't do any hinting anymore.


  if (this._errorState > 2) return;
  const font = this.font;
  let prepState = this._prepState;

  if (!prepState || prepState.ppem !== ppem) {
    let fpgmState = this._fpgmState;

    if (!fpgmState) {
      // Executes the fpgm state.
      // This is used by fonts to define functions.
      State.prototype = defaultState;
      fpgmState = this._fpgmState = new State('fpgm', font.tables.fpgm);
      fpgmState.funcs = [];
      fpgmState.font = font;

      if (exports.DEBUG) {
        console.log('---EXEC FPGM---');
        fpgmState.step = -1;
      }

      try {
        exec(fpgmState);
      } catch (e) {
        console.log('Hinting error in FPGM:' + e);
        this._errorState = 3;
        return;
      }
    } // Executes the prep program for this ppem setting.
    // This is used by fonts to set cvt values
    // depending on to be rendered font size.


    State.prototype = fpgmState;
    prepState = this._prepState = new State('prep', font.tables.prep);
    prepState.ppem = ppem; // Creates a copy of the cvt table
    // and scales it to the current ppem setting.

    const oCvt = font.tables.cvt;

    if (oCvt) {
      const cvt = prepState.cvt = new Array(oCvt.length);
      const scale = ppem / font.unitsPerEm;

      for (let c = 0; c < oCvt.length; c++) {
        cvt[c] = oCvt[c] * scale;
      }
    } else {
      prepState.cvt = [];
    }

    if (exports.DEBUG) {
      console.log('---EXEC PREP---');
      prepState.step = -1;
    }

    try {
      exec(prepState);
    } catch (e) {
      if (this._errorState < 2) {
        console.log('Hinting error in PREP:' + e);
      }

      this._errorState = 2;
    }
  }

  if (this._errorState > 1) return;

  try {
    return execGlyph(glyph, prepState);
  } catch (e) {
    if (this._errorState < 1) {
      console.log('Hinting error:' + e);
      console.log('Note: further hinting errors are silenced');
    }

    this._errorState = 1;
    return undefined;
  }
};
/*
* Executes the hinting program for a glyph.
*/


execGlyph = function (glyph, prepState) {
  // original point positions
  const xScale = prepState.ppem / prepState.font.unitsPerEm;
  const yScale = xScale;
  let components = glyph.components;
  let contours;
  let gZone;
  let state;
  State.prototype = prepState;

  if (!components) {
    state = new State('glyf', glyph.instructions);

    if (exports.DEBUG) {
      console.log('---EXEC GLYPH---');
      state.step = -1;
    }

    execComponent(glyph, state, xScale, yScale);
    gZone = state.gZone;
  } else {
    const font = prepState.font;
    gZone = [];
    contours = [];

    for (let i = 0; i < components.length; i++) {
      const c = components[i];
      const cg = font.glyphs.get(c.glyphIndex);
      state = new State('glyf', cg.instructions);

      if (exports.DEBUG) {
        console.log('---EXEC COMP ' + i + '---');
        state.step = -1;
      }

      execComponent(cg, state, xScale, yScale); // appends the computed points to the result array
      // post processes the component points

      const dx = Math.round(c.dx * xScale);
      const dy = Math.round(c.dy * yScale);
      const gz = state.gZone;
      const cc = state.contours;

      for (let pi = 0; pi < gz.length; pi++) {
        const p = gz[pi];
        p.xTouched = p.yTouched = false;
        p.xo = p.x = p.x + dx;
        p.yo = p.y = p.y + dy;
      }

      const gLen = gZone.length;
      gZone.push.apply(gZone, gz);

      for (let j = 0; j < cc.length; j++) {
        contours.push(cc[j] + gLen);
      }
    }

    if (glyph.instructions && !state.inhibitGridFit) {
      // the composite has instructions on its own
      state = new State('glyf', glyph.instructions);
      state.gZone = state.z0 = state.z1 = state.z2 = gZone;
      state.contours = contours; // note: HPZero cannot be used here, since
      //       the point might be modified

      gZone.push(new HPoint(0, 0), new HPoint(Math.round(glyph.advanceWidth * xScale), 0));

      if (exports.DEBUG) {
        console.log('---EXEC COMPOSITE---');
        state.step = -1;
      }

      exec(state);
      gZone.length -= 2;
    }
  }

  return gZone;
};
/*
* Executes the hinting program for a component of a multi-component glyph
* or of the glyph itself for a non-component glyph.
*/


execComponent = function (glyph, state, xScale, yScale) {
  const points = glyph.points || [];
  const pLen = points.length;
  const gZone = state.gZone = state.z0 = state.z1 = state.z2 = [];
  const contours = state.contours = []; // Scales the original points and
  // makes copies for the hinted points.

  let cp; // current point

  for (let i = 0; i < pLen; i++) {
    cp = points[i];
    gZone[i] = new HPoint(cp.x * xScale, cp.y * yScale, cp.lastPointOfContour, cp.onCurve);
  } // Chain links the contours.


  let sp; // start point

  let np; // next point

  for (let i = 0; i < pLen; i++) {
    cp = gZone[i];

    if (!sp) {
      sp = cp;
      contours.push(i);
    }

    if (cp.lastPointOfContour) {
      cp.nextPointOnContour = sp;
      sp.prevPointOnContour = cp;
      sp = undefined;
    } else {
      np = gZone[i + 1];
      cp.nextPointOnContour = np;
      np.prevPointOnContour = cp;
    }
  }

  if (state.inhibitGridFit) return;

  if (exports.DEBUG) {
    console.log('PROCESSING GLYPH', state.stack);

    for (let i = 0; i < pLen; i++) {
      console.log(i, gZone[i].x, gZone[i].y);
    }
  }

  gZone.push(new HPoint(0, 0), new HPoint(Math.round(glyph.advanceWidth * xScale), 0));
  exec(state); // Removes the extra points.

  gZone.length -= 2;

  if (exports.DEBUG) {
    console.log('FINISHED GLYPH', state.stack);

    for (let i = 0; i < pLen; i++) {
      console.log(i, gZone[i].x, gZone[i].y);
    }
  }
};
/*
* Executes the program loaded in state.
*/


exec = function (state) {
  let prog = state.prog;
  if (!prog) return;
  const pLen = prog.length;
  let ins;

  for (state.ip = 0; state.ip < pLen; state.ip++) {
    if (exports.DEBUG) state.step++;
    ins = instructionTable[prog[state.ip]];

    if (!ins) {
      throw new Error('unknown instruction: 0x' + Number(prog[state.ip]).toString(16));
    }

    ins(state); // very extensive debugging for each step

    /*
    if (exports.DEBUG) {
        var da;
        if (state.gZone) {
            da = [];
            for (let i = 0; i < state.gZone.length; i++)
            {
                da.push(i + ' ' +
                    state.gZone[i].x * 64 + ' ' +
                    state.gZone[i].y * 64 + ' ' +
                    (state.gZone[i].xTouched ? 'x' : '') +
                    (state.gZone[i].yTouched ? 'y' : '')
                );
            }
            console.log('GZ', da);
        }
         if (state.tZone) {
            da = [];
            for (let i = 0; i < state.tZone.length; i++) {
                da.push(i + ' ' +
                    state.tZone[i].x * 64 + ' ' +
                    state.tZone[i].y * 64 + ' ' +
                    (state.tZone[i].xTouched ? 'x' : '') +
                    (state.tZone[i].yTouched ? 'y' : '')
                );
            }
            console.log('TZ', da);
        }
         if (state.stack.length > 10) {
            console.log(
                state.stack.length,
                '...', state.stack.slice(state.stack.length - 10)
            );
        } else {
            console.log(state.stack.length, state.stack);
        }
    }
    */
  }
};
/*
* Initializes the twilight zone.
*
* This is only done if a SZPx instruction
* refers to the twilight zone.
*/


function initTZone(state) {
  const tZone = state.tZone = new Array(state.gZone.length); // no idea if this is actually correct...

  for (let i = 0; i < tZone.length; i++) {
    tZone[i] = new HPoint(0, 0);
  }
}
/*
* Skips the instruction pointer ahead over an IF/ELSE block.
* handleElse .. if true breaks on matching ELSE
*/


function skip(state, handleElse) {
  const prog = state.prog;
  let ip = state.ip;
  let nesting = 1;
  let ins;

  do {
    ins = prog[++ip];
    if (ins === 0x58) // IF
      nesting++;else if (ins === 0x59) // EIF
      nesting--;else if (ins === 0x40) // NPUSHB
      ip += prog[ip + 1] + 1;else if (ins === 0x41) // NPUSHW
      ip += 2 * prog[ip + 1] + 1;else if (ins >= 0xB0 && ins <= 0xB7) // PUSHB
      ip += ins - 0xB0 + 1;else if (ins >= 0xB8 && ins <= 0xBF) // PUSHW
      ip += (ins - 0xB8 + 1) * 2;else if (handleElse && nesting === 1 && ins === 0x1B) // ELSE
      break;
  } while (nesting > 0);

  state.ip = ip;
}
/*----------------------------------------------------------*
*          And then a lot of instructions...                *
*----------------------------------------------------------*/
// SVTCA[a] Set freedom and projection Vectors To Coordinate Axis
// 0x00-0x01


function SVTCA(v, state) {
  if (exports.DEBUG) console.log(state.step, 'SVTCA[' + v.axis + ']');
  state.fv = state.pv = state.dpv = v;
} // SPVTCA[a] Set Projection Vector to Coordinate Axis
// 0x02-0x03


function SPVTCA(v, state) {
  if (exports.DEBUG) console.log(state.step, 'SPVTCA[' + v.axis + ']');
  state.pv = state.dpv = v;
} // SFVTCA[a] Set Freedom Vector to Coordinate Axis
// 0x04-0x05


function SFVTCA(v, state) {
  if (exports.DEBUG) console.log(state.step, 'SFVTCA[' + v.axis + ']');
  state.fv = v;
} // SPVTL[a] Set Projection Vector To Line
// 0x06-0x07


function SPVTL(a, state) {
  const stack = state.stack;
  const p2i = stack.pop();
  const p1i = stack.pop();
  const p2 = state.z2[p2i];
  const p1 = state.z1[p1i];
  if (exports.DEBUG) console.log('SPVTL[' + a + ']', p2i, p1i);
  let dx;
  let dy;

  if (!a) {
    dx = p1.x - p2.x;
    dy = p1.y - p2.y;
  } else {
    dx = p2.y - p1.y;
    dy = p1.x - p2.x;
  }

  state.pv = state.dpv = getUnitVector(dx, dy);
} // SFVTL[a] Set Freedom Vector To Line
// 0x08-0x09


function SFVTL(a, state) {
  const stack = state.stack;
  const p2i = stack.pop();
  const p1i = stack.pop();
  const p2 = state.z2[p2i];
  const p1 = state.z1[p1i];
  if (exports.DEBUG) console.log('SFVTL[' + a + ']', p2i, p1i);
  let dx;
  let dy;

  if (!a) {
    dx = p1.x - p2.x;
    dy = p1.y - p2.y;
  } else {
    dx = p2.y - p1.y;
    dy = p1.x - p2.x;
  }

  state.fv = getUnitVector(dx, dy);
} // SPVFS[] Set Projection Vector From Stack
// 0x0A


function SPVFS(state) {
  const stack = state.stack;
  const y = stack.pop();
  const x = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'SPVFS[]', y, x);
  state.pv = state.dpv = getUnitVector(x, y);
} // SFVFS[] Set Freedom Vector From Stack
// 0x0B


function SFVFS(state) {
  const stack = state.stack;
  const y = stack.pop();
  const x = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'SPVFS[]', y, x);
  state.fv = getUnitVector(x, y);
} // GPV[] Get Projection Vector
// 0x0C


function GPV(state) {
  const stack = state.stack;
  const pv = state.pv;
  if (exports.DEBUG) console.log(state.step, 'GPV[]');
  stack.push(pv.x * 0x4000);
  stack.push(pv.y * 0x4000);
} // GFV[] Get Freedom Vector
// 0x0C


function GFV(state) {
  const stack = state.stack;
  const fv = state.fv;
  if (exports.DEBUG) console.log(state.step, 'GFV[]');
  stack.push(fv.x * 0x4000);
  stack.push(fv.y * 0x4000);
} // SFVTPV[] Set Freedom Vector To Projection Vector
// 0x0E


function SFVTPV(state) {
  state.fv = state.pv;
  if (exports.DEBUG) console.log(state.step, 'SFVTPV[]');
} // ISECT[] moves point p to the InterSECTion of two lines
// 0x0F


function ISECT(state) {
  const stack = state.stack;
  const pa0i = stack.pop();
  const pa1i = stack.pop();
  const pb0i = stack.pop();
  const pb1i = stack.pop();
  const pi = stack.pop();
  const z0 = state.z0;
  const z1 = state.z1;
  const pa0 = z0[pa0i];
  const pa1 = z0[pa1i];
  const pb0 = z1[pb0i];
  const pb1 = z1[pb1i];
  const p = state.z2[pi];
  if (exports.DEBUG) console.log('ISECT[], ', pa0i, pa1i, pb0i, pb1i, pi); // math from
  // en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line

  const x1 = pa0.x;
  const y1 = pa0.y;
  const x2 = pa1.x;
  const y2 = pa1.y;
  const x3 = pb0.x;
  const y3 = pb0.y;
  const x4 = pb1.x;
  const y4 = pb1.y;
  const div = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  const f1 = x1 * y2 - y1 * x2;
  const f2 = x3 * y4 - y3 * x4;
  p.x = (f1 * (x3 - x4) - f2 * (x1 - x2)) / div;
  p.y = (f1 * (y3 - y4) - f2 * (y1 - y2)) / div;
} // SRP0[] Set Reference Point 0
// 0x10


function SRP0(state) {
  state.rp0 = state.stack.pop();
  if (exports.DEBUG) console.log(state.step, 'SRP0[]', state.rp0);
} // SRP1[] Set Reference Point 1
// 0x11


function SRP1(state) {
  state.rp1 = state.stack.pop();
  if (exports.DEBUG) console.log(state.step, 'SRP1[]', state.rp1);
} // SRP1[] Set Reference Point 2
// 0x12


function SRP2(state) {
  state.rp2 = state.stack.pop();
  if (exports.DEBUG) console.log(state.step, 'SRP2[]', state.rp2);
} // SZP0[] Set Zone Pointer 0
// 0x13


function SZP0(state) {
  const n = state.stack.pop();
  if (exports.DEBUG) console.log(state.step, 'SZP0[]', n);
  state.zp0 = n;

  switch (n) {
    case 0:
      if (!state.tZone) initTZone(state);
      state.z0 = state.tZone;
      break;

    case 1:
      state.z0 = state.gZone;
      break;

    default:
      throw new Error('Invalid zone pointer');
  }
} // SZP1[] Set Zone Pointer 1
// 0x14


function SZP1(state) {
  const n = state.stack.pop();
  if (exports.DEBUG) console.log(state.step, 'SZP1[]', n);
  state.zp1 = n;

  switch (n) {
    case 0:
      if (!state.tZone) initTZone(state);
      state.z1 = state.tZone;
      break;

    case 1:
      state.z1 = state.gZone;
      break;

    default:
      throw new Error('Invalid zone pointer');
  }
} // SZP2[] Set Zone Pointer 2
// 0x15


function SZP2(state) {
  const n = state.stack.pop();
  if (exports.DEBUG) console.log(state.step, 'SZP2[]', n);
  state.zp2 = n;

  switch (n) {
    case 0:
      if (!state.tZone) initTZone(state);
      state.z2 = state.tZone;
      break;

    case 1:
      state.z2 = state.gZone;
      break;

    default:
      throw new Error('Invalid zone pointer');
  }
} // SZPS[] Set Zone PointerS
// 0x16


function SZPS(state) {
  const n = state.stack.pop();
  if (exports.DEBUG) console.log(state.step, 'SZPS[]', n);
  state.zp0 = state.zp1 = state.zp2 = n;

  switch (n) {
    case 0:
      if (!state.tZone) initTZone(state);
      state.z0 = state.z1 = state.z2 = state.tZone;
      break;

    case 1:
      state.z0 = state.z1 = state.z2 = state.gZone;
      break;

    default:
      throw new Error('Invalid zone pointer');
  }
} // SLOOP[] Set LOOP variable
// 0x17


function SLOOP(state) {
  state.loop = state.stack.pop();
  if (exports.DEBUG) console.log(state.step, 'SLOOP[]', state.loop);
} // RTG[] Round To Grid
// 0x18


function RTG(state) {
  if (exports.DEBUG) console.log(state.step, 'RTG[]');
  state.round = roundToGrid;
} // RTHG[] Round To Half Grid
// 0x19


function RTHG(state) {
  if (exports.DEBUG) console.log(state.step, 'RTHG[]');
  state.round = roundToHalfGrid;
} // SMD[] Set Minimum Distance
// 0x1A


function SMD(state) {
  const d = state.stack.pop();
  if (exports.DEBUG) console.log(state.step, 'SMD[]', d);
  state.minDis = d / 0x40;
} // ELSE[] ELSE clause
// 0x1B


function ELSE(state) {
  // This instruction has been reached by executing a then branch
  // so it just skips ahead until matching EIF.
  //
  // In case the IF was negative the IF[] instruction already
  // skipped forward over the ELSE[]
  if (exports.DEBUG) console.log(state.step, 'ELSE[]');
  skip(state, false);
} // JMPR[] JuMP Relative
// 0x1C


function JMPR(state) {
  const o = state.stack.pop();
  if (exports.DEBUG) console.log(state.step, 'JMPR[]', o); // A jump by 1 would do nothing.

  state.ip += o - 1;
} // SCVTCI[] Set Control Value Table Cut-In
// 0x1D


function SCVTCI(state) {
  const n = state.stack.pop();
  if (exports.DEBUG) console.log(state.step, 'SCVTCI[]', n);
  state.cvCutIn = n / 0x40;
} // DUP[] DUPlicate top stack element
// 0x20


function DUP(state) {
  const stack = state.stack;
  if (exports.DEBUG) console.log(state.step, 'DUP[]');
  stack.push(stack[stack.length - 1]);
} // POP[] POP top stack element
// 0x21


function POP(state) {
  if (exports.DEBUG) console.log(state.step, 'POP[]');
  state.stack.pop();
} // CLEAR[] CLEAR the stack
// 0x22


function CLEAR(state) {
  if (exports.DEBUG) console.log(state.step, 'CLEAR[]');
  state.stack.length = 0;
} // SWAP[] SWAP the top two elements on the stack
// 0x23


function SWAP(state) {
  const stack = state.stack;
  const a = stack.pop();
  const b = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'SWAP[]');
  stack.push(a);
  stack.push(b);
} // DEPTH[] DEPTH of the stack
// 0x24


function DEPTH(state) {
  const stack = state.stack;
  if (exports.DEBUG) console.log(state.step, 'DEPTH[]');
  stack.push(stack.length);
} // LOOPCALL[] LOOPCALL function
// 0x2A


function LOOPCALL(state) {
  const stack = state.stack;
  const fn = stack.pop();
  const c = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'LOOPCALL[]', fn, c); // saves callers program

  const cip = state.ip;
  const cprog = state.prog;
  state.prog = state.funcs[fn]; // executes the function

  for (let i = 0; i < c; i++) {
    exec(state);
    if (exports.DEBUG) console.log(++state.step, i + 1 < c ? 'next loopcall' : 'done loopcall', i);
  } // restores the callers program


  state.ip = cip;
  state.prog = cprog;
} // CALL[] CALL function
// 0x2B


function CALL(state) {
  const fn = state.stack.pop();
  if (exports.DEBUG) console.log(state.step, 'CALL[]', fn); // saves callers program

  const cip = state.ip;
  const cprog = state.prog;
  state.prog = state.funcs[fn]; // executes the function

  exec(state); // restores the callers program

  state.ip = cip;
  state.prog = cprog;
  if (exports.DEBUG) console.log(++state.step, 'returning from', fn);
} // CINDEX[] Copy the INDEXed element to the top of the stack
// 0x25


function CINDEX(state) {
  const stack = state.stack;
  const k = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'CINDEX[]', k); // In case of k == 1, it copies the last element after popping
  // thus stack.length - k.

  stack.push(stack[stack.length - k]);
} // MINDEX[] Move the INDEXed element to the top of the stack
// 0x26


function MINDEX(state) {
  const stack = state.stack;
  const k = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'MINDEX[]', k);
  stack.push(stack.splice(stack.length - k, 1)[0]);
} // FDEF[] Function DEFinition
// 0x2C


function FDEF(state) {
  if (state.env !== 'fpgm') throw new Error('FDEF not allowed here');
  const stack = state.stack;
  const prog = state.prog;
  let ip = state.ip;
  const fn = stack.pop();
  const ipBegin = ip;
  if (exports.DEBUG) console.log(state.step, 'FDEF[]', fn);

  while (prog[++ip] !== 0x2D);

  state.ip = ip;
  state.funcs[fn] = prog.slice(ipBegin + 1, ip);
} // MDAP[a] Move Direct Absolute Point
// 0x2E-0x2F


function MDAP(round, state) {
  const pi = state.stack.pop();
  const p = state.z0[pi];
  const fv = state.fv;
  const pv = state.pv;
  if (exports.DEBUG) console.log(state.step, 'MDAP[' + round + ']', pi);
  let d = pv.distance(p, HPZero);
  if (round) d = state.round(d);
  fv.setRelative(p, HPZero, d, pv);
  fv.touch(p);
  state.rp0 = state.rp1 = pi;
} // IUP[a] Interpolate Untouched Points through the outline
// 0x30


function IUP(v, state) {
  const z2 = state.z2;
  const pLen = z2.length - 2;
  let cp;
  let pp;
  let np;
  if (exports.DEBUG) console.log(state.step, 'IUP[' + v.axis + ']');

  for (let i = 0; i < pLen; i++) {
    cp = z2[i]; // current point
    // if this point has been touched go on

    if (v.touched(cp)) continue;
    pp = cp.prevTouched(v); // no point on the contour has been touched?

    if (pp === cp) continue;
    np = cp.nextTouched(v);

    if (pp === np) {
      // only one point on the contour has been touched
      // so simply moves the point like that
      v.setRelative(cp, cp, v.distance(pp, pp, false, true), v, true);
    }

    v.interpolate(cp, pp, np, v);
  }
} // SHP[] SHift Point using reference point
// 0x32-0x33


function SHP(a, state) {
  const stack = state.stack;
  const rpi = a ? state.rp1 : state.rp2;
  const rp = (a ? state.z0 : state.z1)[rpi];
  const fv = state.fv;
  const pv = state.pv;
  let loop = state.loop;
  const z2 = state.z2;

  while (loop--) {
    const pi = stack.pop();
    const p = z2[pi];
    const d = pv.distance(rp, rp, false, true);
    fv.setRelative(p, p, d, pv);
    fv.touch(p);

    if (exports.DEBUG) {
      console.log(state.step, (state.loop > 1 ? 'loop ' + (state.loop - loop) + ': ' : '') + 'SHP[' + (a ? 'rp1' : 'rp2') + ']', pi);
    }
  }

  state.loop = 1;
} // SHC[] SHift Contour using reference point
// 0x36-0x37


function SHC(a, state) {
  const stack = state.stack;
  const rpi = a ? state.rp1 : state.rp2;
  const rp = (a ? state.z0 : state.z1)[rpi];
  const fv = state.fv;
  const pv = state.pv;
  const ci = stack.pop();
  const sp = state.z2[state.contours[ci]];
  let p = sp;
  if (exports.DEBUG) console.log(state.step, 'SHC[' + a + ']', ci);
  const d = pv.distance(rp, rp, false, true);

  do {
    if (p !== rp) fv.setRelative(p, p, d, pv);
    p = p.nextPointOnContour;
  } while (p !== sp);
} // SHZ[] SHift Zone using reference point
// 0x36-0x37


function SHZ(a, state) {
  const stack = state.stack;
  const rpi = a ? state.rp1 : state.rp2;
  const rp = (a ? state.z0 : state.z1)[rpi];
  const fv = state.fv;
  const pv = state.pv;
  const e = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'SHZ[' + a + ']', e);
  let z;

  switch (e) {
    case 0:
      z = state.tZone;
      break;

    case 1:
      z = state.gZone;
      break;

    default:
      throw new Error('Invalid zone');
  }

  let p;
  const d = pv.distance(rp, rp, false, true);
  const pLen = z.length - 2;

  for (let i = 0; i < pLen; i++) {
    p = z[i];
    fv.setRelative(p, p, d, pv); //if (p !== rp) fv.setRelative(p, p, d, pv);
  }
} // SHPIX[] SHift point by a PIXel amount
// 0x38


function SHPIX(state) {
  const stack = state.stack;
  let loop = state.loop;
  const fv = state.fv;
  const d = stack.pop() / 0x40;
  const z2 = state.z2;

  while (loop--) {
    const pi = stack.pop();
    const p = z2[pi];

    if (exports.DEBUG) {
      console.log(state.step, (state.loop > 1 ? 'loop ' + (state.loop - loop) + ': ' : '') + 'SHPIX[]', pi, d);
    }

    fv.setRelative(p, p, d);
    fv.touch(p);
  }

  state.loop = 1;
} // IP[] Interpolate Point
// 0x39


function IP(state) {
  const stack = state.stack;
  const rp1i = state.rp1;
  const rp2i = state.rp2;
  let loop = state.loop;
  const rp1 = state.z0[rp1i];
  const rp2 = state.z1[rp2i];
  const fv = state.fv;
  const pv = state.dpv;
  const z2 = state.z2;

  while (loop--) {
    const pi = stack.pop();
    const p = z2[pi];

    if (exports.DEBUG) {
      console.log(state.step, (state.loop > 1 ? 'loop ' + (state.loop - loop) + ': ' : '') + 'IP[]', pi, rp1i, '<->', rp2i);
    }

    fv.interpolate(p, rp1, rp2, pv);
    fv.touch(p);
  }

  state.loop = 1;
} // MSIRP[a] Move Stack Indirect Relative Point
// 0x3A-0x3B


function MSIRP(a, state) {
  const stack = state.stack;
  const d = stack.pop() / 64;
  const pi = stack.pop();
  const p = state.z1[pi];
  const rp0 = state.z0[state.rp0];
  const fv = state.fv;
  const pv = state.pv;
  fv.setRelative(p, rp0, d, pv);
  fv.touch(p);
  if (exports.DEBUG) console.log(state.step, 'MSIRP[' + a + ']', d, pi);
  state.rp1 = state.rp0;
  state.rp2 = pi;
  if (a) state.rp0 = pi;
} // ALIGNRP[] Align to reference point.
// 0x3C


function ALIGNRP(state) {
  const stack = state.stack;
  const rp0i = state.rp0;
  const rp0 = state.z0[rp0i];
  let loop = state.loop;
  const fv = state.fv;
  const pv = state.pv;
  const z1 = state.z1;

  while (loop--) {
    const pi = stack.pop();
    const p = z1[pi];

    if (exports.DEBUG) {
      console.log(state.step, (state.loop > 1 ? 'loop ' + (state.loop - loop) + ': ' : '') + 'ALIGNRP[]', pi);
    }

    fv.setRelative(p, rp0, 0, pv);
    fv.touch(p);
  }

  state.loop = 1;
} // RTG[] Round To Double Grid
// 0x3D


function RTDG(state) {
  if (exports.DEBUG) console.log(state.step, 'RTDG[]');
  state.round = roundToDoubleGrid;
} // MIAP[a] Move Indirect Absolute Point
// 0x3E-0x3F


function MIAP(round, state) {
  const stack = state.stack;
  const n = stack.pop();
  const pi = stack.pop();
  const p = state.z0[pi];
  const fv = state.fv;
  const pv = state.pv;
  let cv = state.cvt[n];

  if (exports.DEBUG) {
    console.log(state.step, 'MIAP[' + round + ']', n, '(', cv, ')', pi);
  }

  let d = pv.distance(p, HPZero);

  if (round) {
    if (Math.abs(d - cv) < state.cvCutIn) d = cv;
    d = state.round(d);
  }

  fv.setRelative(p, HPZero, d, pv);

  if (state.zp0 === 0) {
    p.xo = p.x;
    p.yo = p.y;
  }

  fv.touch(p);
  state.rp0 = state.rp1 = pi;
} // NPUSB[] PUSH N Bytes
// 0x40


function NPUSHB(state) {
  const prog = state.prog;
  let ip = state.ip;
  const stack = state.stack;
  const n = prog[++ip];
  if (exports.DEBUG) console.log(state.step, 'NPUSHB[]', n);

  for (let i = 0; i < n; i++) stack.push(prog[++ip]);

  state.ip = ip;
} // NPUSHW[] PUSH N Words
// 0x41


function NPUSHW(state) {
  let ip = state.ip;
  const prog = state.prog;
  const stack = state.stack;
  const n = prog[++ip];
  if (exports.DEBUG) console.log(state.step, 'NPUSHW[]', n);

  for (let i = 0; i < n; i++) {
    let w = prog[++ip] << 8 | prog[++ip];
    if (w & 0x8000) w = -((w ^ 0xffff) + 1);
    stack.push(w);
  }

  state.ip = ip;
} // WS[] Write Store
// 0x42


function WS(state) {
  const stack = state.stack;
  let store = state.store;
  if (!store) store = state.store = [];
  const v = stack.pop();
  const l = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'WS', v, l);
  store[l] = v;
} // RS[] Read Store
// 0x43


function RS(state) {
  const stack = state.stack;
  const store = state.store;
  const l = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'RS', l);
  const v = store && store[l] || 0;
  stack.push(v);
} // WCVTP[] Write Control Value Table in Pixel units
// 0x44


function WCVTP(state) {
  const stack = state.stack;
  const v = stack.pop();
  const l = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'WCVTP', v, l);
  state.cvt[l] = v / 0x40;
} // RCVT[] Read Control Value Table entry
// 0x45


function RCVT(state) {
  const stack = state.stack;
  const cvte = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'RCVT', cvte);
  stack.push(state.cvt[cvte] * 0x40);
} // GC[] Get Coordinate projected onto the projection vector
// 0x46-0x47


function GC(a, state) {
  const stack = state.stack;
  const pi = stack.pop();
  const p = state.z2[pi];
  if (exports.DEBUG) console.log(state.step, 'GC[' + a + ']', pi);
  stack.push(state.dpv.distance(p, HPZero, a, false) * 0x40);
} // MD[a] Measure Distance
// 0x49-0x4A


function MD(a, state) {
  const stack = state.stack;
  const pi2 = stack.pop();
  const pi1 = stack.pop();
  const p2 = state.z1[pi2];
  const p1 = state.z0[pi1];
  const d = state.dpv.distance(p1, p2, a, a);
  if (exports.DEBUG) console.log(state.step, 'MD[' + a + ']', pi2, pi1, '->', d);
  state.stack.push(Math.round(d * 64));
} // MPPEM[] Measure Pixels Per EM
// 0x4B


function MPPEM(state) {
  if (exports.DEBUG) console.log(state.step, 'MPPEM[]');
  state.stack.push(state.ppem);
} // FLIPON[] set the auto FLIP Boolean to ON
// 0x4D


function FLIPON(state) {
  if (exports.DEBUG) console.log(state.step, 'FLIPON[]');
  state.autoFlip = true;
} // LT[] Less Than
// 0x50


function LT(state) {
  const stack = state.stack;
  const e2 = stack.pop();
  const e1 = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'LT[]', e2, e1);
  stack.push(e1 < e2 ? 1 : 0);
} // LTEQ[] Less Than or EQual
// 0x53


function LTEQ(state) {
  const stack = state.stack;
  const e2 = stack.pop();
  const e1 = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'LTEQ[]', e2, e1);
  stack.push(e1 <= e2 ? 1 : 0);
} // GTEQ[] Greater Than
// 0x52


function GT(state) {
  const stack = state.stack;
  const e2 = stack.pop();
  const e1 = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'GT[]', e2, e1);
  stack.push(e1 > e2 ? 1 : 0);
} // GTEQ[] Greater Than or EQual
// 0x53


function GTEQ(state) {
  const stack = state.stack;
  const e2 = stack.pop();
  const e1 = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'GTEQ[]', e2, e1);
  stack.push(e1 >= e2 ? 1 : 0);
} // EQ[] EQual
// 0x54


function EQ(state) {
  const stack = state.stack;
  const e2 = stack.pop();
  const e1 = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'EQ[]', e2, e1);
  stack.push(e2 === e1 ? 1 : 0);
} // NEQ[] Not EQual
// 0x55


function NEQ(state) {
  const stack = state.stack;
  const e2 = stack.pop();
  const e1 = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'NEQ[]', e2, e1);
  stack.push(e2 !== e1 ? 1 : 0);
} // ODD[] ODD
// 0x56


function ODD(state) {
  const stack = state.stack;
  const n = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'ODD[]', n);
  stack.push(Math.trunc(n) % 2 ? 1 : 0);
} // EVEN[] EVEN
// 0x57


function EVEN(state) {
  const stack = state.stack;
  const n = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'EVEN[]', n);
  stack.push(Math.trunc(n) % 2 ? 0 : 1);
} // IF[] IF test
// 0x58


function IF(state) {
  let test = state.stack.pop();
  let ins;
  if (exports.DEBUG) console.log(state.step, 'IF[]', test); // if test is true it just continues
  // if not the ip is skipped until matching ELSE or EIF

  if (!test) {
    skip(state, true);
    if (exports.DEBUG) console.log(state.step, ins === 0x1B ? 'ELSE[]' : 'EIF[]');
  }
} // EIF[] End IF
// 0x59


function EIF(state) {
  // this can be reached normally when
  // executing an else branch.
  // -> just ignore it
  if (exports.DEBUG) console.log(state.step, 'EIF[]');
} // AND[] logical AND
// 0x5A


function AND(state) {
  const stack = state.stack;
  const e2 = stack.pop();
  const e1 = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'AND[]', e2, e1);
  stack.push(e2 && e1 ? 1 : 0);
} // OR[] logical OR
// 0x5B


function OR(state) {
  const stack = state.stack;
  const e2 = stack.pop();
  const e1 = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'OR[]', e2, e1);
  stack.push(e2 || e1 ? 1 : 0);
} // NOT[] logical NOT
// 0x5C


function NOT(state) {
  const stack = state.stack;
  const e = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'NOT[]', e);
  stack.push(e ? 0 : 1);
} // DELTAP1[] DELTA exception P1
// DELTAP2[] DELTA exception P2
// DELTAP3[] DELTA exception P3
// 0x5D, 0x71, 0x72


function DELTAP123(b, state) {
  const stack = state.stack;
  const n = stack.pop();
  const fv = state.fv;
  const pv = state.pv;
  const ppem = state.ppem;
  const base = state.deltaBase + (b - 1) * 16;
  const ds = state.deltaShift;
  const z0 = state.z0;
  if (exports.DEBUG) console.log(state.step, 'DELTAP[' + b + ']', n, stack);

  for (let i = 0; i < n; i++) {
    const pi = stack.pop();
    const arg = stack.pop();
    const appem = base + ((arg & 0xF0) >> 4);
    if (appem !== ppem) continue;
    let mag = (arg & 0x0F) - 8;
    if (mag >= 0) mag++;
    if (exports.DEBUG) console.log(state.step, 'DELTAPFIX', pi, 'by', mag * ds);
    const p = z0[pi];
    fv.setRelative(p, p, mag * ds, pv);
  }
} // SDB[] Set Delta Base in the graphics state
// 0x5E


function SDB(state) {
  const stack = state.stack;
  const n = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'SDB[]', n);
  state.deltaBase = n;
} // SDS[] Set Delta Shift in the graphics state
// 0x5F


function SDS(state) {
  const stack = state.stack;
  const n = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'SDS[]', n);
  state.deltaShift = Math.pow(0.5, n);
} // ADD[] ADD
// 0x60


function ADD(state) {
  const stack = state.stack;
  const n2 = stack.pop();
  const n1 = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'ADD[]', n2, n1);
  stack.push(n1 + n2);
} // SUB[] SUB
// 0x61


function SUB(state) {
  const stack = state.stack;
  const n2 = stack.pop();
  const n1 = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'SUB[]', n2, n1);
  stack.push(n1 - n2);
} // DIV[] DIV
// 0x62


function DIV(state) {
  const stack = state.stack;
  const n2 = stack.pop();
  const n1 = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'DIV[]', n2, n1);
  stack.push(n1 * 64 / n2);
} // MUL[] MUL
// 0x63


function MUL(state) {
  const stack = state.stack;
  const n2 = stack.pop();
  const n1 = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'MUL[]', n2, n1);
  stack.push(n1 * n2 / 64);
} // ABS[] ABSolute value
// 0x64


function ABS(state) {
  const stack = state.stack;
  const n = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'ABS[]', n);
  stack.push(Math.abs(n));
} // NEG[] NEGate
// 0x65


function NEG(state) {
  const stack = state.stack;
  let n = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'NEG[]', n);
  stack.push(-n);
} // FLOOR[] FLOOR
// 0x66


function FLOOR(state) {
  const stack = state.stack;
  const n = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'FLOOR[]', n);
  stack.push(Math.floor(n / 0x40) * 0x40);
} // CEILING[] CEILING
// 0x67


function CEILING(state) {
  const stack = state.stack;
  const n = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'CEILING[]', n);
  stack.push(Math.ceil(n / 0x40) * 0x40);
} // ROUND[ab] ROUND value
// 0x68-0x6B


function ROUND(dt, state) {
  const stack = state.stack;
  const n = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'ROUND[]');
  stack.push(state.round(n / 0x40) * 0x40);
} // WCVTF[] Write Control Value Table in Funits
// 0x70


function WCVTF(state) {
  const stack = state.stack;
  const v = stack.pop();
  const l = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'WCVTF[]', v, l);
  state.cvt[l] = v * state.ppem / state.font.unitsPerEm;
} // DELTAC1[] DELTA exception C1
// DELTAC2[] DELTA exception C2
// DELTAC3[] DELTA exception C3
// 0x73, 0x74, 0x75


function DELTAC123(b, state) {
  const stack = state.stack;
  const n = stack.pop();
  const ppem = state.ppem;
  const base = state.deltaBase + (b - 1) * 16;
  const ds = state.deltaShift;
  if (exports.DEBUG) console.log(state.step, 'DELTAC[' + b + ']', n, stack);

  for (let i = 0; i < n; i++) {
    const c = stack.pop();
    const arg = stack.pop();
    const appem = base + ((arg & 0xF0) >> 4);
    if (appem !== ppem) continue;
    let mag = (arg & 0x0F) - 8;
    if (mag >= 0) mag++;
    const delta = mag * ds;
    if (exports.DEBUG) console.log(state.step, 'DELTACFIX', c, 'by', delta);
    state.cvt[c] += delta;
  }
} // SROUND[] Super ROUND
// 0x76


function SROUND(state) {
  let n = state.stack.pop();
  if (exports.DEBUG) console.log(state.step, 'SROUND[]', n);
  state.round = roundSuper;
  let period;

  switch (n & 0xC0) {
    case 0x00:
      period = 0.5;
      break;

    case 0x40:
      period = 1;
      break;

    case 0x80:
      period = 2;
      break;

    default:
      throw new Error('invalid SROUND value');
  }

  state.srPeriod = period;

  switch (n & 0x30) {
    case 0x00:
      state.srPhase = 0;
      break;

    case 0x10:
      state.srPhase = 0.25 * period;
      break;

    case 0x20:
      state.srPhase = 0.5 * period;
      break;

    case 0x30:
      state.srPhase = 0.75 * period;
      break;

    default:
      throw new Error('invalid SROUND value');
  }

  n &= 0x0F;
  if (n === 0) state.srThreshold = 0;else state.srThreshold = (n / 8 - 0.5) * period;
} // S45ROUND[] Super ROUND 45 degrees
// 0x77


function S45ROUND(state) {
  let n = state.stack.pop();
  if (exports.DEBUG) console.log(state.step, 'S45ROUND[]', n);
  state.round = roundSuper;
  let period;

  switch (n & 0xC0) {
    case 0x00:
      period = Math.sqrt(2) / 2;
      break;

    case 0x40:
      period = Math.sqrt(2);
      break;

    case 0x80:
      period = 2 * Math.sqrt(2);
      break;

    default:
      throw new Error('invalid S45ROUND value');
  }

  state.srPeriod = period;

  switch (n & 0x30) {
    case 0x00:
      state.srPhase = 0;
      break;

    case 0x10:
      state.srPhase = 0.25 * period;
      break;

    case 0x20:
      state.srPhase = 0.5 * period;
      break;

    case 0x30:
      state.srPhase = 0.75 * period;
      break;

    default:
      throw new Error('invalid S45ROUND value');
  }

  n &= 0x0F;
  if (n === 0) state.srThreshold = 0;else state.srThreshold = (n / 8 - 0.5) * period;
} // ROFF[] Round Off
// 0x7A


function ROFF(state) {
  if (exports.DEBUG) console.log(state.step, 'ROFF[]');
  state.round = roundOff;
} // RUTG[] Round Up To Grid
// 0x7C


function RUTG(state) {
  if (exports.DEBUG) console.log(state.step, 'RUTG[]');
  state.round = roundUpToGrid;
} // RDTG[] Round Down To Grid
// 0x7D


function RDTG(state) {
  if (exports.DEBUG) console.log(state.step, 'RDTG[]');
  state.round = roundDownToGrid;
} // SCANCTRL[] SCAN conversion ConTRoL
// 0x85


function SCANCTRL(state) {
  const n = state.stack.pop(); // ignored by opentype.js

  if (exports.DEBUG) console.log(state.step, 'SCANCTRL[]', n);
} // SDPVTL[a] Set Dual Projection Vector To Line
// 0x86-0x87


function SDPVTL(a, state) {
  const stack = state.stack;
  const p2i = stack.pop();
  const p1i = stack.pop();
  const p2 = state.z2[p2i];
  const p1 = state.z1[p1i];
  if (exports.DEBUG) console.log(state.step, 'SDPVTL[' + a + ']', p2i, p1i);
  let dx;
  let dy;

  if (!a) {
    dx = p1.x - p2.x;
    dy = p1.y - p2.y;
  } else {
    dx = p2.y - p1.y;
    dy = p1.x - p2.x;
  }

  state.dpv = getUnitVector(dx, dy);
} // GETINFO[] GET INFOrmation
// 0x88


function GETINFO(state) {
  const stack = state.stack;
  const sel = stack.pop();
  let r = 0;
  if (exports.DEBUG) console.log(state.step, 'GETINFO[]', sel); // v35 as in no subpixel hinting

  if (sel & 0x01) r = 35; // TODO rotation and stretch currently not supported
  // and thus those GETINFO are always 0.
  // opentype.js is always gray scaling

  if (sel & 0x20) r |= 0x1000;
  stack.push(r);
} // ROLL[] ROLL the top three stack elements
// 0x8A


function ROLL(state) {
  const stack = state.stack;
  const a = stack.pop();
  const b = stack.pop();
  const c = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'ROLL[]');
  stack.push(b);
  stack.push(a);
  stack.push(c);
} // MAX[] MAXimum of top two stack elements
// 0x8B


function MAX(state) {
  const stack = state.stack;
  const e2 = stack.pop();
  const e1 = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'MAX[]', e2, e1);
  stack.push(Math.max(e1, e2));
} // MIN[] MINimum of top two stack elements
// 0x8C


function MIN(state) {
  const stack = state.stack;
  const e2 = stack.pop();
  const e1 = stack.pop();
  if (exports.DEBUG) console.log(state.step, 'MIN[]', e2, e1);
  stack.push(Math.min(e1, e2));
} // SCANTYPE[] SCANTYPE
// 0x8D


function SCANTYPE(state) {
  const n = state.stack.pop(); // ignored by opentype.js

  if (exports.DEBUG) console.log(state.step, 'SCANTYPE[]', n);
} // INSTCTRL[] INSTCTRL
// 0x8D


function INSTCTRL(state) {
  const s = state.stack.pop();
  let v = state.stack.pop();
  if (exports.DEBUG) console.log(state.step, 'INSTCTRL[]', s, v);

  switch (s) {
    case 1:
      state.inhibitGridFit = !!v;
      return;

    case 2:
      state.ignoreCvt = !!v;
      return;

    default:
      throw new Error('invalid INSTCTRL[] selector');
  }
} // PUSHB[abc] PUSH Bytes
// 0xB0-0xB7


function PUSHB(n, state) {
  const stack = state.stack;
  const prog = state.prog;
  let ip = state.ip;
  if (exports.DEBUG) console.log(state.step, 'PUSHB[' + n + ']');

  for (let i = 0; i < n; i++) stack.push(prog[++ip]);

  state.ip = ip;
} // PUSHW[abc] PUSH Words
// 0xB8-0xBF


function PUSHW(n, state) {
  let ip = state.ip;
  const prog = state.prog;
  const stack = state.stack;
  if (exports.DEBUG) console.log(state.ip, 'PUSHW[' + n + ']');

  for (let i = 0; i < n; i++) {
    let w = prog[++ip] << 8 | prog[++ip];
    if (w & 0x8000) w = -((w ^ 0xffff) + 1);
    stack.push(w);
  }

  state.ip = ip;
} // MDRP[abcde] Move Direct Relative Point
// 0xD0-0xEF
// (if indirect is 0)
//
// and
//
// MIRP[abcde] Move Indirect Relative Point
// 0xE0-0xFF
// (if indirect is 1)


function MDRP_MIRP(indirect, setRp0, keepD, ro, dt, state) {
  const stack = state.stack;
  const cvte = indirect && stack.pop();
  const pi = stack.pop();
  const rp0i = state.rp0;
  const rp = state.z0[rp0i];
  const p = state.z1[pi];
  const md = state.minDis;
  const fv = state.fv;
  const pv = state.dpv;
  let od; // original distance

  let d; // moving distance

  let sign; // sign of distance

  let cv;
  d = od = pv.distance(p, rp, true, true);
  sign = d >= 0 ? 1 : -1; // Math.sign would be 0 in case of 0
  // TODO consider autoFlip

  d = Math.abs(d);

  if (indirect) {
    cv = state.cvt[cvte];
    if (ro && Math.abs(d - cv) < state.cvCutIn) d = cv;
  }

  if (keepD && d < md) d = md;
  if (ro) d = state.round(d);
  fv.setRelative(p, rp, sign * d, pv);
  fv.touch(p);

  if (exports.DEBUG) {
    console.log(state.step, (indirect ? 'MIRP[' : 'MDRP[') + (setRp0 ? 'M' : 'm') + (keepD ? '>' : '_') + (ro ? 'R' : '_') + (dt === 0 ? 'Gr' : dt === 1 ? 'Bl' : dt === 2 ? 'Wh' : '') + ']', indirect ? cvte + '(' + state.cvt[cvte] + ',' + cv + ')' : '', pi, '(d =', od, '->', sign * d, ')');
  }

  state.rp1 = state.rp0;
  state.rp2 = pi;
  if (setRp0) state.rp0 = pi;
}
/*
* The instruction table.
*/


instructionTable = [
/* 0x00 */
SVTCA.bind(undefined, yUnitVector),
/* 0x01 */
SVTCA.bind(undefined, xUnitVector),
/* 0x02 */
SPVTCA.bind(undefined, yUnitVector),
/* 0x03 */
SPVTCA.bind(undefined, xUnitVector),
/* 0x04 */
SFVTCA.bind(undefined, yUnitVector),
/* 0x05 */
SFVTCA.bind(undefined, xUnitVector),
/* 0x06 */
SPVTL.bind(undefined, 0),
/* 0x07 */
SPVTL.bind(undefined, 1),
/* 0x08 */
SFVTL.bind(undefined, 0),
/* 0x09 */
SFVTL.bind(undefined, 1),
/* 0x0A */
SPVFS,
/* 0x0B */
SFVFS,
/* 0x0C */
GPV,
/* 0x0D */
GFV,
/* 0x0E */
SFVTPV,
/* 0x0F */
ISECT,
/* 0x10 */
SRP0,
/* 0x11 */
SRP1,
/* 0x12 */
SRP2,
/* 0x13 */
SZP0,
/* 0x14 */
SZP1,
/* 0x15 */
SZP2,
/* 0x16 */
SZPS,
/* 0x17 */
SLOOP,
/* 0x18 */
RTG,
/* 0x19 */
RTHG,
/* 0x1A */
SMD,
/* 0x1B */
ELSE,
/* 0x1C */
JMPR,
/* 0x1D */
SCVTCI,
/* 0x1E */
undefined, // TODO SSWCI

/* 0x1F */
undefined, // TODO SSW

/* 0x20 */
DUP,
/* 0x21 */
POP,
/* 0x22 */
CLEAR,
/* 0x23 */
SWAP,
/* 0x24 */
DEPTH,
/* 0x25 */
CINDEX,
/* 0x26 */
MINDEX,
/* 0x27 */
undefined, // TODO ALIGNPTS

/* 0x28 */
undefined,
/* 0x29 */
undefined, // TODO UTP

/* 0x2A */
LOOPCALL,
/* 0x2B */
CALL,
/* 0x2C */
FDEF,
/* 0x2D */
undefined, // ENDF (eaten by FDEF)

/* 0x2E */
MDAP.bind(undefined, 0),
/* 0x2F */
MDAP.bind(undefined, 1),
/* 0x30 */
IUP.bind(undefined, yUnitVector),
/* 0x31 */
IUP.bind(undefined, xUnitVector),
/* 0x32 */
SHP.bind(undefined, 0),
/* 0x33 */
SHP.bind(undefined, 1),
/* 0x34 */
SHC.bind(undefined, 0),
/* 0x35 */
SHC.bind(undefined, 1),
/* 0x36 */
SHZ.bind(undefined, 0),
/* 0x37 */
SHZ.bind(undefined, 1),
/* 0x38 */
SHPIX,
/* 0x39 */
IP,
/* 0x3A */
MSIRP.bind(undefined, 0),
/* 0x3B */
MSIRP.bind(undefined, 1),
/* 0x3C */
ALIGNRP,
/* 0x3D */
RTDG,
/* 0x3E */
MIAP.bind(undefined, 0),
/* 0x3F */
MIAP.bind(undefined, 1),
/* 0x40 */
NPUSHB,
/* 0x41 */
NPUSHW,
/* 0x42 */
WS,
/* 0x43 */
RS,
/* 0x44 */
WCVTP,
/* 0x45 */
RCVT,
/* 0x46 */
GC.bind(undefined, 0),
/* 0x47 */
GC.bind(undefined, 1),
/* 0x48 */
undefined, // TODO SCFS

/* 0x49 */
MD.bind(undefined, 0),
/* 0x4A */
MD.bind(undefined, 1),
/* 0x4B */
MPPEM,
/* 0x4C */
undefined, // TODO MPS

/* 0x4D */
FLIPON,
/* 0x4E */
undefined, // TODO FLIPOFF

/* 0x4F */
undefined, // TODO DEBUG

/* 0x50 */
LT,
/* 0x51 */
LTEQ,
/* 0x52 */
GT,
/* 0x53 */
GTEQ,
/* 0x54 */
EQ,
/* 0x55 */
NEQ,
/* 0x56 */
ODD,
/* 0x57 */
EVEN,
/* 0x58 */
IF,
/* 0x59 */
EIF,
/* 0x5A */
AND,
/* 0x5B */
OR,
/* 0x5C */
NOT,
/* 0x5D */
DELTAP123.bind(undefined, 1),
/* 0x5E */
SDB,
/* 0x5F */
SDS,
/* 0x60 */
ADD,
/* 0x61 */
SUB,
/* 0x62 */
DIV,
/* 0x63 */
MUL,
/* 0x64 */
ABS,
/* 0x65 */
NEG,
/* 0x66 */
FLOOR,
/* 0x67 */
CEILING,
/* 0x68 */
ROUND.bind(undefined, 0),
/* 0x69 */
ROUND.bind(undefined, 1),
/* 0x6A */
ROUND.bind(undefined, 2),
/* 0x6B */
ROUND.bind(undefined, 3),
/* 0x6C */
undefined, // TODO NROUND[ab]

/* 0x6D */
undefined, // TODO NROUND[ab]

/* 0x6E */
undefined, // TODO NROUND[ab]

/* 0x6F */
undefined, // TODO NROUND[ab]

/* 0x70 */
WCVTF,
/* 0x71 */
DELTAP123.bind(undefined, 2),
/* 0x72 */
DELTAP123.bind(undefined, 3),
/* 0x73 */
DELTAC123.bind(undefined, 1),
/* 0x74 */
DELTAC123.bind(undefined, 2),
/* 0x75 */
DELTAC123.bind(undefined, 3),
/* 0x76 */
SROUND,
/* 0x77 */
S45ROUND,
/* 0x78 */
undefined, // TODO JROT[]

/* 0x79 */
undefined, // TODO JROF[]

/* 0x7A */
ROFF,
/* 0x7B */
undefined,
/* 0x7C */
RUTG,
/* 0x7D */
RDTG,
/* 0x7E */
POP, // actually SANGW, supposed to do only a pop though

/* 0x7F */
POP, // actually AA, supposed to do only a pop though

/* 0x80 */
undefined, // TODO FLIPPT

/* 0x81 */
undefined, // TODO FLIPRGON

/* 0x82 */
undefined, // TODO FLIPRGOFF

/* 0x83 */
undefined,
/* 0x84 */
undefined,
/* 0x85 */
SCANCTRL,
/* 0x86 */
SDPVTL.bind(undefined, 0),
/* 0x87 */
SDPVTL.bind(undefined, 1),
/* 0x88 */
GETINFO,
/* 0x89 */
undefined, // TODO IDEF

/* 0x8A */
ROLL,
/* 0x8B */
MAX,
/* 0x8C */
MIN,
/* 0x8D */
SCANTYPE,
/* 0x8E */
INSTCTRL,
/* 0x8F */
undefined,
/* 0x90 */
undefined,
/* 0x91 */
undefined,
/* 0x92 */
undefined,
/* 0x93 */
undefined,
/* 0x94 */
undefined,
/* 0x95 */
undefined,
/* 0x96 */
undefined,
/* 0x97 */
undefined,
/* 0x98 */
undefined,
/* 0x99 */
undefined,
/* 0x9A */
undefined,
/* 0x9B */
undefined,
/* 0x9C */
undefined,
/* 0x9D */
undefined,
/* 0x9E */
undefined,
/* 0x9F */
undefined,
/* 0xA0 */
undefined,
/* 0xA1 */
undefined,
/* 0xA2 */
undefined,
/* 0xA3 */
undefined,
/* 0xA4 */
undefined,
/* 0xA5 */
undefined,
/* 0xA6 */
undefined,
/* 0xA7 */
undefined,
/* 0xA8 */
undefined,
/* 0xA9 */
undefined,
/* 0xAA */
undefined,
/* 0xAB */
undefined,
/* 0xAC */
undefined,
/* 0xAD */
undefined,
/* 0xAE */
undefined,
/* 0xAF */
undefined,
/* 0xB0 */
PUSHB.bind(undefined, 1),
/* 0xB1 */
PUSHB.bind(undefined, 2),
/* 0xB2 */
PUSHB.bind(undefined, 3),
/* 0xB3 */
PUSHB.bind(undefined, 4),
/* 0xB4 */
PUSHB.bind(undefined, 5),
/* 0xB5 */
PUSHB.bind(undefined, 6),
/* 0xB6 */
PUSHB.bind(undefined, 7),
/* 0xB7 */
PUSHB.bind(undefined, 8),
/* 0xB8 */
PUSHW.bind(undefined, 1),
/* 0xB9 */
PUSHW.bind(undefined, 2),
/* 0xBA */
PUSHW.bind(undefined, 3),
/* 0xBB */
PUSHW.bind(undefined, 4),
/* 0xBC */
PUSHW.bind(undefined, 5),
/* 0xBD */
PUSHW.bind(undefined, 6),
/* 0xBE */
PUSHW.bind(undefined, 7),
/* 0xBF */
PUSHW.bind(undefined, 8),
/* 0xC0 */
MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 0),
/* 0xC1 */
MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 1),
/* 0xC2 */
MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 2),
/* 0xC3 */
MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 3),
/* 0xC4 */
MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 0),
/* 0xC5 */
MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 1),
/* 0xC6 */
MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 2),
/* 0xC7 */
MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 3),
/* 0xC8 */
MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 0),
/* 0xC9 */
MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 1),
/* 0xCA */
MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 2),
/* 0xCB */
MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 3),
/* 0xCC */
MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 0),
/* 0xCD */
MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 1),
/* 0xCE */
MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 2),
/* 0xCF */
MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 3),
/* 0xD0 */
MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 0),
/* 0xD1 */
MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 1),
/* 0xD2 */
MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 2),
/* 0xD3 */
MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 3),
/* 0xD4 */
MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 0),
/* 0xD5 */
MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 1),
/* 0xD6 */
MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 2),
/* 0xD7 */
MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 3),
/* 0xD8 */
MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 0),
/* 0xD9 */
MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 1),
/* 0xDA */
MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 2),
/* 0xDB */
MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 3),
/* 0xDC */
MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 0),
/* 0xDD */
MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 1),
/* 0xDE */
MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 2),
/* 0xDF */
MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 3),
/* 0xE0 */
MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 0),
/* 0xE1 */
MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 1),
/* 0xE2 */
MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 2),
/* 0xE3 */
MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 3),
/* 0xE4 */
MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 0),
/* 0xE5 */
MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 1),
/* 0xE6 */
MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 2),
/* 0xE7 */
MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 3),
/* 0xE8 */
MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 0),
/* 0xE9 */
MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 1),
/* 0xEA */
MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 2),
/* 0xEB */
MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 3),
/* 0xEC */
MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 0),
/* 0xED */
MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 1),
/* 0xEE */
MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 2),
/* 0xEF */
MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 3),
/* 0xF0 */
MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 0),
/* 0xF1 */
MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 1),
/* 0xF2 */
MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 2),
/* 0xF3 */
MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 3),
/* 0xF4 */
MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 0),
/* 0xF5 */
MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 1),
/* 0xF6 */
MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 2),
/* 0xF7 */
MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 3),
/* 0xF8 */
MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 0),
/* 0xF9 */
MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 1),
/* 0xFA */
MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 2),
/* 0xFB */
MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 3),
/* 0xFC */
MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 0),
/* 0xFD */
MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 1),
/* 0xFE */
MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 2),
/* 0xFF */
MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 3)];
var _default = Hinting;
/*****************************
  Mathematical Considerations
******************************

fv ... refers to freedom vector
pv ... refers to projection vector
rp ... refers to reference point
p  ... refers to to point being operated on
d  ... refers to distance

SETRELATIVE:
============

case freedom vector == x-axis:
------------------------------

                        (pv)
                     .-'
              rpd .-'
               .-*
          d .-'90°'
         .-'       '
      .-'           '
   *-'               ' b
  rp                  '
                       '
                        '
            p *----------*-------------- (fv)
                          pm

  rpdx = rpx + d * pv.x
  rpdy = rpy + d * pv.y

  equation of line b

   y - rpdy = pvns * (x- rpdx)

   y = p.y

   x = rpdx + ( p.y - rpdy ) / pvns


case freedom vector == y-axis:
------------------------------

    * pm
    |\
    | \
    |  \
    |   \
    |    \
    |     \
    |      \
    |       \
    |        \
    |         \ b
    |          \
    |           \
    |            \    .-' (pv)
    |         90° \.-'
    |           .-'* rpd
    |        .-'
    *     *-'  d
    p     rp

  rpdx = rpx + d * pv.x
  rpdy = rpy + d * pv.y

  equation of line b:
           pvns ... normal slope to pv

   y - rpdy = pvns * (x - rpdx)

   x = p.x

   y = rpdy +  pvns * (p.x - rpdx)



generic case:
-------------


                              .'(fv)
                            .'
                          .* pm
                        .' !
                      .'    .
                    .'      !
                  .'         . b
                .'           !
               *              .
              p               !
                         90°   .    ... (pv)
                           ...-*-'''
                  ...---'''    rpd
         ...---'''   d
   *--'''
  rp

    rpdx = rpx + d * pv.x
    rpdy = rpy + d * pv.y

 equation of line b:
    pvns... normal slope to pv

    y - rpdy = pvns * (x - rpdx)

 equation of freedom vector line:
    fvs ... slope of freedom vector (=fy/fx)

    y - py = fvs * (x - px)


  on pm both equations are true for same x/y

    y - rpdy = pvns * (x - rpdx)

    y - py = fvs * (x - px)

  form to y and set equal:

    pvns * (x - rpdx) + rpdy = fvs * (x - px) + py

  expand:

    pvns * x - pvns * rpdx + rpdy = fvs * x - fvs * px + py

  switch:

    fvs * x - fvs * px + py = pvns * x - pvns * rpdx + rpdy

  solve for x:

    fvs * x - pvns * x = fvs * px - pvns * rpdx - py + rpdy



          fvs * px - pvns * rpdx + rpdy - py
    x =  -----------------------------------
                 fvs - pvns

  and:

    y = fvs * (x - px) + py



INTERPOLATE:
============

Examples of point interpolation.

The weight of the movement of the reference point gets bigger
the further the other reference point is away, thus the safest
option (that is avoiding 0/0 divisions) is to weight the
original distance of the other point by the sum of both distances.

If the sum of both distances is 0, then move the point by the
arithmetic average of the movement of both reference points.




           (+6)
    rp1o *---->*rp1
         .     .                          (+12)
         .     .                  rp2o *---------->* rp2
         .     .                       .           .
         .     .                       .           .
         .    10          20           .           .
         |.........|...................|           .
               .   .                               .
               .   . (+8)                          .
                po *------>*p                      .
               .           .                       .
               .    12     .          24           .
               |...........|.......................|
                                  36


-------



           (+10)
    rp1o *-------->*rp1
         .         .                      (-10)
         .         .              rp2 *<---------* rpo2
         .         .                   .         .
         .         .                   .         .
         .    10   .          30       .         .
         |.........|.............................|
                   .                   .
                   . (+5)              .
                po *--->* p            .
                   .    .              .
                   .    .   20         .
                   |....|..............|
                     5        15


-------


           (+10)
    rp1o *-------->*rp1
         .         .
         .         .
    rp2o *-------->*rp2


                               (+10)
                          po *-------->* p

-------


           (+10)
    rp1o *-------->*rp1
         .         .
         .         .(+30)
    rp2o *---------------------------->*rp2


                                        (+25)
                          po *----------------------->* p



vim: set ts=4 sw=4 expandtab:
*****/

exports.default = _default;
},{"./tables/glyf":"../node_modules/opentype.js/src/tables/glyf.js"}],"../node_modules/opentype.js/src/tokenizer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Token = Token;
exports.Event = Event;
exports.ContextRange = ContextRange;
exports.ContextParams = ContextParams;
exports.default = void 0;

/**
 * Converts a string into a list of tokens.
 */

/**
 * Create a new token
 * @param {string} char a single char
 */
function Token(char) {
  this.char = char;
  this.state = {};
  this.activeState = null;
}
/**
 * Create a new context range
 * @param {number} startIndex range start index
 * @param {number} endOffset range end index offset
 * @param {string} contextName owner context name
 */


function ContextRange(startIndex, endOffset, contextName) {
  this.contextName = contextName;
  this.startIndex = startIndex;
  this.endOffset = endOffset;
}
/**
 * Check context start and end
 * @param {string} contextName a unique context name
 * @param {function} checkStart a predicate function the indicates a context's start
 * @param {function} checkEnd a predicate function the indicates a context's end
 */


function ContextChecker(contextName, checkStart, checkEnd) {
  this.contextName = contextName;
  this.openRange = null;
  this.ranges = [];
  this.checkStart = checkStart;
  this.checkEnd = checkEnd;
}
/**
 * @typedef ContextParams
 * @type Object
 * @property {array} context context items
 * @property {number} currentIndex current item index
 */

/**
 * Create a context params
 * @param {array} context a list of items
 * @param {number} currentIndex current item index
 */


function ContextParams(context, currentIndex) {
  this.context = context;
  this.index = currentIndex;
  this.length = context.length;
  this.current = context[currentIndex];
  this.backtrack = context.slice(0, currentIndex);
  this.lookahead = context.slice(currentIndex + 1);
}
/**
 * Create an event instance
 * @param {string} eventId event unique id
 */


function Event(eventId) {
  this.eventId = eventId;
  this.subscribers = [];
}
/**
 * Initialize a core events and auto subscribe required event handlers
 * @param {any} events an object that enlists core events handlers
 */


function initializeCoreEvents(events) {
  const coreEvents = ['start', 'end', 'next', 'newToken', 'contextStart', 'contextEnd', 'insertToken', 'removeToken', 'removeRange', 'replaceToken', 'replaceRange', 'composeRUD', 'updateContextsRanges'];
  coreEvents.forEach(eventId => {
    Object.defineProperty(this.events, eventId, {
      value: new Event(eventId)
    });
  });

  if (!!events) {
    coreEvents.forEach(eventId => {
      const event = events[eventId];

      if (typeof event === 'function') {
        this.events[eventId].subscribe(event);
      }
    });
  }

  const requiresContextUpdate = ['insertToken', 'removeToken', 'removeRange', 'replaceToken', 'replaceRange', 'composeRUD'];
  requiresContextUpdate.forEach(eventId => {
    this.events[eventId].subscribe(this.updateContextsRanges);
  });
}
/**
 * Converts a string into a list of tokens
 * @param {any} events tokenizer core events
 */


function Tokenizer(events) {
  this.tokens = [];
  this.registeredContexts = {};
  this.contextCheckers = [];
  this.events = {};
  this.registeredModifiers = [];
  initializeCoreEvents.call(this, events);
}
/**
 * Sets the state of a token, usually called by a state modifier.
 * @param {string} key state item key
 * @param {any} value state item value
 */


Token.prototype.setState = function (key, value) {
  this.state[key] = value;
  this.activeState = {
    key,
    value: this.state[key]
  };
  return this.activeState;
};

Token.prototype.getState = function (stateId) {
  return this.state[stateId] || null;
};
/**
 * Checks if an index exists in the tokens list.
 * @param {number} index token index
 */


Tokenizer.prototype.inboundIndex = function (index) {
  return index >= 0 && index < this.tokens.length;
};
/**
 * Compose and apply a list of operations (replace, update, delete)
 * @param {array} RUDs replace, update and delete operations
 * TODO: Perf. Optimization (lengthBefore === lengthAfter ? dispatch once)
 */


Tokenizer.prototype.composeRUD = function (RUDs) {
  const silent = true;
  const state = RUDs.map(RUD => this[RUD[0]].apply(this, RUD.slice(1).concat(silent)));

  const hasFAILObject = obj => typeof obj === 'object' && obj.hasOwnProperty('FAIL');

  if (state.every(hasFAILObject)) {
    return {
      FAIL: `composeRUD: one or more operations hasn't completed successfully`,
      report: state.filter(hasFAILObject)
    };
  }

  this.dispatch('composeRUD', [state.filter(op => !hasFAILObject(op))]);
};
/**
 * Replace a range of tokens with a list of tokens
 * @param {number} startIndex range start index
 * @param {number} offset range offset
 * @param {token} tokens a list of tokens to replace
 * @param {boolean} silent dispatch events and update context ranges
 */


Tokenizer.prototype.replaceRange = function (startIndex, offset, tokens, silent) {
  offset = offset !== null ? offset : this.tokens.length;
  const isTokenType = tokens.every(token => token instanceof Token);

  if (!isNaN(startIndex) && this.inboundIndex(startIndex) && isTokenType) {
    const replaced = this.tokens.splice.apply(this.tokens, [startIndex, offset].concat(tokens));
    if (!silent) this.dispatch('replaceToken', [startIndex, offset, tokens]);
    return [replaced, tokens];
  } else {
    return {
      FAIL: 'replaceRange: invalid tokens or startIndex.'
    };
  }
};
/**
 * Replace a token with another token
 * @param {number} index token index
 * @param {token} token a token to replace
 * @param {boolean} silent dispatch events and update context ranges
 */


Tokenizer.prototype.replaceToken = function (index, token, silent) {
  if (!isNaN(index) && this.inboundIndex(index) && token instanceof Token) {
    const replaced = this.tokens.splice(index, 1, token);
    if (!silent) this.dispatch('replaceToken', [index, token]);
    return [replaced[0], token];
  } else {
    return {
      FAIL: 'replaceToken: invalid token or index.'
    };
  }
};
/**
 * Removes a range of tokens
 * @param {number} startIndex range start index
 * @param {number} offset range offset
 * @param {boolean} silent dispatch events and update context ranges
 */


Tokenizer.prototype.removeRange = function (startIndex, offset, silent) {
  offset = !isNaN(offset) ? offset : this.tokens.length;
  const tokens = this.tokens.splice(startIndex, offset);
  if (!silent) this.dispatch('removeRange', [tokens, startIndex, offset]);
  return tokens;
};
/**
 * Remove a token at a certain index
 * @param {number} index token index
 * @param {boolean} silent dispatch events and update context ranges
 */


Tokenizer.prototype.removeToken = function (index, silent) {
  if (!isNaN(index) && this.inboundIndex(index)) {
    const token = this.tokens.splice(index, 1);
    if (!silent) this.dispatch('removeToken', [token, index]);
    return token;
  } else {
    return {
      FAIL: 'removeToken: invalid token index.'
    };
  }
};
/**
 * Insert a list of tokens at a certain index
 * @param {array} tokens a list of tokens to insert
 * @param {number} index insert the list of tokens at index
 * @param {boolean} silent dispatch events and update context ranges
 */


Tokenizer.prototype.insertToken = function (tokens, index, silent) {
  const tokenType = tokens.every(token => token instanceof Token);

  if (tokenType) {
    this.tokens.splice.apply(this.tokens, [index, 0].concat(tokens));
    if (!silent) this.dispatch('insertToken', [tokens, index]);
    return tokens;
  } else {
    return {
      FAIL: 'insertToken: invalid token(s).'
    };
  }
};
/**
 * A state modifier that is called on 'newToken' event
 * @param {string} modifierId state modifier id
 * @param {function} condition a predicate function that returns true or false
 * @param {function} modifier a function to update token state
 */


Tokenizer.prototype.registerModifier = function (modifierId, condition, modifier) {
  this.events.newToken.subscribe(function (token, contextParams) {
    const conditionParams = [token, contextParams];
    const canApplyModifier = condition === null || condition.apply(this, conditionParams) === true;
    const modifierParams = [token, contextParams];

    if (canApplyModifier) {
      let newStateValue = modifier.apply(this, modifierParams);
      token.setState(modifierId, newStateValue);
    }
  });
  this.registeredModifiers.push(modifierId);
};
/**
 * Subscribe a handler to an event
 * @param {function} eventHandler an event handler function
 */


Event.prototype.subscribe = function (eventHandler) {
  if (typeof eventHandler === 'function') {
    return this.subscribers.push(eventHandler) - 1;
  } else {
    return {
      FAIL: `invalid '${this.eventId}' event handler`
    };
  }
};
/**
 * Unsubscribe an event handler
 * @param {string} subsId subscription id
 */


Event.prototype.unsubscribe = function (subsId) {
  this.subscribers.splice(subsId, 1);
};
/**
 * Sets context params current value index
 * @param {number} index context params current value index
 */


ContextParams.prototype.setCurrentIndex = function (index) {
  this.index = index;
  this.current = this.context[index];
  this.backtrack = this.context.slice(0, index);
  this.lookahead = this.context.slice(index + 1);
};
/**
 * Get an item at an offset from the current value
 * example (current value is 3):
 *  1    2   [3]   4    5   |   items values
 * -2   -1    0    1    2   |   offset values
 * @param {number} offset an offset from current value index
 */


ContextParams.prototype.get = function (offset) {
  switch (true) {
    case offset === 0:
      return this.current;

    case offset < 0 && Math.abs(offset) <= this.backtrack.length:
      return this.backtrack.slice(offset)[0];

    case offset > 0 && offset <= this.lookahead.length:
      return this.lookahead[offset - 1];

    default:
      return null;
  }
};
/**
 * Converts a context range into a string value
 * @param {contextRange} range a context range
 */


Tokenizer.prototype.rangeToText = function (range) {
  if (range instanceof ContextRange) {
    return this.getRangeTokens(range).map(token => token.char).join('');
  }
};
/**
 * Converts all tokens into a string
 */


Tokenizer.prototype.getText = function () {
  return this.tokens.map(token => token.char).join('');
};
/**
 * Get a context by name
 * @param {string} contextName context name to get
 */


Tokenizer.prototype.getContext = function (contextName) {
  let context = this.registeredContexts[contextName];
  return !!context ? context : null;
};
/**
 * Subscribes a new event handler to an event
 * @param {string} eventName event name to subscribe to
 * @param {function} eventHandler a function to be invoked on event
 */


Tokenizer.prototype.on = function (eventName, eventHandler) {
  const event = this.events[eventName];

  if (!!event) {
    return event.subscribe(eventHandler);
  } else {
    return null;
  }
};
/**
 * Dispatches an event
 * @param {string} eventName event name
 * @param {any} args event handler arguments
 */


Tokenizer.prototype.dispatch = function (eventName, args) {
  const event = this.events[eventName];

  if (event instanceof Event) {
    event.subscribers.forEach(subscriber => {
      subscriber.apply(this, args || []);
    });
  }
};
/**
 * Register a new context checker
 * @param {string} contextName a unique context name
 * @param {function} contextStartCheck a predicate function that returns true on context start
 * @param {function} contextEndCheck  a predicate function that returns true on context end
 * TODO: call tokenize on registration to update context ranges with the new context.
 */


Tokenizer.prototype.registerContextChecker = function (contextName, contextStartCheck, contextEndCheck) {
  if (!!this.getContext(contextName)) return {
    FAIL: `context name '${contextName}' is already registered.`
  };
  if (typeof contextStartCheck !== 'function') return {
    FAIL: `missing context start check.`
  };
  if (typeof contextEndCheck !== 'function') return {
    FAIL: `missing context end check.`
  };
  const contextCheckers = new ContextChecker(contextName, contextStartCheck, contextEndCheck);
  this.registeredContexts[contextName] = contextCheckers;
  this.contextCheckers.push(contextCheckers);
  return contextCheckers;
};
/**
 * Gets a context range tokens
 * @param {contextRange} range a context range
 */


Tokenizer.prototype.getRangeTokens = function (range) {
  const endIndex = range.startIndex + range.endOffset;
  return [].concat(this.tokens.slice(range.startIndex, endIndex));
};
/**
 * Gets the ranges of a context
 * @param {string} contextName context name
 */


Tokenizer.prototype.getContextRanges = function (contextName) {
  const context = this.getContext(contextName);

  if (!!context) {
    return context.ranges;
  } else {
    return {
      FAIL: `context checker '${contextName}' is not registered.`
    };
  }
};
/**
 * Resets context ranges to run context update
 */


Tokenizer.prototype.resetContextsRanges = function () {
  const registeredContexts = this.registeredContexts;

  for (const contextName in registeredContexts) {
    if (registeredContexts.hasOwnProperty(contextName)) {
      const context = registeredContexts[contextName];
      context.ranges = [];
    }
  }
};
/**
 * Updates context ranges
 */


Tokenizer.prototype.updateContextsRanges = function () {
  this.resetContextsRanges();
  const chars = this.tokens.map(token => token.char);

  for (let i = 0; i < chars.length; i++) {
    const contextParams = new ContextParams(chars, i);
    this.runContextCheck(contextParams);
  }

  this.dispatch('updateContextsRanges', [this.registeredContexts]);
};
/**
 * Sets the end offset of an open range
 * @param {number} offset range end offset
 * @param {string} contextName context name
 */


Tokenizer.prototype.setEndOffset = function (offset, contextName) {
  const startIndex = this.getContext(contextName).openRange.startIndex;
  let range = new ContextRange(startIndex, offset, contextName);
  const ranges = this.getContext(contextName).ranges;
  range.rangeId = `${contextName}.${ranges.length}`;
  ranges.push(range);
  this.getContext(contextName).openRange = null;
  return range;
};
/**
 * Runs a context check on the current context
 * @param {contextParams} contextParams current context params
 */


Tokenizer.prototype.runContextCheck = function (contextParams) {
  const index = contextParams.index;
  this.contextCheckers.forEach(contextChecker => {
    let contextName = contextChecker.contextName;
    let openRange = this.getContext(contextName).openRange;

    if (!openRange && contextChecker.checkStart(contextParams)) {
      openRange = new ContextRange(index, null, contextName);
      this.getContext(contextName).openRange = openRange;
      this.dispatch('contextStart', [contextName, index]);
    }

    if (!!openRange && contextChecker.checkEnd(contextParams)) {
      const offset = index - openRange.startIndex + 1;
      const range = this.setEndOffset(offset, contextName);
      this.dispatch('contextEnd', [contextName, range]);
    }
  });
};
/**
 * Converts a text into a list of tokens
 * @param {string} text a text to tokenize
 */


Tokenizer.prototype.tokenize = function (text) {
  this.tokens = [];
  this.resetContextsRanges();
  let chars = Array.from(text);
  this.dispatch('start');

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const contextParams = new ContextParams(chars, i);
    this.dispatch('next', [contextParams]);
    this.runContextCheck(contextParams);
    let token = new Token(char);
    this.tokens.push(token);
    this.dispatch('newToken', [token, contextParams]);
  }

  this.dispatch('end', [this.tokens]);
  return this.tokens;
};

var _default = Tokenizer;
exports.default = _default;
},{}],"../node_modules/opentype.js/src/char.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isArabicChar = isArabicChar;
exports.isIsolatedArabicChar = isIsolatedArabicChar;
exports.isTashkeelArabicChar = isTashkeelArabicChar;
exports.isLatinChar = isLatinChar;
exports.isWhiteSpace = isWhiteSpace;

// ╭─┄┄┄────────────────────────┄─────────────────────────────────────────────╮
// ┊ Character Class Assertions ┊ Checks if a char belongs to a certain class ┊
// ╰─╾──────────────────────────┄─────────────────────────────────────────────╯
// jscs:disable maximumLineLength

/**
 * Check if a char is Arabic
 * @param {string} c a single char
 */
function isArabicChar(c) {
  return /[\u0600-\u065F\u066A-\u06D2\u06FA-\u06FF]/.test(c);
}
/**
 * Check if a char is an isolated arabic char
 * @param {string} c a single char
 */


function isIsolatedArabicChar(char) {
  return /[\u0630\u0690\u0621\u0631\u0661\u0671\u0622\u0632\u0672\u0692\u06C2\u0623\u0673\u0693\u06C3\u0624\u0694\u06C4\u0625\u0675\u0695\u06C5\u06E5\u0676\u0696\u06C6\u0627\u0677\u0697\u06C7\u0648\u0688\u0698\u06C8\u0689\u0699\u06C9\u068A\u06CA\u066B\u068B\u06CB\u068C\u068D\u06CD\u06FD\u068E\u06EE\u06FE\u062F\u068F\u06CF\u06EF]/.test(char);
}
/**
 * Check if a char is an Arabic Tashkeel char
 * @param {string} c a single char
 */


function isTashkeelArabicChar(char) {
  return /[\u0600-\u0605\u060C-\u060E\u0610-\u061B\u061E\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/.test(char);
}
/**
 * Check if a char is Latin
 * @param {string} c a single char
 */


function isLatinChar(c) {
  return /[A-z]/.test(c);
}
/**
 * Check if a char is whitespace char
 * @param {string} c a single char
 */


function isWhiteSpace(c) {
  return /\s/.test(c);
}
},{}],"../node_modules/opentype.js/src/features/featureQuery.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeatureQuery = FeatureQuery;
exports.SubstitutionAction = SubstitutionAction;
exports.default = void 0;

var _tokenizer = require("../tokenizer");

var _char = require("../char");

/**
 * Query a feature by some of it's properties to lookup a glyph substitution.
 */

/**
 * Create feature query instance
 * @param {Font} font opentype font instance
 */
function FeatureQuery(font) {
  this.font = font;
  this.features = {};
}
/**
 * @typedef SubstitutionAction
 * @type Object
 * @property {number} id substitution type
 * @property {string} tag feature tag
 * @property {any} substitution substitution value(s)
 */

/**
 * Create a substitution action instance
 * @param {SubstitutionAction} action
 */


function SubstitutionAction(action) {
  this.id = action.id;
  this.tag = action.tag;
  this.substitution = action.substitution;
}
/**
 * Lookup a coverage table
 * @param {number} glyphIndex glyph index
 * @param {CoverageTable} coverage coverage table
 */


function lookupCoverage(glyphIndex, coverage) {
  if (!glyphIndex) return -1;

  switch (coverage.format) {
    case 1:
      return coverage.glyphs.indexOf(glyphIndex);

    case 2:
      let ranges = coverage.ranges;

      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];

        if (glyphIndex >= range.start && glyphIndex <= range.end) {
          let offset = glyphIndex - range.start;
          return range.index + offset;
        }
      }

      break;

    default:
      return -1;
    // not found
  }

  return -1;
}
/**
 * Handle a single substitution - format 1
 * @param {ContextParams} contextParams context params to lookup
 */


function singleSubstitutionFormat1(glyphIndex, subtable) {
  let substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
  if (substituteIndex === -1) return null;
  return glyphIndex + subtable.deltaGlyphId;
}
/**
 * Handle a single substitution - format 2
 * @param {ContextParams} contextParams context params to lookup
 */


function singleSubstitutionFormat2(glyphIndex, subtable) {
  let substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
  if (substituteIndex === -1) return null;
  return subtable.substitute[substituteIndex];
}
/**
 * Lookup a list of coverage tables
 * @param {any} coverageList a list of coverage tables
 * @param {ContextParams} contextParams context params to lookup
 */


function lookupCoverageList(coverageList, contextParams) {
  let lookupList = [];

  for (let i = 0; i < coverageList.length; i++) {
    const coverage = coverageList[i];
    let glyphIndex = contextParams.current;
    glyphIndex = Array.isArray(glyphIndex) ? glyphIndex[0] : glyphIndex;
    const lookupIndex = lookupCoverage(glyphIndex, coverage);

    if (lookupIndex !== -1) {
      lookupList.push(lookupIndex);
    }
  }

  if (lookupList.length !== coverageList.length) return -1;
  return lookupList;
}
/**
 * Handle chaining context substitution - format 3
 * @param {ContextParams} contextParams context params to lookup
 */


function chainingSubstitutionFormat3(contextParams, subtable) {
  const lookupsCount = subtable.inputCoverage.length + subtable.lookaheadCoverage.length + subtable.backtrackCoverage.length;
  if (contextParams.context.length < lookupsCount) return []; // INPUT LOOKUP //

  let inputLookups = lookupCoverageList(subtable.inputCoverage, contextParams);
  if (inputLookups === -1) return []; // LOOKAHEAD LOOKUP //

  const lookaheadOffset = subtable.inputCoverage.length - 1;
  if (contextParams.lookahead.length < subtable.lookaheadCoverage.length) return [];
  let lookaheadContext = contextParams.lookahead.slice(lookaheadOffset);

  while (lookaheadContext.length && (0, _char.isTashkeelArabicChar)(lookaheadContext[0].char)) {
    lookaheadContext.shift();
  }

  const lookaheadParams = new _tokenizer.ContextParams(lookaheadContext, 0);
  let lookaheadLookups = lookupCoverageList(subtable.lookaheadCoverage, lookaheadParams); // BACKTRACK LOOKUP //

  let backtrackContext = [].concat(contextParams.backtrack);
  backtrackContext.reverse();

  while (backtrackContext.length && (0, _char.isTashkeelArabicChar)(backtrackContext[0].char)) {
    backtrackContext.shift();
  }

  if (backtrackContext.length < subtable.backtrackCoverage.length) return [];
  const backtrackParams = new _tokenizer.ContextParams(backtrackContext, 0);
  let backtrackLookups = lookupCoverageList(subtable.backtrackCoverage, backtrackParams);
  const contextRulesMatch = inputLookups.length === subtable.inputCoverage.length && lookaheadLookups.length === subtable.lookaheadCoverage.length && backtrackLookups.length === subtable.backtrackCoverage.length;
  let substitutions = [];

  if (contextRulesMatch) {
    for (let i = 0; i < subtable.lookupRecords.length; i++) {
      const lookupRecord = subtable.lookupRecords[i];
      const lookupListIndex = lookupRecord.lookupListIndex;
      const lookupTable = this.getLookupByIndex(lookupListIndex);

      for (let s = 0; s < lookupTable.subtables.length; s++) {
        const subtable = lookupTable.subtables[s];
        const lookup = this.getLookupMethod(lookupTable, subtable);
        const substitutionType = this.getSubstitutionType(lookupTable, subtable);

        if (substitutionType === '12') {
          for (let n = 0; n < inputLookups.length; n++) {
            const glyphIndex = contextParams.get(n);
            const substitution = lookup(glyphIndex);
            if (substitution) substitutions.push(substitution);
          }
        }
      }
    }
  }

  return substitutions;
}
/**
 * Handle ligature substitution - format 1
 * @param {ContextParams} contextParams context params to lookup
 */


function ligatureSubstitutionFormat1(contextParams, subtable) {
  // COVERAGE LOOKUP //
  let glyphIndex = contextParams.current;
  let ligSetIndex = lookupCoverage(glyphIndex, subtable.coverage);
  if (ligSetIndex === -1) return null; // COMPONENTS LOOKUP
  // (!) note, components are ordered in the written direction.

  let ligature;
  let ligatureSet = subtable.ligatureSets[ligSetIndex];

  for (let s = 0; s < ligatureSet.length; s++) {
    ligature = ligatureSet[s];

    for (let l = 0; l < ligature.components.length; l++) {
      const lookaheadItem = contextParams.lookahead[l];
      const component = ligature.components[l];
      if (lookaheadItem !== component) break;
      if (l === ligature.components.length - 1) return ligature;
    }
  }

  return null;
}
/**
 * Handle decomposition substitution - format 1
 * @param {number} glyphIndex glyph index
 * @param {any} subtable subtable
 */


function decompositionSubstitutionFormat1(glyphIndex, subtable) {
  let substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
  if (substituteIndex === -1) return null;
  return subtable.sequences[substituteIndex];
}
/**
 * Get default script features indexes
 */


FeatureQuery.prototype.getDefaultScriptFeaturesIndexes = function () {
  const scripts = this.font.tables.gsub.scripts;

  for (let s = 0; s < scripts.length; s++) {
    const script = scripts[s];
    if (script.tag === 'DFLT') return script.script.defaultLangSys.featureIndexes;
  }

  return [];
};
/**
 * Get feature indexes of a specific script
 * @param {string} scriptTag script tag
 */


FeatureQuery.prototype.getScriptFeaturesIndexes = function (scriptTag) {
  const tables = this.font.tables;
  if (!tables.gsub) return [];
  if (!scriptTag) return this.getDefaultScriptFeaturesIndexes();
  const scripts = this.font.tables.gsub.scripts;

  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];

    if (script.tag === scriptTag && script.script.defaultLangSys) {
      return script.script.defaultLangSys.featureIndexes;
    } else {
      let langSysRecords = script.langSysRecords;

      if (!!langSysRecords) {
        for (let j = 0; j < langSysRecords.length; j++) {
          const langSysRecord = langSysRecords[j];

          if (langSysRecord.tag === scriptTag) {
            let langSys = langSysRecord.langSys;
            return langSys.featureIndexes;
          }
        }
      }
    }
  }

  return this.getDefaultScriptFeaturesIndexes();
};
/**
 * Map a feature tag to a gsub feature
 * @param {any} features gsub features
 * @param {string} scriptTag script tag
 */


FeatureQuery.prototype.mapTagsToFeatures = function (features, scriptTag) {
  let tags = {};

  for (let i = 0; i < features.length; i++) {
    const tag = features[i].tag;
    const feature = features[i].feature;
    tags[tag] = feature;
  }

  this.features[scriptTag].tags = tags;
};
/**
 * Get features of a specific script
 * @param {string} scriptTag script tag
 */


FeatureQuery.prototype.getScriptFeatures = function (scriptTag) {
  let features = this.features[scriptTag];
  if (this.features.hasOwnProperty(scriptTag)) return features;
  const featuresIndexes = this.getScriptFeaturesIndexes(scriptTag);
  if (!featuresIndexes) return null;
  const gsub = this.font.tables.gsub;
  features = featuresIndexes.map(index => gsub.features[index]);
  this.features[scriptTag] = features;
  this.mapTagsToFeatures(features, scriptTag);
  return features;
};
/**
 * Get substitution type
 * @param {any} lookupTable lookup table
 * @param {any} subtable subtable
 */


FeatureQuery.prototype.getSubstitutionType = function (lookupTable, subtable) {
  const lookupType = lookupTable.lookupType.toString();
  const substFormat = subtable.substFormat.toString();
  return lookupType + substFormat;
};
/**
 * Get lookup method
 * @param {any} lookupTable lookup table
 * @param {any} subtable subtable
 */


FeatureQuery.prototype.getLookupMethod = function (lookupTable, subtable) {
  let substitutionType = this.getSubstitutionType(lookupTable, subtable);

  switch (substitutionType) {
    case '11':
      return glyphIndex => singleSubstitutionFormat1.apply(this, [glyphIndex, subtable]);

    case '12':
      return glyphIndex => singleSubstitutionFormat2.apply(this, [glyphIndex, subtable]);

    case '63':
      return contextParams => chainingSubstitutionFormat3.apply(this, [contextParams, subtable]);

    case '41':
      return contextParams => ligatureSubstitutionFormat1.apply(this, [contextParams, subtable]);

    case '21':
      return glyphIndex => decompositionSubstitutionFormat1.apply(this, [glyphIndex, subtable]);

    default:
      throw new Error(`lookupType: ${lookupTable.lookupType} - ` + `substFormat: ${subtable.substFormat} ` + `is not yet supported`);
  }
};
/**
 * [ LOOKUP TYPES ]
 * -------------------------------
 * Single                        1;
 * Multiple                      2;
 * Alternate                     3;
 * Ligature                      4;
 * Context                       5;
 * ChainingContext               6;
 * ExtensionSubstitution         7;
 * ReverseChainingContext        8;
 * -------------------------------
 *
 */

/**
 * @typedef FQuery
 * @type Object
 * @param {string} tag feature tag
 * @param {string} script feature script
 * @param {ContextParams} contextParams context params
 */

/**
 * Lookup a feature using a query parameters
 * @param {FQuery} query feature query
 */


FeatureQuery.prototype.lookupFeature = function (query) {
  let contextParams = query.contextParams;
  let currentIndex = contextParams.index;
  const feature = this.getFeature({
    tag: query.tag,
    script: query.script
  });
  if (!feature) return new Error(`font '${this.font.names.fullName.en}' ` + `doesn't support feature '${query.tag}' ` + `for script '${query.script}'.`);
  const lookups = this.getFeatureLookups(feature);
  const substitutions = [].concat(contextParams.context);

  for (let l = 0; l < lookups.length; l++) {
    const lookupTable = lookups[l];
    const subtables = this.getLookupSubtables(lookupTable);

    for (let s = 0; s < subtables.length; s++) {
      const subtable = subtables[s];
      const substType = this.getSubstitutionType(lookupTable, subtable);
      const lookup = this.getLookupMethod(lookupTable, subtable);
      let substitution;

      switch (substType) {
        case '11':
          substitution = lookup(contextParams.current);

          if (substitution) {
            substitutions.splice(currentIndex, 1, new SubstitutionAction({
              id: 11,
              tag: query.tag,
              substitution
            }));
          }

          break;

        case '12':
          substitution = lookup(contextParams.current);

          if (substitution) {
            substitutions.splice(currentIndex, 1, new SubstitutionAction({
              id: 12,
              tag: query.tag,
              substitution
            }));
          }

          break;

        case '63':
          substitution = lookup(contextParams);

          if (Array.isArray(substitution) && substitution.length) {
            substitutions.splice(currentIndex, 1, new SubstitutionAction({
              id: 63,
              tag: query.tag,
              substitution
            }));
          }

          break;

        case '41':
          substitution = lookup(contextParams);

          if (substitution) {
            substitutions.splice(currentIndex, 1, new SubstitutionAction({
              id: 41,
              tag: query.tag,
              substitution
            }));
          }

          break;

        case '21':
          substitution = lookup(contextParams.current);

          if (substitution) {
            substitutions.splice(currentIndex, 1, new SubstitutionAction({
              id: 21,
              tag: query.tag,
              substitution
            }));
          }

          break;
      }

      contextParams = new _tokenizer.ContextParams(substitutions, currentIndex);
      if (Array.isArray(substitution) && !substitution.length) continue;
      substitution = null;
    }
  }

  return substitutions.length ? substitutions : null;
};
/**
 * Checks if a font supports a specific features
 * @param {FQuery} query feature query object
 */


FeatureQuery.prototype.supports = function (query) {
  if (!query.script) return false;
  this.getScriptFeatures(query.script);
  const supportedScript = this.features.hasOwnProperty(query.script);
  if (!query.tag) return supportedScript;
  const supportedFeature = this.features[query.script].some(feature => feature.tag === query.tag);
  return supportedScript && supportedFeature;
};
/**
 * Get lookup table subtables
 * @param {any} lookupTable lookup table
 */


FeatureQuery.prototype.getLookupSubtables = function (lookupTable) {
  return lookupTable.subtables || null;
};
/**
 * Get lookup table by index
 * @param {number} index lookup table index
 */


FeatureQuery.prototype.getLookupByIndex = function (index) {
  const lookups = this.font.tables.gsub.lookups;
  return lookups[index] || null;
};
/**
 * Get lookup tables for a feature
 * @param {string} feature
 */


FeatureQuery.prototype.getFeatureLookups = function (feature) {
  // TODO: memoize
  return feature.lookupListIndexes.map(this.getLookupByIndex.bind(this));
};
/**
 * Query a feature by it's properties
 * @param {any} query an object that describes the properties of a query
 */


FeatureQuery.prototype.getFeature = function getFeature(query) {
  if (!this.font) return {
    FAIL: `No font was found`
  };

  if (!this.features.hasOwnProperty(query.script)) {
    this.getScriptFeatures(query.script);
  }

  const scriptFeatures = this.features[query.script];
  if (!scriptFeatures) return {
    FAIL: `No feature for script ${query.script}`
  };
  if (!scriptFeatures.tags[query.tag]) return null;
  return this.features[query.script].tags[query.tag];
};

var _default = FeatureQuery;
exports.default = _default;
},{"../tokenizer":"../node_modules/opentype.js/src/tokenizer.js","../char":"../node_modules/opentype.js/src/char.js"}],"../node_modules/opentype.js/src/features/arab/contextCheck/arabicWord.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _char = require("../../../char");

/**
 * Arabic word context checkers
 */
function arabicWordStartCheck(contextParams) {
  const char = contextParams.current;
  const prevChar = contextParams.get(-1);
  return (// ? arabic first char
    prevChar === null && (0, _char.isArabicChar)(char) || // ? arabic char preceded with a non arabic char
    !(0, _char.isArabicChar)(prevChar) && (0, _char.isArabicChar)(char)
  );
}

function arabicWordEndCheck(contextParams) {
  const nextChar = contextParams.get(1);
  return (// ? last arabic char
    nextChar === null || // ? next char is not arabic
    !(0, _char.isArabicChar)(nextChar)
  );
}

var _default = {
  startCheck: arabicWordStartCheck,
  endCheck: arabicWordEndCheck
};
exports.default = _default;
},{"../../../char":"../node_modules/opentype.js/src/char.js"}],"../node_modules/opentype.js/src/features/arab/contextCheck/arabicSentence.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _char = require("../../../char");

/**
 * Arabic sentence context checkers
 */
function arabicSentenceStartCheck(contextParams) {
  const char = contextParams.current;
  const prevChar = contextParams.get(-1);
  return (// ? an arabic char preceded with a non arabic char
    ((0, _char.isArabicChar)(char) || (0, _char.isTashkeelArabicChar)(char)) && !(0, _char.isArabicChar)(prevChar)
  );
}

function arabicSentenceEndCheck(contextParams) {
  const nextChar = contextParams.get(1);

  switch (true) {
    case nextChar === null:
      return true;

    case !(0, _char.isArabicChar)(nextChar) && !(0, _char.isTashkeelArabicChar)(nextChar):
      const nextIsWhitespace = (0, _char.isWhiteSpace)(nextChar);
      if (!nextIsWhitespace) return true;

      if (nextIsWhitespace) {
        let arabicCharAhead = false;
        arabicCharAhead = contextParams.lookahead.some(c => (0, _char.isArabicChar)(c) || (0, _char.isTashkeelArabicChar)(c));
        if (!arabicCharAhead) return true;
      }

      break;

    default:
      return false;
  }
}

var _default = {
  startCheck: arabicSentenceStartCheck,
  endCheck: arabicSentenceEndCheck
};
exports.default = _default;
},{"../../../char":"../node_modules/opentype.js/src/char.js"}],"../node_modules/opentype.js/src/features/applySubstitution.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _featureQuery = require("./featureQuery");

/**
 * Apply single substitution format 1
 * @param {Array} substitutions substitutions
 * @param {any} tokens a list of tokens
 * @param {number} index token index
 */
function singleSubstitutionFormat1(action, tokens, index) {
  tokens[index].setState(action.tag, action.substitution);
}
/**
 * Apply single substitution format 2
 * @param {Array} substitutions substitutions
 * @param {any} tokens a list of tokens
 * @param {number} index token index
 */


function singleSubstitutionFormat2(action, tokens, index) {
  tokens[index].setState(action.tag, action.substitution);
}
/**
 * Apply chaining context substitution format 3
 * @param {Array} substitutions substitutions
 * @param {any} tokens a list of tokens
 * @param {number} index token index
 */


function chainingSubstitutionFormat3(action, tokens, index) {
  action.substitution.forEach((subst, offset) => {
    const token = tokens[index + offset];
    token.setState(action.tag, subst);
  });
}
/**
 * Apply ligature substitution format 1
 * @param {Array} substitutions substitutions
 * @param {any} tokens a list of tokens
 * @param {number} index token index
 */


function ligatureSubstitutionFormat1(action, tokens, index) {
  let token = tokens[index];
  token.setState(action.tag, action.substitution.ligGlyph);
  const compsCount = action.substitution.components.length;

  for (let i = 0; i < compsCount; i++) {
    token = tokens[index + i + 1];
    token.setState('deleted', true);
  }
}
/**
 * Supported substitutions
 */


const SUBSTITUTIONS = {
  11: singleSubstitutionFormat1,
  12: singleSubstitutionFormat2,
  63: chainingSubstitutionFormat3,
  41: ligatureSubstitutionFormat1
};
/**
 * Apply substitutions to a list of tokens
 * @param {Array} substitutions substitutions
 * @param {any} tokens a list of tokens
 * @param {number} index token index
 */

function applySubstitution(action, tokens, index) {
  if (action instanceof _featureQuery.SubstitutionAction) {
    SUBSTITUTIONS[action.id](action, tokens, index);
  }
}

var _default = applySubstitution;
exports.default = _default;
},{"./featureQuery":"../node_modules/opentype.js/src/features/featureQuery.js"}],"../node_modules/opentype.js/src/features/arab/arabicPresentationForms.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arabicPresentationForms = arabicPresentationForms;
exports.default = void 0;

var _tokenizer = require("../../tokenizer");

var _char = require("../../char");

var _featureQuery = require("../featureQuery");

var _applySubstitution = _interopRequireDefault(require("../applySubstitution"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Apply Arabic presentation forms to a range of tokens
 */

/**
 * Check if a char can be connected to it's preceding char
 * @param {ContextParams} charContextParams context params of a char
 */
function willConnectPrev(charContextParams) {
  let backtrack = [].concat(charContextParams.backtrack);

  for (let i = backtrack.length - 1; i >= 0; i--) {
    const prevChar = backtrack[i];
    const isolated = (0, _char.isIsolatedArabicChar)(prevChar);
    const tashkeel = (0, _char.isTashkeelArabicChar)(prevChar);
    if (!isolated && !tashkeel) return true;
    if (isolated) return false;
  }

  return false;
}
/**
 * Check if a char can be connected to it's proceeding char
 * @param {ContextParams} charContextParams context params of a char
 */


function willConnectNext(charContextParams) {
  if ((0, _char.isIsolatedArabicChar)(charContextParams.current)) return false;

  for (let i = 0; i < charContextParams.lookahead.length; i++) {
    const nextChar = charContextParams.lookahead[i];
    const tashkeel = (0, _char.isTashkeelArabicChar)(nextChar);
    if (!tashkeel) return true;
  }

  return false;
}
/**
 * Apply arabic presentation forms to a list of tokens
 * @param {ContextRange} range a range of tokens
 */


function arabicPresentationForms(range) {
  const script = 'arab';
  const tags = this.featuresTags[script];
  const tokens = this.tokenizer.getRangeTokens(range);
  if (tokens.length === 1) return;
  let contextParams = new _tokenizer.ContextParams(tokens.map(token => token.getState('glyphIndex')), 0);
  const charContextParams = new _tokenizer.ContextParams(tokens.map(token => token.char), 0);
  tokens.forEach((token, index) => {
    if ((0, _char.isTashkeelArabicChar)(token.char)) return;
    contextParams.setCurrentIndex(index);
    charContextParams.setCurrentIndex(index);
    let CONNECT = 0; // 2 bits 00 (10: can connect next) (01: can connect prev)

    if (willConnectPrev(charContextParams)) CONNECT |= 1;
    if (willConnectNext(charContextParams)) CONNECT |= 2;
    let tag;

    switch (CONNECT) {
      case 1:
        tag = 'fina';
        break;

      case 2:
        tag = 'init';
        break;

      case 3:
        tag = 'medi';
        break;
    }

    if (tags.indexOf(tag) === -1) return;
    let substitutions = this.query.lookupFeature({
      tag,
      script,
      contextParams
    });
    if (substitutions instanceof Error) return console.info(substitutions.message);
    substitutions.forEach((action, index) => {
      if (action instanceof _featureQuery.SubstitutionAction) {
        (0, _applySubstitution.default)(action, tokens, index);
        contextParams.context[index] = action.substitution;
      }
    });
  });
}

var _default = arabicPresentationForms;
exports.default = _default;
},{"../../tokenizer":"../node_modules/opentype.js/src/tokenizer.js","../../char":"../node_modules/opentype.js/src/char.js","../featureQuery":"../node_modules/opentype.js/src/features/featureQuery.js","../applySubstitution":"../node_modules/opentype.js/src/features/applySubstitution.js"}],"../node_modules/opentype.js/src/features/arab/arabicRequiredLigatures.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arabicRequiredLigatures = arabicRequiredLigatures;
exports.default = void 0;

var _tokenizer = require("../../tokenizer");

var _applySubstitution = _interopRequireDefault(require("../applySubstitution"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Apply Arabic required ligatures feature to a range of tokens
 */

/**
 * Update context params
 * @param {any} tokens a list of tokens
 * @param {number} index current item index
 */
function getContextParams(tokens, index) {
  const context = tokens.map(token => token.activeState.value);
  return new _tokenizer.ContextParams(context, index || 0);
}
/**
 * Apply Arabic required ligatures to a context range
 * @param {ContextRange} range a range of tokens
 */


function arabicRequiredLigatures(range) {
  const script = 'arab';
  let tokens = this.tokenizer.getRangeTokens(range);
  let contextParams = getContextParams(tokens);
  contextParams.context.forEach((glyphIndex, index) => {
    contextParams.setCurrentIndex(index);
    let substitutions = this.query.lookupFeature({
      tag: 'rlig',
      script,
      contextParams
    });

    if (substitutions.length) {
      substitutions.forEach(action => (0, _applySubstitution.default)(action, tokens, index));
      contextParams = getContextParams(tokens);
    }
  });
}

var _default = arabicRequiredLigatures;
exports.default = _default;
},{"../../tokenizer":"../node_modules/opentype.js/src/tokenizer.js","../applySubstitution":"../node_modules/opentype.js/src/features/applySubstitution.js"}],"../node_modules/opentype.js/src/features/latn/contextCheck/latinWord.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _char = require("../../../char");

/**
 * Latin word context checkers
 */
function latinWordStartCheck(contextParams) {
  const char = contextParams.current;
  const prevChar = contextParams.get(-1);
  return (// ? latin first char
    prevChar === null && (0, _char.isLatinChar)(char) || // ? latin char preceded with a non latin char
    !(0, _char.isLatinChar)(prevChar) && (0, _char.isLatinChar)(char)
  );
}

function latinWordEndCheck(contextParams) {
  const nextChar = contextParams.get(1);
  return (// ? last latin char
    nextChar === null || // ? next char is not latin
    !(0, _char.isLatinChar)(nextChar)
  );
}

var _default = {
  startCheck: latinWordStartCheck,
  endCheck: latinWordEndCheck
};
exports.default = _default;
},{"../../../char":"../node_modules/opentype.js/src/char.js"}],"../node_modules/opentype.js/src/features/latn/latinLigatures.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tokenizer = require("../../tokenizer");

var _applySubstitution = _interopRequireDefault(require("../applySubstitution"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Apply Latin ligature feature to a range of tokens
 */

/**
 * Update context params
 * @param {any} tokens a list of tokens
 * @param {number} index current item index
 */
function getContextParams(tokens, index) {
  const context = tokens.map(token => token.activeState.value);
  return new _tokenizer.ContextParams(context, index || 0);
}
/**
 * Apply Arabic required ligatures to a context range
 * @param {ContextRange} range a range of tokens
 */


function latinLigature(range) {
  const script = 'latn';
  let tokens = this.tokenizer.getRangeTokens(range);
  let contextParams = getContextParams(tokens);
  contextParams.context.forEach((glyphIndex, index) => {
    contextParams.setCurrentIndex(index);
    let substitutions = this.query.lookupFeature({
      tag: 'liga',
      script,
      contextParams
    });

    if (substitutions.length) {
      substitutions.forEach(action => (0, _applySubstitution.default)(action, tokens, index));
      contextParams = getContextParams(tokens);
    }
  });
}

var _default = latinLigature;
exports.default = _default;
},{"../../tokenizer":"../node_modules/opentype.js/src/tokenizer.js","../applySubstitution":"../node_modules/opentype.js/src/features/applySubstitution.js"}],"../node_modules/opentype.js/src/bidi.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tokenizer = _interopRequireDefault(require("./tokenizer"));

var _featureQuery = _interopRequireDefault(require("./features/featureQuery"));

var _arabicWord = _interopRequireDefault(require("./features/arab/contextCheck/arabicWord"));

var _arabicSentence = _interopRequireDefault(require("./features/arab/contextCheck/arabicSentence"));

var _arabicPresentationForms = _interopRequireDefault(require("./features/arab/arabicPresentationForms"));

var _arabicRequiredLigatures = _interopRequireDefault(require("./features/arab/arabicRequiredLigatures"));

var _latinWord = _interopRequireDefault(require("./features/latn/contextCheck/latinWord"));

var _latinLigatures = _interopRequireDefault(require("./features/latn/latinLigatures"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Infer bidirectional properties for a given text and apply
 * the corresponding layout rules.
 */

/**
 * Create Bidi. features
 * @param {string} baseDir text base direction. value either 'ltr' or 'rtl'
 */
function Bidi(baseDir) {
  this.baseDir = baseDir || 'ltr';
  this.tokenizer = new _tokenizer.default();
  this.featuresTags = {};
}
/**
 * Sets Bidi text
 * @param {string} text a text input
 */


Bidi.prototype.setText = function (text) {
  this.text = text;
};
/**
 * Store essential context checks:
 * arabic word check for applying gsub features
 * arabic sentence check for adjusting arabic layout
 */


Bidi.prototype.contextChecks = {
  latinWordCheck: _latinWord.default,
  arabicWordCheck: _arabicWord.default,
  arabicSentenceCheck: _arabicSentence.default
};
/**
 * Register arabic word check
 */

function registerContextChecker(checkId) {
  const check = this.contextChecks[`${checkId}Check`];
  return this.tokenizer.registerContextChecker(checkId, check.startCheck, check.endCheck);
}
/**
 * Perform pre tokenization procedure then
 * tokenize text input
 */


function tokenizeText() {
  registerContextChecker.call(this, 'latinWord');
  registerContextChecker.call(this, 'arabicWord');
  registerContextChecker.call(this, 'arabicSentence');
  return this.tokenizer.tokenize(this.text);
}
/**
 * Reverse arabic sentence layout
 * TODO: check base dir before applying adjustments - priority low
 */


function reverseArabicSentences() {
  const ranges = this.tokenizer.getContextRanges('arabicSentence');
  ranges.forEach(range => {
    let rangeTokens = this.tokenizer.getRangeTokens(range);
    this.tokenizer.replaceRange(range.startIndex, range.endOffset, rangeTokens.reverse());
  });
}
/**
 * Register supported features tags
 * @param {script} script script tag
 * @param {Array} tags features tags list
 */


Bidi.prototype.registerFeatures = function (script, tags) {
  const supportedTags = tags.filter(tag => this.query.supports({
    script,
    tag
  }));

  if (!this.featuresTags.hasOwnProperty(script)) {
    this.featuresTags[script] = supportedTags;
  } else {
    this.featuresTags[script] = this.featuresTags[script].concat(supportedTags);
  }
};
/**
 * Apply GSUB features
 * @param {Array} tagsList a list of features tags
 * @param {string} script a script tag
 * @param {Font} font opentype font instance
 */


Bidi.prototype.applyFeatures = function (font, features) {
  if (!font) throw new Error('No valid font was provided to apply features');
  if (!this.query) this.query = new _featureQuery.default(font);

  for (let f = 0; f < features.length; f++) {
    const feature = features[f];
    if (!this.query.supports({
      script: feature.script
    })) continue;
    this.registerFeatures(feature.script, feature.tags);
  }
};
/**
 * Register a state modifier
 * @param {string} modifierId state modifier id
 * @param {function} condition a predicate function that returns true or false
 * @param {function} modifier a modifier function to set token state
 */


Bidi.prototype.registerModifier = function (modifierId, condition, modifier) {
  this.tokenizer.registerModifier(modifierId, condition, modifier);
};
/**
 * Check if 'glyphIndex' is registered
 */


function checkGlyphIndexStatus() {
  if (this.tokenizer.registeredModifiers.indexOf('glyphIndex') === -1) {
    throw new Error('glyphIndex modifier is required to apply ' + 'arabic presentation features.');
  }
}
/**
 * Apply arabic presentation forms features
 */


function applyArabicPresentationForms() {
  const script = 'arab';
  if (!this.featuresTags.hasOwnProperty(script)) return;
  checkGlyphIndexStatus.call(this);
  const ranges = this.tokenizer.getContextRanges('arabicWord');
  ranges.forEach(range => {
    _arabicPresentationForms.default.call(this, range);
  });
}
/**
 * Apply required arabic ligatures
 */


function applyArabicRequireLigatures() {
  const script = 'arab';
  if (!this.featuresTags.hasOwnProperty(script)) return;
  const tags = this.featuresTags[script];
  if (tags.indexOf('rlig') === -1) return;
  checkGlyphIndexStatus.call(this);
  const ranges = this.tokenizer.getContextRanges('arabicWord');
  ranges.forEach(range => {
    _arabicRequiredLigatures.default.call(this, range);
  });
}
/**
 * Apply required arabic ligatures
 */


function applyLatinLigatures() {
  const script = 'latn';
  if (!this.featuresTags.hasOwnProperty(script)) return;
  const tags = this.featuresTags[script];
  if (tags.indexOf('liga') === -1) return;
  checkGlyphIndexStatus.call(this);
  const ranges = this.tokenizer.getContextRanges('latinWord');
  ranges.forEach(range => {
    _latinLigatures.default.call(this, range);
  });
}
/**
 * Check if a context is registered
 * @param {string} contextId context id
 */


Bidi.prototype.checkContextReady = function (contextId) {
  return !!this.tokenizer.getContext(contextId);
};
/**
 * Apply features to registered contexts
 */


Bidi.prototype.applyFeaturesToContexts = function () {
  if (this.checkContextReady('arabicWord')) {
    applyArabicPresentationForms.call(this);
    applyArabicRequireLigatures.call(this);
  }

  if (this.checkContextReady('latinWord')) {
    applyLatinLigatures.call(this);
  }

  if (this.checkContextReady('arabicSentence')) {
    reverseArabicSentences.call(this);
  }
};
/**
 * process text input
 * @param {string} text an input text
 */


Bidi.prototype.processText = function (text) {
  if (!this.text || this.text !== text) {
    this.setText(text);
    tokenizeText.call(this);
    this.applyFeaturesToContexts();
  }
};
/**
 * Process a string of text to identify and adjust
 * bidirectional text entities.
 * @param {string} text input text
 */


Bidi.prototype.getBidiText = function (text) {
  this.processText(text);
  return this.tokenizer.getText();
};
/**
 * Get the current state index of each token
 * @param {text} text an input text
 */


Bidi.prototype.getTextGlyphs = function (text) {
  this.processText(text);
  let indexes = [];

  for (let i = 0; i < this.tokenizer.tokens.length; i++) {
    const token = this.tokenizer.tokens[i];
    if (token.state.deleted) continue;
    const index = token.activeState.value;
    indexes.push(Array.isArray(index) ? index[0] : index);
  }

  return indexes;
};

var _default = Bidi;
exports.default = _default;
},{"./tokenizer":"../node_modules/opentype.js/src/tokenizer.js","./features/featureQuery":"../node_modules/opentype.js/src/features/featureQuery.js","./features/arab/contextCheck/arabicWord":"../node_modules/opentype.js/src/features/arab/contextCheck/arabicWord.js","./features/arab/contextCheck/arabicSentence":"../node_modules/opentype.js/src/features/arab/contextCheck/arabicSentence.js","./features/arab/arabicPresentationForms":"../node_modules/opentype.js/src/features/arab/arabicPresentationForms.js","./features/arab/arabicRequiredLigatures":"../node_modules/opentype.js/src/features/arab/arabicRequiredLigatures.js","./features/latn/contextCheck/latinWord":"../node_modules/opentype.js/src/features/latn/contextCheck/latinWord.js","./features/latn/latinLigatures":"../node_modules/opentype.js/src/features/latn/latinLigatures.js"}],"../node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"../node_modules/opentype.js/src/font.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("./path"));

var _sfnt = _interopRequireDefault(require("./tables/sfnt"));

var _encoding = require("./encoding");

var _glyphset = _interopRequireDefault(require("./glyphset"));

var _position = _interopRequireDefault(require("./position"));

var _substitution = _interopRequireDefault(require("./substitution"));

var _util = require("./util");

var _hintingtt = _interopRequireDefault(require("./hintingtt"));

var _bidi = _interopRequireDefault(require("./bidi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The Font object

/**
 * @typedef FontOptions
 * @type Object
 * @property {Boolean} empty - whether to create a new empty font
 * @property {string} familyName
 * @property {string} styleName
 * @property {string=} fullName
 * @property {string=} postScriptName
 * @property {string=} designer
 * @property {string=} designerURL
 * @property {string=} manufacturer
 * @property {string=} manufacturerURL
 * @property {string=} license
 * @property {string=} licenseURL
 * @property {string=} version
 * @property {string=} description
 * @property {string=} copyright
 * @property {string=} trademark
 * @property {Number} unitsPerEm
 * @property {Number} ascender
 * @property {Number} descender
 * @property {Number} createdTimestamp
 * @property {string=} weightClass
 * @property {string=} widthClass
 * @property {string=} fsSelection
 */

/**
 * A Font represents a loaded OpenType font file.
 * It contains a set of glyphs and methods to draw text on a drawing context,
 * or to get a path representing the text.
 * @exports opentype.Font
 * @class
 * @param {FontOptions}
 * @constructor
 */
function Font(options) {
  options = options || {};

  if (!options.empty) {
    // Check that we've provided the minimum set of names.
    (0, _util.checkArgument)(options.familyName, 'When creating a new Font object, familyName is required.');
    (0, _util.checkArgument)(options.styleName, 'When creating a new Font object, styleName is required.');
    (0, _util.checkArgument)(options.unitsPerEm, 'When creating a new Font object, unitsPerEm is required.');
    (0, _util.checkArgument)(options.ascender, 'When creating a new Font object, ascender is required.');
    (0, _util.checkArgument)(options.descender, 'When creating a new Font object, descender is required.');
    (0, _util.checkArgument)(options.descender < 0, 'Descender should be negative (e.g. -512).'); // OS X will complain if the names are empty, so we put a single space everywhere by default.

    this.names = {
      fontFamily: {
        en: options.familyName || ' '
      },
      fontSubfamily: {
        en: options.styleName || ' '
      },
      fullName: {
        en: options.fullName || options.familyName + ' ' + options.styleName
      },
      // postScriptName may not contain any whitespace
      postScriptName: {
        en: options.postScriptName || (options.familyName + options.styleName).replace(/\s/g, '')
      },
      designer: {
        en: options.designer || ' '
      },
      designerURL: {
        en: options.designerURL || ' '
      },
      manufacturer: {
        en: options.manufacturer || ' '
      },
      manufacturerURL: {
        en: options.manufacturerURL || ' '
      },
      license: {
        en: options.license || ' '
      },
      licenseURL: {
        en: options.licenseURL || ' '
      },
      version: {
        en: options.version || 'Version 0.1'
      },
      description: {
        en: options.description || ' '
      },
      copyright: {
        en: options.copyright || ' '
      },
      trademark: {
        en: options.trademark || ' '
      }
    };
    this.unitsPerEm = options.unitsPerEm || 1000;
    this.ascender = options.ascender;
    this.descender = options.descender;
    this.createdTimestamp = options.createdTimestamp;
    this.tables = {
      os2: {
        usWeightClass: options.weightClass || this.usWeightClasses.MEDIUM,
        usWidthClass: options.widthClass || this.usWidthClasses.MEDIUM,
        fsSelection: options.fsSelection || this.fsSelectionValues.REGULAR
      }
    };
  }

  this.supported = true; // Deprecated: parseBuffer will throw an error if font is not supported.

  this.glyphs = new _glyphset.default.GlyphSet(this, options.glyphs || []);
  this.encoding = new _encoding.DefaultEncoding(this);
  this.position = new _position.default(this);
  this.substitution = new _substitution.default(this);
  this.tables = this.tables || {}; // needed for low memory mode only.

  this._push = null;
  this._hmtxTableData = {};
  Object.defineProperty(this, 'hinting', {
    get: function () {
      if (this._hinting) return this._hinting;

      if (this.outlinesFormat === 'truetype') {
        return this._hinting = new _hintingtt.default(this);
      }
    }
  });
}
/**
 * Check if the font has a glyph for the given character.
 * @param  {string}
 * @return {Boolean}
 */


Font.prototype.hasChar = function (c) {
  return this.encoding.charToGlyphIndex(c) !== null;
};
/**
 * Convert the given character to a single glyph index.
 * Note that this function assumes that there is a one-to-one mapping between
 * the given character and a glyph; for complex scripts this might not be the case.
 * @param  {string}
 * @return {Number}
 */


Font.prototype.charToGlyphIndex = function (s) {
  return this.encoding.charToGlyphIndex(s);
};
/**
 * Convert the given character to a single Glyph object.
 * Note that this function assumes that there is a one-to-one mapping between
 * the given character and a glyph; for complex scripts this might not be the case.
 * @param  {string}
 * @return {opentype.Glyph}
 */


Font.prototype.charToGlyph = function (c) {
  const glyphIndex = this.charToGlyphIndex(c);
  let glyph = this.glyphs.get(glyphIndex);

  if (!glyph) {
    // .notdef
    glyph = this.glyphs.get(0);
  }

  return glyph;
};
/**
 * Update features
 * @param {any} options features options
 */


Font.prototype.updateFeatures = function (options) {
  // TODO: update all features options not only 'latn'.
  return this.defaultRenderOptions.features.map(feature => {
    if (feature.script === 'latn') {
      return {
        script: 'latn',
        tags: feature.tags.filter(tag => options[tag])
      };
    } else {
      return feature;
    }
  });
};
/**
 * Convert the given text to a list of Glyph objects.
 * Note that there is no strict one-to-one mapping between characters and
 * glyphs, so the list of returned glyphs can be larger or smaller than the
 * length of the given string.
 * @param  {string}
 * @param  {GlyphRenderOptions} [options]
 * @return {opentype.Glyph[]}
 */


Font.prototype.stringToGlyphs = function (s, options) {
  const bidi = new _bidi.default(); // Create and register 'glyphIndex' state modifier

  const charToGlyphIndexMod = token => this.charToGlyphIndex(token.char);

  bidi.registerModifier('glyphIndex', null, charToGlyphIndexMod); // roll-back to default features

  let features = options ? this.updateFeatures(options.features) : this.defaultRenderOptions.features;
  bidi.applyFeatures(this, features);
  const indexes = bidi.getTextGlyphs(s);
  let length = indexes.length; // convert glyph indexes to glyph objects

  const glyphs = new Array(length);
  const notdef = this.glyphs.get(0);

  for (let i = 0; i < length; i += 1) {
    glyphs[i] = this.glyphs.get(indexes[i]) || notdef;
  }

  return glyphs;
};
/**
 * @param  {string}
 * @return {Number}
 */


Font.prototype.nameToGlyphIndex = function (name) {
  return this.glyphNames.nameToGlyphIndex(name);
};
/**
 * @param  {string}
 * @return {opentype.Glyph}
 */


Font.prototype.nameToGlyph = function (name) {
  const glyphIndex = this.nameToGlyphIndex(name);
  let glyph = this.glyphs.get(glyphIndex);

  if (!glyph) {
    // .notdef
    glyph = this.glyphs.get(0);
  }

  return glyph;
};
/**
 * @param  {Number}
 * @return {String}
 */


Font.prototype.glyphIndexToName = function (gid) {
  if (!this.glyphNames.glyphIndexToName) {
    return '';
  }

  return this.glyphNames.glyphIndexToName(gid);
};
/**
 * Retrieve the value of the kerning pair between the left glyph (or its index)
 * and the right glyph (or its index). If no kerning pair is found, return 0.
 * The kerning value gets added to the advance width when calculating the spacing
 * between glyphs.
 * For GPOS kerning, this method uses the default script and language, which covers
 * most use cases. To have greater control, use font.position.getKerningValue .
 * @param  {opentype.Glyph} leftGlyph
 * @param  {opentype.Glyph} rightGlyph
 * @return {Number}
 */


Font.prototype.getKerningValue = function (leftGlyph, rightGlyph) {
  leftGlyph = leftGlyph.index || leftGlyph;
  rightGlyph = rightGlyph.index || rightGlyph;
  const gposKerning = this.position.defaultKerningTables;

  if (gposKerning) {
    return this.position.getKerningValue(gposKerning, leftGlyph, rightGlyph);
  } // "kern" table


  return this.kerningPairs[leftGlyph + ',' + rightGlyph] || 0;
};
/**
 * @typedef GlyphRenderOptions
 * @type Object
 * @property {string} [script] - script used to determine which features to apply. By default, 'DFLT' or 'latn' is used.
 *                               See https://www.microsoft.com/typography/otspec/scripttags.htm
 * @property {string} [language='dflt'] - language system used to determine which features to apply.
 *                                        See https://www.microsoft.com/typography/developers/opentype/languagetags.aspx
 * @property {boolean} [kerning=true] - whether to include kerning values
 * @property {object} [features] - OpenType Layout feature tags. Used to enable or disable the features of the given script/language system.
 *                                 See https://www.microsoft.com/typography/otspec/featuretags.htm
 */


Font.prototype.defaultRenderOptions = {
  kerning: true,
  features: [
  /**
   * these 4 features are required to render Arabic text properly
   * and shouldn't be turned off when rendering arabic text.
   */
  {
    script: 'arab',
    tags: ['init', 'medi', 'fina', 'rlig']
  }, {
    script: 'latn',
    tags: ['liga', 'rlig']
  }]
};
/**
 * Helper function that invokes the given callback for each glyph in the given text.
 * The callback gets `(glyph, x, y, fontSize, options)`.* @param  {string} text
 * @param {string} text - The text to apply.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 * @param  {Function} callback
 */

Font.prototype.forEachGlyph = function (text, x, y, fontSize, options, callback) {
  x = x !== undefined ? x : 0;
  y = y !== undefined ? y : 0;
  fontSize = fontSize !== undefined ? fontSize : 72;
  options = options || this.defaultRenderOptions;
  const fontScale = 1 / this.unitsPerEm * fontSize;
  const glyphs = this.stringToGlyphs(text, options);
  let kerningLookups;

  if (options.kerning) {
    const script = options.script || this.position.getDefaultScriptName();
    kerningLookups = this.position.getKerningTables(script, options.language);
  }

  for (let i = 0; i < glyphs.length; i += 1) {
    const glyph = glyphs[i];
    callback.call(this, glyph, x, y, fontSize, options);

    if (glyph.advanceWidth) {
      x += glyph.advanceWidth * fontScale;
    }

    if (options.kerning && i < glyphs.length - 1) {
      // We should apply position adjustment lookups in a more generic way.
      // Here we only use the xAdvance value.
      const kerningValue = kerningLookups ? this.position.getKerningValue(kerningLookups, glyph.index, glyphs[i + 1].index) : this.getKerningValue(glyph, glyphs[i + 1]);
      x += kerningValue * fontScale;
    }

    if (options.letterSpacing) {
      x += options.letterSpacing * fontSize;
    } else if (options.tracking) {
      x += options.tracking / 1000 * fontSize;
    }
  }

  return x;
};
/**
 * Create a Path object that represents the given text.
 * @param  {string} text - The text to create.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 * @return {opentype.Path}
 */


Font.prototype.getPath = function (text, x, y, fontSize, options) {
  const fullPath = new _path.default();
  this.forEachGlyph(text, x, y, fontSize, options, function (glyph, gX, gY, gFontSize) {
    const glyphPath = glyph.getPath(gX, gY, gFontSize, options, this);
    fullPath.extend(glyphPath);
  });
  return fullPath;
};
/**
 * Create an array of Path objects that represent the glyphs of a given text.
 * @param  {string} text - The text to create.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 * @return {opentype.Path[]}
 */


Font.prototype.getPaths = function (text, x, y, fontSize, options) {
  const glyphPaths = [];
  this.forEachGlyph(text, x, y, fontSize, options, function (glyph, gX, gY, gFontSize) {
    const glyphPath = glyph.getPath(gX, gY, gFontSize, options, this);
    glyphPaths.push(glyphPath);
  });
  return glyphPaths;
};
/**
 * Returns the advance width of a text.
 *
 * This is something different than Path.getBoundingBox() as for example a
 * suffixed whitespace increases the advanceWidth but not the bounding box
 * or an overhanging letter like a calligraphic 'f' might have a quite larger
 * bounding box than its advance width.
 *
 * This corresponds to canvas2dContext.measureText(text).width
 *
 * @param  {string} text - The text to create.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 * @return advance width
 */


Font.prototype.getAdvanceWidth = function (text, fontSize, options) {
  return this.forEachGlyph(text, 0, 0, fontSize, options, function () {});
};
/**
 * Draw the text on the given drawing context.
 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param  {string} text - The text to create.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 */


Font.prototype.draw = function (ctx, text, x, y, fontSize, options) {
  this.getPath(text, x, y, fontSize, options).draw(ctx);
};
/**
 * Draw the points of all glyphs in the text.
 * On-curve points will be drawn in blue, off-curve points will be drawn in red.
 * @param {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param {string} text - The text to create.
 * @param {number} [x=0] - Horizontal position of the beginning of the text.
 * @param {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param {GlyphRenderOptions=} options
 */


Font.prototype.drawPoints = function (ctx, text, x, y, fontSize, options) {
  this.forEachGlyph(text, x, y, fontSize, options, function (glyph, gX, gY, gFontSize) {
    glyph.drawPoints(ctx, gX, gY, gFontSize);
  });
};
/**
 * Draw lines indicating important font measurements for all glyphs in the text.
 * Black lines indicate the origin of the coordinate system (point 0,0).
 * Blue lines indicate the glyph bounding box.
 * Green line indicates the advance width of the glyph.
 * @param {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param {string} text - The text to create.
 * @param {number} [x=0] - Horizontal position of the beginning of the text.
 * @param {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param {GlyphRenderOptions=} options
 */


Font.prototype.drawMetrics = function (ctx, text, x, y, fontSize, options) {
  this.forEachGlyph(text, x, y, fontSize, options, function (glyph, gX, gY, gFontSize) {
    glyph.drawMetrics(ctx, gX, gY, gFontSize);
  });
};
/**
 * @param  {string}
 * @return {string}
 */


Font.prototype.getEnglishName = function (name) {
  const translations = this.names[name];

  if (translations) {
    return translations.en;
  }
};
/**
 * Validate
 */


Font.prototype.validate = function () {
  const warnings = [];

  const _this = this;

  function assert(predicate, message) {
    if (!predicate) {
      warnings.push(message);
    }
  }

  function assertNamePresent(name) {
    const englishName = _this.getEnglishName(name);

    assert(englishName && englishName.trim().length > 0, 'No English ' + name + ' specified.');
  } // Identification information


  assertNamePresent('fontFamily');
  assertNamePresent('weightName');
  assertNamePresent('manufacturer');
  assertNamePresent('copyright');
  assertNamePresent('version'); // Dimension information

  assert(this.unitsPerEm > 0, 'No unitsPerEm specified.');
};
/**
 * Convert the font object to a SFNT data structure.
 * This structure contains all the necessary tables and metadata to create a binary OTF file.
 * @return {opentype.Table}
 */


Font.prototype.toTables = function () {
  return _sfnt.default.fontToTable(this);
};
/**
 * @deprecated Font.toBuffer is deprecated. Use Font.toArrayBuffer instead.
 */


Font.prototype.toBuffer = function () {
  console.warn('Font.toBuffer is deprecated. Use Font.toArrayBuffer instead.');
  return this.toArrayBuffer();
};
/**
 * Converts a `opentype.Font` into an `ArrayBuffer`
 * @return {ArrayBuffer}
 */


Font.prototype.toArrayBuffer = function () {
  const sfntTable = this.toTables();
  const bytes = sfntTable.encode();
  const buffer = new ArrayBuffer(bytes.length);
  const intArray = new Uint8Array(buffer);

  for (let i = 0; i < bytes.length; i++) {
    intArray[i] = bytes[i];
  }

  return buffer;
};
/**
 * Initiate a download of the OpenType font.
 */


Font.prototype.download = function (fileName) {
  const familyName = this.getEnglishName('fontFamily');
  const styleName = this.getEnglishName('fontSubfamily');
  fileName = fileName || familyName.replace(/\s/g, '') + '-' + styleName + '.otf';
  const arrayBuffer = this.toArrayBuffer();

  if ((0, _util.isBrowser)()) {
    window.URL = window.URL || window.webkitURL;

    if (window.URL) {
      const dataView = new DataView(arrayBuffer);
      const blob = new Blob([dataView], {
        type: 'font/opentype'
      });
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      let event = document.createEvent('MouseEvents');
      event.initEvent('click', true, false);
      link.dispatchEvent(event);
    } else {
      console.warn('Font file could not be downloaded. Try using a different browser.');
    }
  } else {
    const fs = require('fs');

    const buffer = (0, _util.arrayBufferToNodeBuffer)(arrayBuffer);
    fs.writeFileSync(fileName, buffer);
  }
};
/**
 * @private
 */


Font.prototype.fsSelectionValues = {
  ITALIC: 0x001,
  //1
  UNDERSCORE: 0x002,
  //2
  NEGATIVE: 0x004,
  //4
  OUTLINED: 0x008,
  //8
  STRIKEOUT: 0x010,
  //16
  BOLD: 0x020,
  //32
  REGULAR: 0x040,
  //64
  USER_TYPO_METRICS: 0x080,
  //128
  WWS: 0x100,
  //256
  OBLIQUE: 0x200 //512

};
/**
 * @private
 */

Font.prototype.usWidthClasses = {
  ULTRA_CONDENSED: 1,
  EXTRA_CONDENSED: 2,
  CONDENSED: 3,
  SEMI_CONDENSED: 4,
  MEDIUM: 5,
  SEMI_EXPANDED: 6,
  EXPANDED: 7,
  EXTRA_EXPANDED: 8,
  ULTRA_EXPANDED: 9
};
/**
 * @private
 */

Font.prototype.usWeightClasses = {
  THIN: 100,
  EXTRA_LIGHT: 200,
  LIGHT: 300,
  NORMAL: 400,
  MEDIUM: 500,
  SEMI_BOLD: 600,
  BOLD: 700,
  EXTRA_BOLD: 800,
  BLACK: 900
};
var _default = Font;
exports.default = _default;
},{"./path":"../node_modules/opentype.js/src/path.js","./tables/sfnt":"../node_modules/opentype.js/src/tables/sfnt.js","./encoding":"../node_modules/opentype.js/src/encoding.js","./glyphset":"../node_modules/opentype.js/src/glyphset.js","./position":"../node_modules/opentype.js/src/position.js","./substitution":"../node_modules/opentype.js/src/substitution.js","./util":"../node_modules/opentype.js/src/util.js","./hintingtt":"../node_modules/opentype.js/src/hintingtt.js","./bidi":"../node_modules/opentype.js/src/bidi.js","fs":"../node_modules/parcel-bundler/src/builtins/_empty.js"}],"../node_modules/opentype.js/src/tables/fvar.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _check = _interopRequireDefault(require("../check"));

var _parse = _interopRequireDefault(require("../parse"));

var _table = _interopRequireDefault(require("../table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The `fvar` table stores font variation axes and instances.
// https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6fvar.html
function addName(name, names) {
  const nameString = JSON.stringify(name);
  let nameID = 256;

  for (let nameKey in names) {
    let n = parseInt(nameKey);

    if (!n || n < 256) {
      continue;
    }

    if (JSON.stringify(names[nameKey]) === nameString) {
      return n;
    }

    if (nameID <= n) {
      nameID = n + 1;
    }
  }

  names[nameID] = name;
  return nameID;
}

function makeFvarAxis(n, axis, names) {
  const nameID = addName(axis.name, names);
  return [{
    name: 'tag_' + n,
    type: 'TAG',
    value: axis.tag
  }, {
    name: 'minValue_' + n,
    type: 'FIXED',
    value: axis.minValue << 16
  }, {
    name: 'defaultValue_' + n,
    type: 'FIXED',
    value: axis.defaultValue << 16
  }, {
    name: 'maxValue_' + n,
    type: 'FIXED',
    value: axis.maxValue << 16
  }, {
    name: 'flags_' + n,
    type: 'USHORT',
    value: 0
  }, {
    name: 'nameID_' + n,
    type: 'USHORT',
    value: nameID
  }];
}

function parseFvarAxis(data, start, names) {
  const axis = {};
  const p = new _parse.default.Parser(data, start);
  axis.tag = p.parseTag();
  axis.minValue = p.parseFixed();
  axis.defaultValue = p.parseFixed();
  axis.maxValue = p.parseFixed();
  p.skip('uShort', 1); // reserved for flags; no values defined

  axis.name = names[p.parseUShort()] || {};
  return axis;
}

function makeFvarInstance(n, inst, axes, names) {
  const nameID = addName(inst.name, names);
  const fields = [{
    name: 'nameID_' + n,
    type: 'USHORT',
    value: nameID
  }, {
    name: 'flags_' + n,
    type: 'USHORT',
    value: 0
  }];

  for (let i = 0; i < axes.length; ++i) {
    const axisTag = axes[i].tag;
    fields.push({
      name: 'axis_' + n + ' ' + axisTag,
      type: 'FIXED',
      value: inst.coordinates[axisTag] << 16
    });
  }

  return fields;
}

function parseFvarInstance(data, start, axes, names) {
  const inst = {};
  const p = new _parse.default.Parser(data, start);
  inst.name = names[p.parseUShort()] || {};
  p.skip('uShort', 1); // reserved for flags; no values defined

  inst.coordinates = {};

  for (let i = 0; i < axes.length; ++i) {
    inst.coordinates[axes[i].tag] = p.parseFixed();
  }

  return inst;
}

function makeFvarTable(fvar, names) {
  const result = new _table.default.Table('fvar', [{
    name: 'version',
    type: 'ULONG',
    value: 0x10000
  }, {
    name: 'offsetToData',
    type: 'USHORT',
    value: 0
  }, {
    name: 'countSizePairs',
    type: 'USHORT',
    value: 2
  }, {
    name: 'axisCount',
    type: 'USHORT',
    value: fvar.axes.length
  }, {
    name: 'axisSize',
    type: 'USHORT',
    value: 20
  }, {
    name: 'instanceCount',
    type: 'USHORT',
    value: fvar.instances.length
  }, {
    name: 'instanceSize',
    type: 'USHORT',
    value: 4 + fvar.axes.length * 4
  }]);
  result.offsetToData = result.sizeOf();

  for (let i = 0; i < fvar.axes.length; i++) {
    result.fields = result.fields.concat(makeFvarAxis(i, fvar.axes[i], names));
  }

  for (let j = 0; j < fvar.instances.length; j++) {
    result.fields = result.fields.concat(makeFvarInstance(j, fvar.instances[j], fvar.axes, names));
  }

  return result;
}

function parseFvarTable(data, start, names) {
  const p = new _parse.default.Parser(data, start);
  const tableVersion = p.parseULong();

  _check.default.argument(tableVersion === 0x00010000, 'Unsupported fvar table version.');

  const offsetToData = p.parseOffset16(); // Skip countSizePairs.

  p.skip('uShort', 1);
  const axisCount = p.parseUShort();
  const axisSize = p.parseUShort();
  const instanceCount = p.parseUShort();
  const instanceSize = p.parseUShort();
  const axes = [];

  for (let i = 0; i < axisCount; i++) {
    axes.push(parseFvarAxis(data, start + offsetToData + i * axisSize, names));
  }

  const instances = [];
  const instanceStart = start + offsetToData + axisCount * axisSize;

  for (let j = 0; j < instanceCount; j++) {
    instances.push(parseFvarInstance(data, instanceStart + j * instanceSize, axes, names));
  }

  return {
    axes: axes,
    instances: instances
  };
}

var _default = {
  make: makeFvarTable,
  parse: parseFvarTable
};
exports.default = _default;
},{"../check":"../node_modules/opentype.js/src/check.js","../parse":"../node_modules/opentype.js/src/parse.js","../table":"../node_modules/opentype.js/src/table.js"}],"../node_modules/opentype.js/src/tables/gpos.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _check = _interopRequireDefault(require("../check"));

var _parse = require("../parse");

var _table = _interopRequireDefault(require("../table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The `GPOS` table contains kerning pairs, among other things.
// https://docs.microsoft.com/en-us/typography/opentype/spec/gpos
const subtableParsers = new Array(10); // subtableParsers[0] is unused
// https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#lookup-type-1-single-adjustment-positioning-subtable
// this = Parser instance

subtableParsers[1] = function parseLookup1() {
  const start = this.offset + this.relativeOffset;
  const posformat = this.parseUShort();

  if (posformat === 1) {
    return {
      posFormat: 1,
      coverage: this.parsePointer(_parse.Parser.coverage),
      value: this.parseValueRecord()
    };
  } else if (posformat === 2) {
    return {
      posFormat: 2,
      coverage: this.parsePointer(_parse.Parser.coverage),
      values: this.parseValueRecordList()
    };
  }

  _check.default.assert(false, '0x' + start.toString(16) + ': GPOS lookup type 1 format must be 1 or 2.');
}; // https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#lookup-type-2-pair-adjustment-positioning-subtable


subtableParsers[2] = function parseLookup2() {
  const start = this.offset + this.relativeOffset;
  const posFormat = this.parseUShort();

  _check.default.assert(posFormat === 1 || posFormat === 2, '0x' + start.toString(16) + ': GPOS lookup type 2 format must be 1 or 2.');

  const coverage = this.parsePointer(_parse.Parser.coverage);
  const valueFormat1 = this.parseUShort();
  const valueFormat2 = this.parseUShort();

  if (posFormat === 1) {
    // Adjustments for Glyph Pairs
    return {
      posFormat: posFormat,
      coverage: coverage,
      valueFormat1: valueFormat1,
      valueFormat2: valueFormat2,
      pairSets: this.parseList(_parse.Parser.pointer(_parse.Parser.list(function () {
        return {
          // pairValueRecord
          secondGlyph: this.parseUShort(),
          value1: this.parseValueRecord(valueFormat1),
          value2: this.parseValueRecord(valueFormat2)
        };
      })))
    };
  } else if (posFormat === 2) {
    const classDef1 = this.parsePointer(_parse.Parser.classDef);
    const classDef2 = this.parsePointer(_parse.Parser.classDef);
    const class1Count = this.parseUShort();
    const class2Count = this.parseUShort();
    return {
      // Class Pair Adjustment
      posFormat: posFormat,
      coverage: coverage,
      valueFormat1: valueFormat1,
      valueFormat2: valueFormat2,
      classDef1: classDef1,
      classDef2: classDef2,
      class1Count: class1Count,
      class2Count: class2Count,
      classRecords: this.parseList(class1Count, _parse.Parser.list(class2Count, function () {
        return {
          value1: this.parseValueRecord(valueFormat1),
          value2: this.parseValueRecord(valueFormat2)
        };
      }))
    };
  }
};

subtableParsers[3] = function parseLookup3() {
  return {
    error: 'GPOS Lookup 3 not supported'
  };
};

subtableParsers[4] = function parseLookup4() {
  return {
    error: 'GPOS Lookup 4 not supported'
  };
};

subtableParsers[5] = function parseLookup5() {
  return {
    error: 'GPOS Lookup 5 not supported'
  };
};

subtableParsers[6] = function parseLookup6() {
  return {
    error: 'GPOS Lookup 6 not supported'
  };
};

subtableParsers[7] = function parseLookup7() {
  return {
    error: 'GPOS Lookup 7 not supported'
  };
};

subtableParsers[8] = function parseLookup8() {
  return {
    error: 'GPOS Lookup 8 not supported'
  };
};

subtableParsers[9] = function parseLookup9() {
  return {
    error: 'GPOS Lookup 9 not supported'
  };
}; // https://docs.microsoft.com/en-us/typography/opentype/spec/gpos


function parseGposTable(data, start) {
  start = start || 0;
  const p = new _parse.Parser(data, start);
  const tableVersion = p.parseVersion(1);

  _check.default.argument(tableVersion === 1 || tableVersion === 1.1, 'Unsupported GPOS table version ' + tableVersion);

  if (tableVersion === 1) {
    return {
      version: tableVersion,
      scripts: p.parseScriptList(),
      features: p.parseFeatureList(),
      lookups: p.parseLookupList(subtableParsers)
    };
  } else {
    return {
      version: tableVersion,
      scripts: p.parseScriptList(),
      features: p.parseFeatureList(),
      lookups: p.parseLookupList(subtableParsers),
      variations: p.parseFeatureVariationsList()
    };
  }
} // GPOS Writing //////////////////////////////////////////////
// NOT SUPPORTED


const subtableMakers = new Array(10);

function makeGposTable(gpos) {
  return new _table.default.Table('GPOS', [{
    name: 'version',
    type: 'ULONG',
    value: 0x10000
  }, {
    name: 'scripts',
    type: 'TABLE',
    value: new _table.default.ScriptList(gpos.scripts)
  }, {
    name: 'features',
    type: 'TABLE',
    value: new _table.default.FeatureList(gpos.features)
  }, {
    name: 'lookups',
    type: 'TABLE',
    value: new _table.default.LookupList(gpos.lookups, subtableMakers)
  }]);
}

var _default = {
  parse: parseGposTable,
  make: makeGposTable
};
exports.default = _default;
},{"../check":"../node_modules/opentype.js/src/check.js","../parse":"../node_modules/opentype.js/src/parse.js","../table":"../node_modules/opentype.js/src/table.js"}],"../node_modules/opentype.js/src/tables/kern.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _check = _interopRequireDefault(require("../check"));

var _parse = _interopRequireDefault(require("../parse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The `kern` table contains kerning pairs.
// Note that some fonts use the GPOS OpenType layout table to specify kerning.
// https://www.microsoft.com/typography/OTSPEC/kern.htm
function parseWindowsKernTable(p) {
  const pairs = {}; // Skip nTables.

  p.skip('uShort');
  const subtableVersion = p.parseUShort();

  _check.default.argument(subtableVersion === 0, 'Unsupported kern sub-table version.'); // Skip subtableLength, subtableCoverage


  p.skip('uShort', 2);
  const nPairs = p.parseUShort(); // Skip searchRange, entrySelector, rangeShift.

  p.skip('uShort', 3);

  for (let i = 0; i < nPairs; i += 1) {
    const leftIndex = p.parseUShort();
    const rightIndex = p.parseUShort();
    const value = p.parseShort();
    pairs[leftIndex + ',' + rightIndex] = value;
  }

  return pairs;
}

function parseMacKernTable(p) {
  const pairs = {}; // The Mac kern table stores the version as a fixed (32 bits) but we only loaded the first 16 bits.
  // Skip the rest.

  p.skip('uShort');
  const nTables = p.parseULong(); //check.argument(nTables === 1, 'Only 1 subtable is supported (got ' + nTables + ').');

  if (nTables > 1) {
    console.warn('Only the first kern subtable is supported.');
  }

  p.skip('uLong');
  const coverage = p.parseUShort();
  const subtableVersion = coverage & 0xFF;
  p.skip('uShort');

  if (subtableVersion === 0) {
    const nPairs = p.parseUShort(); // Skip searchRange, entrySelector, rangeShift.

    p.skip('uShort', 3);

    for (let i = 0; i < nPairs; i += 1) {
      const leftIndex = p.parseUShort();
      const rightIndex = p.parseUShort();
      const value = p.parseShort();
      pairs[leftIndex + ',' + rightIndex] = value;
    }
  }

  return pairs;
} // Parse the `kern` table which contains kerning pairs.


function parseKernTable(data, start) {
  const p = new _parse.default.Parser(data, start);
  const tableVersion = p.parseUShort();

  if (tableVersion === 0) {
    return parseWindowsKernTable(p);
  } else if (tableVersion === 1) {
    return parseMacKernTable(p);
  } else {
    throw new Error('Unsupported kern table version (' + tableVersion + ').');
  }
}

var _default = {
  parse: parseKernTable
};
exports.default = _default;
},{"../check":"../node_modules/opentype.js/src/check.js","../parse":"../node_modules/opentype.js/src/parse.js"}],"../node_modules/opentype.js/src/tables/loca.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _parse = _interopRequireDefault(require("../parse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The `loca` table stores the offsets to the locations of the glyphs in the font.
// https://www.microsoft.com/typography/OTSPEC/loca.htm
// Parse the `loca` table. This table stores the offsets to the locations of the glyphs in the font,
// relative to the beginning of the glyphData table.
// The number of glyphs stored in the `loca` table is specified in the `maxp` table (under numGlyphs)
// The loca table has two versions: a short version where offsets are stored as uShorts, and a long
// version where offsets are stored as uLongs. The `head` table specifies which version to use
// (under indexToLocFormat).
function parseLocaTable(data, start, numGlyphs, shortVersion) {
  const p = new _parse.default.Parser(data, start);
  const parseFn = shortVersion ? p.parseUShort : p.parseULong; // There is an extra entry after the last index element to compute the length of the last glyph.
  // That's why we use numGlyphs + 1.

  const glyphOffsets = [];

  for (let i = 0; i < numGlyphs + 1; i += 1) {
    let glyphOffset = parseFn.call(p);

    if (shortVersion) {
      // The short table version stores the actual offset divided by 2.
      glyphOffset *= 2;
    }

    glyphOffsets.push(glyphOffset);
  }

  return glyphOffsets;
}

var _default = {
  parse: parseLocaTable
};
exports.default = _default;
},{"../parse":"../node_modules/opentype.js/src/parse.js"}],"../node_modules/opentype.js/src/opentype.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parseBuffer;
exports.load = load;
exports.loadSync = loadSync;
Object.defineProperty(exports, "Font", {
  enumerable: true,
  get: function () {
    return _font.default;
  }
});
Object.defineProperty(exports, "Glyph", {
  enumerable: true,
  get: function () {
    return _glyph.default;
  }
});
Object.defineProperty(exports, "_parse", {
  enumerable: true,
  get: function () {
    return _parse.default;
  }
});
Object.defineProperty(exports, "BoundingBox", {
  enumerable: true,
  get: function () {
    return _bbox.default;
  }
});
Object.defineProperty(exports, "Path", {
  enumerable: true,
  get: function () {
    return _path.default;
  }
});

require("string.prototype.codepointat");

var _tinyInflate = _interopRequireDefault(require("tiny-inflate"));

var _font = _interopRequireDefault(require("./font"));

var _glyph = _interopRequireDefault(require("./glyph"));

var _encoding = require("./encoding");

var _parse = _interopRequireDefault(require("./parse"));

var _bbox = _interopRequireDefault(require("./bbox"));

var _path = _interopRequireDefault(require("./path"));

var _util = require("./util");

var _cmap = _interopRequireDefault(require("./tables/cmap"));

var _cff = _interopRequireDefault(require("./tables/cff"));

var _fvar = _interopRequireDefault(require("./tables/fvar"));

var _glyf = _interopRequireDefault(require("./tables/glyf"));

var _gpos = _interopRequireDefault(require("./tables/gpos"));

var _gsub = _interopRequireDefault(require("./tables/gsub"));

var _head = _interopRequireDefault(require("./tables/head"));

var _hhea = _interopRequireDefault(require("./tables/hhea"));

var _hmtx = _interopRequireDefault(require("./tables/hmtx"));

var _kern = _interopRequireDefault(require("./tables/kern"));

var _ltag = _interopRequireDefault(require("./tables/ltag"));

var _loca = _interopRequireDefault(require("./tables/loca"));

var _maxp = _interopRequireDefault(require("./tables/maxp"));

var _name2 = _interopRequireDefault(require("./tables/name"));

var _os = _interopRequireDefault(require("./tables/os2"));

var _post = _interopRequireDefault(require("./tables/post"));

var _meta = _interopRequireDefault(require("./tables/meta"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// opentype.js
// https://github.com/opentypejs/opentype.js
// (c) 2015 Frederik De Bleser
// opentype.js may be freely distributed under the MIT license.

/* global DataView, Uint8Array, XMLHttpRequest  */

/**
 * The opentype library.
 * @namespace opentype
 */
// File loaders /////////////////////////////////////////////////////////

/**
 * Loads a font from a file. The callback throws an error message as the first parameter if it fails
 * and the font as an ArrayBuffer in the second parameter if it succeeds.
 * @param  {string} path - The path of the file
 * @param  {Function} callback - The function to call when the font load completes
 */
function loadFromFile(path, callback) {
  const fs = require('fs');

  fs.readFile(path, function (err, buffer) {
    if (err) {
      return callback(err.message);
    }

    callback(null, (0, _util.nodeBufferToArrayBuffer)(buffer));
  });
}
/**
 * Loads a font from a URL. The callback throws an error message as the first parameter if it fails
 * and the font as an ArrayBuffer in the second parameter if it succeeds.
 * @param  {string} url - The URL of the font file.
 * @param  {Function} callback - The function to call when the font load completes
 */


function loadFromUrl(url, callback) {
  const request = new XMLHttpRequest();
  request.open('get', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function () {
    if (request.response) {
      return callback(null, request.response);
    } else {
      return callback('Font could not be loaded: ' + request.statusText);
    }
  };

  request.onerror = function () {
    callback('Font could not be loaded');
  };

  request.send();
} // Table Directory Entries //////////////////////////////////////////////

/**
 * Parses OpenType table entries.
 * @param  {DataView}
 * @param  {Number}
 * @return {Object[]}
 */


function parseOpenTypeTableEntries(data, numTables) {
  const tableEntries = [];
  let p = 12;

  for (let i = 0; i < numTables; i += 1) {
    const tag = _parse.default.getTag(data, p);

    const checksum = _parse.default.getULong(data, p + 4);

    const offset = _parse.default.getULong(data, p + 8);

    const length = _parse.default.getULong(data, p + 12);

    tableEntries.push({
      tag: tag,
      checksum: checksum,
      offset: offset,
      length: length,
      compression: false
    });
    p += 16;
  }

  return tableEntries;
}
/**
 * Parses WOFF table entries.
 * @param  {DataView}
 * @param  {Number}
 * @return {Object[]}
 */


function parseWOFFTableEntries(data, numTables) {
  const tableEntries = [];
  let p = 44; // offset to the first table directory entry.

  for (let i = 0; i < numTables; i += 1) {
    const tag = _parse.default.getTag(data, p);

    const offset = _parse.default.getULong(data, p + 4);

    const compLength = _parse.default.getULong(data, p + 8);

    const origLength = _parse.default.getULong(data, p + 12);

    let compression;

    if (compLength < origLength) {
      compression = 'WOFF';
    } else {
      compression = false;
    }

    tableEntries.push({
      tag: tag,
      offset: offset,
      compression: compression,
      compressedLength: compLength,
      length: origLength
    });
    p += 20;
  }

  return tableEntries;
}
/**
 * @typedef TableData
 * @type Object
 * @property {DataView} data - The DataView
 * @property {number} offset - The data offset.
 */

/**
 * @param  {DataView}
 * @param  {Object}
 * @return {TableData}
 */


function uncompressTable(data, tableEntry) {
  if (tableEntry.compression === 'WOFF') {
    const inBuffer = new Uint8Array(data.buffer, tableEntry.offset + 2, tableEntry.compressedLength - 2);
    const outBuffer = new Uint8Array(tableEntry.length);
    (0, _tinyInflate.default)(inBuffer, outBuffer);

    if (outBuffer.byteLength !== tableEntry.length) {
      throw new Error('Decompression error: ' + tableEntry.tag + ' decompressed length doesn\'t match recorded length');
    }

    const view = new DataView(outBuffer.buffer, 0);
    return {
      data: view,
      offset: 0
    };
  } else {
    return {
      data: data,
      offset: tableEntry.offset
    };
  }
} // Public API ///////////////////////////////////////////////////////////

/**
 * Parse the OpenType file data (as an ArrayBuffer) and return a Font object.
 * Throws an error if the font could not be parsed.
 * @param  {ArrayBuffer}
 * @param  {Object} opt - options for parsing
 * @return {opentype.Font}
 */


function parseBuffer(buffer, opt) {
  opt = opt === undefined || opt === null ? {} : opt;
  let indexToLocFormat;
  let ltagTable; // Since the constructor can also be called to create new fonts from scratch, we indicate this
  // should be an empty font that we'll fill with our own data.

  const font = new _font.default({
    empty: true
  }); // OpenType fonts use big endian byte ordering.
  // We can't rely on typed array view types, because they operate with the endianness of the host computer.
  // Instead we use DataViews where we can specify endianness.

  const data = new DataView(buffer, 0);
  let numTables;
  let tableEntries = [];

  const signature = _parse.default.getTag(data, 0);

  if (signature === String.fromCharCode(0, 1, 0, 0) || signature === 'true' || signature === 'typ1') {
    font.outlinesFormat = 'truetype';
    numTables = _parse.default.getUShort(data, 4);
    tableEntries = parseOpenTypeTableEntries(data, numTables);
  } else if (signature === 'OTTO') {
    font.outlinesFormat = 'cff';
    numTables = _parse.default.getUShort(data, 4);
    tableEntries = parseOpenTypeTableEntries(data, numTables);
  } else if (signature === 'wOFF') {
    const flavor = _parse.default.getTag(data, 4);

    if (flavor === String.fromCharCode(0, 1, 0, 0)) {
      font.outlinesFormat = 'truetype';
    } else if (flavor === 'OTTO') {
      font.outlinesFormat = 'cff';
    } else {
      throw new Error('Unsupported OpenType flavor ' + signature);
    }

    numTables = _parse.default.getUShort(data, 12);
    tableEntries = parseWOFFTableEntries(data, numTables);
  } else {
    throw new Error('Unsupported OpenType signature ' + signature);
  }

  let cffTableEntry;
  let fvarTableEntry;
  let glyfTableEntry;
  let gposTableEntry;
  let gsubTableEntry;
  let hmtxTableEntry;
  let kernTableEntry;
  let locaTableEntry;
  let nameTableEntry;
  let metaTableEntry;
  let p;

  for (let i = 0; i < numTables; i += 1) {
    const tableEntry = tableEntries[i];
    let table;

    switch (tableEntry.tag) {
      case 'cmap':
        table = uncompressTable(data, tableEntry);
        font.tables.cmap = _cmap.default.parse(table.data, table.offset);
        font.encoding = new _encoding.CmapEncoding(font.tables.cmap);
        break;

      case 'cvt ':
        table = uncompressTable(data, tableEntry);
        p = new _parse.default.Parser(table.data, table.offset);
        font.tables.cvt = p.parseShortList(tableEntry.length / 2);
        break;

      case 'fvar':
        fvarTableEntry = tableEntry;
        break;

      case 'fpgm':
        table = uncompressTable(data, tableEntry);
        p = new _parse.default.Parser(table.data, table.offset);
        font.tables.fpgm = p.parseByteList(tableEntry.length);
        break;

      case 'head':
        table = uncompressTable(data, tableEntry);
        font.tables.head = _head.default.parse(table.data, table.offset);
        font.unitsPerEm = font.tables.head.unitsPerEm;
        indexToLocFormat = font.tables.head.indexToLocFormat;
        break;

      case 'hhea':
        table = uncompressTable(data, tableEntry);
        font.tables.hhea = _hhea.default.parse(table.data, table.offset);
        font.ascender = font.tables.hhea.ascender;
        font.descender = font.tables.hhea.descender;
        font.numberOfHMetrics = font.tables.hhea.numberOfHMetrics;
        break;

      case 'hmtx':
        hmtxTableEntry = tableEntry;
        break;

      case 'ltag':
        table = uncompressTable(data, tableEntry);
        ltagTable = _ltag.default.parse(table.data, table.offset);
        break;

      case 'maxp':
        table = uncompressTable(data, tableEntry);
        font.tables.maxp = _maxp.default.parse(table.data, table.offset);
        font.numGlyphs = font.tables.maxp.numGlyphs;
        break;

      case 'name':
        nameTableEntry = tableEntry;
        break;

      case 'OS/2':
        table = uncompressTable(data, tableEntry);
        font.tables.os2 = _os.default.parse(table.data, table.offset);
        break;

      case 'post':
        table = uncompressTable(data, tableEntry);
        font.tables.post = _post.default.parse(table.data, table.offset);
        font.glyphNames = new _encoding.GlyphNames(font.tables.post);
        break;

      case 'prep':
        table = uncompressTable(data, tableEntry);
        p = new _parse.default.Parser(table.data, table.offset);
        font.tables.prep = p.parseByteList(tableEntry.length);
        break;

      case 'glyf':
        glyfTableEntry = tableEntry;
        break;

      case 'loca':
        locaTableEntry = tableEntry;
        break;

      case 'CFF ':
        cffTableEntry = tableEntry;
        break;

      case 'kern':
        kernTableEntry = tableEntry;
        break;

      case 'GPOS':
        gposTableEntry = tableEntry;
        break;

      case 'GSUB':
        gsubTableEntry = tableEntry;
        break;

      case 'meta':
        metaTableEntry = tableEntry;
        break;
    }
  }

  const nameTable = uncompressTable(data, nameTableEntry);
  font.tables.name = _name2.default.parse(nameTable.data, nameTable.offset, ltagTable);
  font.names = font.tables.name;

  if (glyfTableEntry && locaTableEntry) {
    const shortVersion = indexToLocFormat === 0;
    const locaTable = uncompressTable(data, locaTableEntry);

    const locaOffsets = _loca.default.parse(locaTable.data, locaTable.offset, font.numGlyphs, shortVersion);

    const glyfTable = uncompressTable(data, glyfTableEntry);
    font.glyphs = _glyf.default.parse(glyfTable.data, glyfTable.offset, locaOffsets, font, opt);
  } else if (cffTableEntry) {
    const cffTable = uncompressTable(data, cffTableEntry);

    _cff.default.parse(cffTable.data, cffTable.offset, font, opt);
  } else {
    throw new Error('Font doesn\'t contain TrueType or CFF outlines.');
  }

  const hmtxTable = uncompressTable(data, hmtxTableEntry);

  _hmtx.default.parse(font, hmtxTable.data, hmtxTable.offset, font.numberOfHMetrics, font.numGlyphs, font.glyphs, opt);

  (0, _encoding.addGlyphNames)(font, opt);

  if (kernTableEntry) {
    const kernTable = uncompressTable(data, kernTableEntry);
    font.kerningPairs = _kern.default.parse(kernTable.data, kernTable.offset);
  } else {
    font.kerningPairs = {};
  }

  if (gposTableEntry) {
    const gposTable = uncompressTable(data, gposTableEntry);
    font.tables.gpos = _gpos.default.parse(gposTable.data, gposTable.offset);
    font.position.init();
  }

  if (gsubTableEntry) {
    const gsubTable = uncompressTable(data, gsubTableEntry);
    font.tables.gsub = _gsub.default.parse(gsubTable.data, gsubTable.offset);
  }

  if (fvarTableEntry) {
    const fvarTable = uncompressTable(data, fvarTableEntry);
    font.tables.fvar = _fvar.default.parse(fvarTable.data, fvarTable.offset, font.names);
  }

  if (metaTableEntry) {
    const metaTable = uncompressTable(data, metaTableEntry);
    font.tables.meta = _meta.default.parse(metaTable.data, metaTable.offset);
    font.metas = font.tables.meta;
  }

  return font;
}
/**
 * Asynchronously load the font from a URL or a filesystem. When done, call the callback
 * with two arguments `(err, font)`. The `err` will be null on success,
 * the `font` is a Font object.
 * We use the node.js callback convention so that
 * opentype.js can integrate with frameworks like async.js.
 * @alias opentype.load
 * @param  {string} url - The URL of the font to load.
 * @param  {Function} callback - The callback.
 */


function load(url, callback, opt) {
  const isNode = typeof window === 'undefined';
  const loadFn = isNode ? loadFromFile : loadFromUrl;
  loadFn(url, function (err, arrayBuffer) {
    if (err) {
      return callback(err);
    }

    let font;

    try {
      font = parseBuffer(arrayBuffer, opt);
    } catch (e) {
      return callback(e, null);
    }

    return callback(null, font);
  });
}
/**
 * Synchronously load the font from a URL or file.
 * When done, returns the font object or throws an error.
 * @alias opentype.loadSync
 * @param  {string} url - The URL of the font to load.
 * @param  {Object} opt - opt.lowMemory
 * @return {opentype.Font}
 */


function loadSync(url, opt) {
  const fs = require('fs');

  const buffer = fs.readFileSync(url);
  return parseBuffer((0, _util.nodeBufferToArrayBuffer)(buffer), opt);
}
},{"string.prototype.codepointat":"../node_modules/string.prototype.codepointat/codepointat.js","tiny-inflate":"../node_modules/tiny-inflate/index.js","./font":"../node_modules/opentype.js/src/font.js","./glyph":"../node_modules/opentype.js/src/glyph.js","./encoding":"../node_modules/opentype.js/src/encoding.js","./parse":"../node_modules/opentype.js/src/parse.js","./bbox":"../node_modules/opentype.js/src/bbox.js","./path":"../node_modules/opentype.js/src/path.js","./util":"../node_modules/opentype.js/src/util.js","./tables/cmap":"../node_modules/opentype.js/src/tables/cmap.js","./tables/cff":"../node_modules/opentype.js/src/tables/cff.js","./tables/fvar":"../node_modules/opentype.js/src/tables/fvar.js","./tables/glyf":"../node_modules/opentype.js/src/tables/glyf.js","./tables/gpos":"../node_modules/opentype.js/src/tables/gpos.js","./tables/gsub":"../node_modules/opentype.js/src/tables/gsub.js","./tables/head":"../node_modules/opentype.js/src/tables/head.js","./tables/hhea":"../node_modules/opentype.js/src/tables/hhea.js","./tables/hmtx":"../node_modules/opentype.js/src/tables/hmtx.js","./tables/kern":"../node_modules/opentype.js/src/tables/kern.js","./tables/ltag":"../node_modules/opentype.js/src/tables/ltag.js","./tables/loca":"../node_modules/opentype.js/src/tables/loca.js","./tables/maxp":"../node_modules/opentype.js/src/tables/maxp.js","./tables/name":"../node_modules/opentype.js/src/tables/name.js","./tables/os2":"../node_modules/opentype.js/src/tables/os2.js","./tables/post":"../node_modules/opentype.js/src/tables/post.js","./tables/meta":"../node_modules/opentype.js/src/tables/meta.js","fs":"../node_modules/parcel-bundler/src/builtins/_empty.js"}],"js/utils/paths.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPointOnArc = exports.arcPath = exports.circlePath = exports.rectPath = exports.getPointOnLinePath = exports.linePath = exports.cubicBezierPath = exports.getPointOnCubicBezier = exports.quadraticBezierPath = exports.getPointOnQuadraticBezier = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getPointOnQuadraticBezier = function getPointOnQuadraticBezier(t, p0, p1, p2) {
  var invT = 1 - t;
  return {
    x: invT * invT * p0.x + 2 * invT * t * p1.x + t * t * p2.x,
    y: invT * invT * p0.y + 2 * invT * t * p1.y + t * t * p2.y
  };
};

exports.getPointOnQuadraticBezier = getPointOnQuadraticBezier;

var quadraticBezierPath = function quadraticBezierPath(p1, cp1, p2) {
  var segments = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 50;
  var angleSegment = 1 / segments;
  var line = [];

  for (var i = 0; i < segments; i++) {
    var t = angleSegment * i;
    line.push(getPointOnQuadraticBezier(t, p1, cp1, p2));
  }

  return line;
};

exports.quadraticBezierPath = quadraticBezierPath;

var getPointOnCubicBezier = function getPointOnCubicBezier(t, p0, p1, p2, p3) {
  return _defineProperty({
    x: Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x
  }, "x", Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y);
};

exports.getPointOnCubicBezier = getPointOnCubicBezier;

var cubicBezierPath = function cubicBezierPath(p1, cp1, cp2, p2) {
  var segments = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 50;
  var angleSegment = 1 / segments;
  var line = [];

  for (var i = 0; i < segments; i++) {
    var t = angleSegment * i;
    line.push(getPointOnCubicBezier(t, p1, cp1, cp2, p2));
  }

  return line;
};

exports.cubicBezierPath = cubicBezierPath;

var linePath = function linePath(p1, p2) {
  var segments = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 50;
  var slice = 1 / segments;
  var line = [];

  for (var i = 0; i < segments; i++) {
    var t = slice * i;
    line.push(getPointOnLinePath(t, p1, p2));
  }

  return line;
};

exports.linePath = linePath;

var getPointOnLinePath = function getPointOnLinePath(t, p1, p2) {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t
  };
};

exports.getPointOnLinePath = getPointOnLinePath;

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

  for (var i = 0; i < segments; i++) {
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
},{}],"js/utils/font.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadFont = loadFont;
exports.Font = void 0;

var opentype = _interopRequireWildcard(require("opentype.js"));

var _paths = require("./paths");

var _utils = require("./utils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Font =
/*#__PURE__*/
function () {
  function Font(fontPath) {
    _classCallCheck(this, Font);

    this.fontPath = fontPath;
  }

  _createClass(Font, [{
    key: "getPath",
    value: function getPath(str, size) {
      var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      return this.fontPath.getPath(str, x, y, size);
    }
  }, {
    key: "getOptimisedPath",
    value: function getOptimisedPath(str, size) {
      var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref$fidelity = _ref.fidelity,
          fidelity = _ref$fidelity === void 0 ? 10 : _ref$fidelity,
          _ref$x = _ref.x,
          x = _ref$x === void 0 ? 0 : _ref$x,
          _ref$y = _ref.y,
          y = _ref$y === void 0 ? 0 : _ref$y;

      var path = this.fontPath.getPath(str, x, y, size);
      var points = [[]];
      var lastPoint = {};

      var getFidelity = function getFidelity(_ref2, _ref3, fidelity) {
        var x1 = _ref2.x,
            y1 = _ref2.y;
        var x2 = _ref3.x,
            y2 = _ref3.y;
        return Math.round((0, _utils.distance)(x1, y1, x2, y2) / fidelity);
      };

      for (var i = 0; i < path.commands.length; i += 1) {
        var cmd = path.commands[i];

        if (cmd.type === 'L') {
          points[points.length - 1] = [].concat(_toConsumableArray(points[points.length - 1]), _toConsumableArray((0, _paths.linePath)(lastPoint, {
            x: cmd.x,
            y: cmd.y
          }, getFidelity(lastPoint, cmd, fidelity))));
        } else if (cmd.type === 'C') {
          points[points.length - 1] = [].concat(_toConsumableArray(points[points.length - 1]), _toConsumableArray((0, _paths.cubicBezierPath)(lastPoint, {
            x: cmd.x1,
            y: cmd.y1
          }, {
            x: cmd.x2,
            y: cmd.y2
          }, {
            x: cmd.x,
            y: cmd.y
          }, getFidelity(lastPoint, cmd, fidelity))));
        } else if (cmd.type === 'Q') {
          points[points.length - 1] = [].concat(_toConsumableArray(points[points.length - 1]), _toConsumableArray((0, _paths.quadraticBezierPath)(lastPoint, {
            x: cmd.x1,
            y: cmd.y1
          }, {
            x: cmd.x,
            y: cmd.y
          }, getFidelity(lastPoint, cmd, fidelity))));
        } else if (cmd.type === 'Z' && i < path.commands.length - 1) {
          points.push([]);
        }

        lastPoint = {
          x: cmd.x,
          y: cmd.y
        };
      }

      var boundingBox = path.getBoundingBox();
      boundingBox.width = Math.abs(boundingBox.x2 - boundingBox.x1);
      boundingBox.height = Math.abs(boundingBox.y2 - boundingBox.y1);
      return {
        boundingBox: boundingBox,
        points: points
      };
    }
  }]);

  return Font;
}();

exports.Font = Font;

function loadFont(fontPath) {
  return new Promise(function (resolve, reject) {
    opentype.load(fontPath, function (err, font) {
      resolve(new Font(font));
    });
  });
}
},{"opentype.js":"../node_modules/opentype.js/src/opentype.js","./paths":"js/utils/paths.js","./utils":"js/utils/utils.js"}],"data/Gotham-Bold.ttf":[function(require,module,exports) {
module.exports = "/Gotham-Bold.54fd7e2d.ttf";
},{}],"js/script.js":[function(require,module,exports) {
"use strict";

var _engine = _interopRequireDefault(require("./utils/engine"));

var _animeEs = _interopRequireDefault(require("animejs/lib/anime.es.js"));

var _font = require("./utils/font");

var _GothamBold = _interopRequireDefault(require("../data/Gotham-Bold.ttf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Engine from './utils/engine3d';
var WIDTH = 480;
var HEIGHT = 480;
var FontObj;
var path;
var animPath;
var difference = 100;
var el = document.getElementById('canvas'); // const el = document.getElementById('container');

var app = new _engine.default(el, {
  debug: false,
  width: WIDTH,
  height: HEIGHT
});
app.onRender(function (_ref) {
  var frame = _ref.frame,
      width = _ref.width,
      height = _ref.height,
      debug = _ref.debug;
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  if (path) {
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, width / 4, 0, Math.PI * 2);
    ctx.strokeStyle = 'orange';
    ctx.stroke();
    ctx.save();
    ctx.translate((width - path.boundingBox.width) / 2 + difference / 2, height / 2 + path.boundingBox.height / 2 - difference / 2); // ctx.strokeRect(
    //   path.boundingBox.x1,
    //   path.boundingBox.y1,
    //   path.boundingBox.width,
    //   path.boundingBox.height,
    // )

    var c = 0;
    ctx.beginPath();

    for (var i = 0; i < path.points.length; i++) {
      for (var p = 0; p < path.points[i].length; p++) {
        // const { x, y } = path.points[i][p];
        if (p == 0) {
          ctx.moveTo(animPath[c].x, animPath[c].y);
        } else {
          ctx.lineTo(animPath[c].x, animPath[c].y);
        }

        c++;
      }

      ctx.closePath();
    }

    ctx.strokeStyle = 'blue';
    ctx.stroke();
    ctx.restore(); // if (path.fill) {
    //     ctx.fillStyle = path.fill;
    //     ctx.fill();
    // }
    // if (path.stroke) {
    //     ctx.strokeStyle = path.stroke;
    //     ctx.lineWidth = path.strokeWidth;
    //     ctx.stroke();
    // }
  }

  ctx.restore();
});
(0, _font.loadFont)(_GothamBold.default).then(function (Font) {
  FontObj = Font;
  path = FontObj.getOptimisedPath('MELT', 120, {
    fidelity: 30
  });
  animPath = path.points.flat().map(function (p) {
    return {
      x: p.x,
      y: p.y,
      origX: p.x
    };
  });
  (0, _animeEs.default)({
    targets: animPath,
    x: {
      value: "-=".concat(difference)
    },
    y: {
      value: "+=".concat(difference)
    },
    duration: 1000,
    delay: function delay(el, i) {
      var perc = (el.origX - path.boundingBox.x1) / path.boundingBox.width;
      return perc * 1000;
    },
    endDelay: 500,
    direction: 'alternate',
    loop: true,
    easing: 'easeInOutQuint'
  });
  app.start();
});
},{"./utils/engine":"js/utils/engine.js","animejs/lib/anime.es.js":"../node_modules/animejs/lib/anime.es.js","./utils/font":"js/utils/font.js","../data/Gotham-Bold.ttf":"data/Gotham-Bold.ttf"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55979" + '/');

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