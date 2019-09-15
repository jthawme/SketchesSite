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
})({"js/utils/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClosestColour = exports.getInterpolatedColours = exports.colourInterpolate = exports.colorToString = exports.color = exports.shuffle = exports.clamp = exports.distance = exports.mapRange = exports.randomBetween = exports.interpolate = exports.trackMouse = void 0;

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

var colorToString = function colorToString(_ref2) {
  var r = _ref2.r,
      g = _ref2.g,
      b = _ref2.b;
  return "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")");
};

exports.colorToString = colorToString;

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
},{}],"js/colors.json":[function(require,module,exports) {
module.exports = [["103", "58", "183"], ["205", "220", "57"], ["121", "85", "72"], ["255", "235", "238"], ["252", "228", "236"], ["243", "229", "245"], ["237", "231", "246"], ["232", "234", "246"], ["227", "242", "253"], ["225", "245", "254"], ["224", "247", "250"], ["224", "242", "241"], ["232", "245", "233"], ["241", "248", "233"], ["249", "251", "231"], ["255", "253", "231"], ["255", "248", "225"], ["255", "243", "224"], ["251", "233", "231"], ["239", "235", "233"], ["236", "239", "241"], ["255", "205", "210"], ["248", "187", "208"], ["225", "190", "231"], ["209", "196", "233"], ["197", "202", "233"], ["187", "222", "251"], ["179", "229", "252"], ["178", "235", "242"], ["178", "223", "219"], ["200", "230", "201"], ["220", "237", "200"], ["240", "244", "195"], ["255", "249", "196"], ["255", "236", "179"], ["255", "224", "178"], ["255", "204", "188"], ["215", "204", "200"], ["207", "216", "220"], ["239", "154", "154"], ["244", "143", "177"], ["206", "147", "216"], ["179", "157", "219"], ["159", "168", "218"], ["144", "202", "249"], ["129", "212", "250"], ["128", "222", "234"], ["128", "203", "196"], ["165", "214", "167"], ["197", "225", "165"], ["230", "238", "156"], ["255", "245", "157"], ["255", "224", "130"], ["255", "204", "128"], ["255", "171", "145"], ["188", "170", "164"], ["176", "190", "197"], ["229", "115", "115"], ["240", "98", "146"], ["186", "104", "200"], ["149", "117", "205"], ["121", "134", "203"], ["79", "195", "247"], ["77", "208", "225"], ["77", "182", "172"], ["174", "213", "129"], ["220", "231", "117"], ["255", "241", "118"], ["255", "213", "79"], ["255", "183", "77"], ["255", "138", "101"], ["161", "136", "127"], ["144", "164", "174"], ["239", "83", "80"], ["236", "64", "122"], ["171", "71", "188"], ["126", "87", "194"], ["41", "182", "246"], ["38", "198", "218"], ["38", "166", "154"], ["156", "204", "101"], ["212", "225", "87"], ["255", "238", "88"], ["255", "202", "40"], ["255", "167", "38"], ["255", "112", "67"], ["141", "110", "99"], ["120", "144", "156"], ["103", "58", "183"], ["205", "220", "57"], ["121", "85", "72"], ["229", "57", "53"], ["216", "27", "96"], ["142", "36", "170"], ["94", "53", "177"], ["57", "73", "171"], ["30", "136", "229"], ["3", "155", "229"], ["0", "172", "193"], ["0", "137", "123"], ["67", "160", "71"], ["124", "179", "66"], ["192", "202", "51"], ["253", "216", "53"], ["255", "179", "0"], ["251", "140", "0"], ["244", "81", "30"], ["109", "76", "65"], ["117", "117", "117"], ["84", "110", "122"], ["211", "47", "47"], ["194", "24", "91"], ["123", "31", "162"], ["81", "45", "168"], ["48", "63", "159"], ["25", "118", "210"], ["2", "136", "209"], ["0", "151", "167"], ["0", "121", "107"], ["56", "142", "60"], ["104", "159", "56"], ["175", "180", "43"], ["251", "192", "45"], ["255", "160", "0"], ["245", "124", "0"], ["230", "74", "25"], ["93", "64", "55"], ["97", "97", "97"], ["69", "90", "100"], ["198", "40", "40"], ["173", "20", "87"], ["106", "27", "154"], ["69", "39", "160"], ["40", "53", "147"], ["21", "101", "192"], ["2", "119", "189"], ["0", "131", "143"], ["0", "105", "92"], ["46", "125", "50"], ["85", "139", "47"], ["158", "157", "36"], ["249", "168", "37"], ["255", "143", "0"], ["239", "108", "0"], ["216", "67", "21"], ["78", "52", "46"], ["55", "71", "79"], ["183", "28", "28"], ["136", "14", "79"], ["74", "20", "140"], ["49", "27", "146"], ["26", "35", "126"], ["1", "87", "155"], ["0", "96", "100"], ["0", "77", "64"], ["27", "94", "32"], ["51", "105", "30"], ["130", "119", "23"], ["245", "127", "23"], ["255", "111", "0"], ["230", "81", "0"], ["191", "54", "12"], ["62", "39", "35"], ["255", "138", "128"], ["255", "128", "171"], ["234", "128", "252"], ["179", "136", "255"], ["140", "158", "255"], ["130", "177", "255"], ["128", "216", "255"], ["132", "255", "255"], ["167", "255", "235"], ["185", "246", "202"], ["204", "255", "144"], ["244", "255", "129"], ["255", "255", "141"], ["255", "229", "127"], ["255", "209", "128"], ["255", "158", "128"], ["255", "82", "82"], ["255", "64", "129"], ["224", "64", "251"], ["124", "77", "255"], ["83", "109", "254"], ["68", "138", "255"], ["64", "196", "255"], ["24", "255", "255"], ["100", "255", "218"], ["105", "240", "174"], ["178", "255", "89"], ["238", "255", "65"], ["255", "255", "0"], ["255", "215", "64"], ["255", "171", "64"], ["255", "110", "64"], ["255", "23", "68"], ["245", "0", "87"], ["213", "0", "249"], ["101", "31", "255"], ["61", "90", "254"], ["41", "121", "255"], ["0", "176", "255"], ["0", "229", "255"], ["29", "233", "182"], ["0", "230", "118"], ["118", "255", "3"], ["198", "255", "0"], ["255", "234", "0"], ["255", "196", "0"], ["255", "145", "0"], ["255", "61", "0"], ["213", "0", "0"], ["197", "17", "98"], ["170", "0", "255"], ["98", "0", "234"], ["48", "79", "254"], ["41", "98", "255"], ["0", "145", "234"], ["0", "184", "212"], ["0", "191", "165"], ["0", "200", "83"], ["100", "221", "23"], ["174", "234", "0"], ["255", "214", "0"], ["255", "171", "0"], ["255", "109", "0"], ["221", "44", "0"]];
},{}],"js/color.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomColor = randomColor;
exports.getColor = getColor;
exports.colors = exports.rows = exports.cols = void 0;

var _utils = require("./utils/utils");

var _colors2 = _interopRequireDefault(require("./colors.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cols = 20;
exports.cols = cols;
var rows = 20;
exports.rows = rows;
var colors = (0, _utils.shuffle)(_colors2.default.map(function (c) {
  return (0, _utils.color)(c[0], c[1], c[2]);
})).slice(0, cols * rows);
exports.colors = colors;

function randomColor() {
  return Math.floor((0, _utils.randomBetween)(0, colors.length));
}

function getColor(x, y, points, radius) {
  var _colors = [];

  for (var i = 0; i < points.length; i++) {
    var perc = 1 - (0, _utils.distance)(points[i].x, points[i].y, x, y) / radius;

    _colors.push((0, _utils.color)(colors[points[i].color].r * perc, colors[points[i].color].g * perc, colors[points[i].color].b * perc));
  }

  var col = (0, _utils.color)(0, 0, 0);

  _colors.forEach(function (c) {
    col.r += c.r;
    col.g += c.g;
    col.b += c.b;
  }); // col.r /= points.length;
  // col.g /= points.length;
  // col.b /= points.length;


  return (0, _utils.color)((0, _utils.clamp)(col.r, 255, 0), (0, _utils.clamp)(col.g, 255, 0), (0, _utils.clamp)(col.b, 255, 0));
}
},{"./utils/utils":"js/utils/utils.js","./colors.json":"js/colors.json"}],"js/worker.js":[function(require,module,exports) {
"use strict";

var _utils = require("./utils/utils");

var _color = require("./color");

self.onmessage = function (e) {
  switch (e.data.msg) {
    case 'generate':
      var dpr = e.data.dpr;
      var canvas = e.data.canvas;
      var ctx = canvas.getContext('2d');
      canvas.width = circleRadius * 2 * dpr;
      canvas.height = circleRadius * 2 * dpr;
      ctx.scale(dpr, dpr);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);

      for (var i = 1; i < pathPoints.length; i++) {
        ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
      }

      ctx.clip();
      var size = circleRadius * 2; // let radius = diagonal(size, size);

      var radius = circleRadius * 2;

      for (var x = 0; x < size; x++) {
        for (var y = 0; y < size; y++) {
          ctx.fillStyle = (0, _utils.colorToString)(getColor(x, y, colorPoints, radius));
          ctx.fillRect(x, y, 1, 1);
        }
      }

      ctx.restore();
      self.postMessage({
        foo: 'bar'
      });
      break;
  }
};
},{"./utils/utils":"js/utils/utils.js","./color":"js/color.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63106" + '/');

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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/worker.js"], null)
//# sourceMappingURL=/worker.68b749f9.js.map