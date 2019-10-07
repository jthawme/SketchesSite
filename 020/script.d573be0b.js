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
})({"../node_modules/json-stringify-safe/stringify.js":[function(require,module,exports) {
exports = module.exports = stringify
exports.getSerialize = serializer

function stringify(obj, replacer, spaces, cycleReplacer) {
  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
}

function serializer(replacer, cycleReplacer) {
  var stack = [], keys = []

  if (cycleReplacer == null) cycleReplacer = function(key, value) {
    if (stack[0] === value) return "[Circular ~]"
    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
  }

  return function(key, value) {
    if (stack.length > 0) {
      var thisPos = stack.indexOf(this)
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
    }
    else stack.push(value)

    return replacer == null ? value : replacer.call(this, key, value)
  }
}

},{}],"../node_modules/random-seed/index.js":[function(require,module,exports) {
/*
 * random-seed
 * https://github.com/skratchdot/random-seed
 *
 * This code was originally written by Steve Gibson and can be found here:
 *
 * https://www.grc.com/otg/uheprng.htm
 *
 * It was slightly modified for use in node, to pass jshint, and a few additional
 * helper functions were added.
 *
 * Copyright (c) 2013 skratchdot
 * Dual Licensed under the MIT license and the original GRC copyright/license
 * included below.
 */

/*	============================================================================
									Gibson Research Corporation
				UHEPRNG - Ultra High Entropy Pseudo-Random Number Generator
	============================================================================
	LICENSE AND COPYRIGHT:  THIS CODE IS HEREBY RELEASED INTO THE PUBLIC DOMAIN
	Gibson Research Corporation releases and disclaims ALL RIGHTS AND TITLE IN
	THIS CODE OR ANY DERIVATIVES. Anyone may be freely use it for any purpose.
	============================================================================
	This is GRC's cryptographically strong PRNG (pseudo-random number generator)
	for JavaScript. It is driven by 1536 bits of entropy, stored in an array of
	48, 32-bit JavaScript variables.  Since many applications of this generator,
	including ours with the "Off The Grid" Latin Square generator, may require
	the deteriministic re-generation of a sequence of PRNs, this PRNG's initial
	entropic state can be read and written as a static whole, and incrementally
	evolved by pouring new source entropy into the generator's internal state.
	----------------------------------------------------------------------------
	ENDLESS THANKS are due Johannes Baagoe for his careful development of highly
	robust JavaScript implementations of JS PRNGs.  This work was based upon his
	JavaScript "Alea" PRNG which is based upon the extremely robust Multiply-
	With-Carry (MWC) PRNG invented by George Marsaglia. MWC Algorithm References:
	http://www.GRC.com/otg/Marsaglia_PRNGs.pdf
	http://www.GRC.com/otg/Marsaglia_MWC_Generators.pdf
	----------------------------------------------------------------------------
	The quality of this algorithm's pseudo-random numbers have been verified by
	multiple independent researchers. It handily passes the fermilab.ch tests as
	well as the "diehard" and "dieharder" test suites.  For individuals wishing
	to further verify the quality of this algorithm's pseudo-random numbers, a
	256-megabyte file of this algorithm's output may be downloaded from GRC.com,
	and a Microsoft Windows scripting host (WSH) version of this algorithm may be
	downloaded and run from the Windows command prompt to generate unique files
	of any size:
	The Fermilab "ENT" tests: http://fourmilab.ch/random/
	The 256-megabyte sample PRN file at GRC: https://www.GRC.com/otg/uheprng.bin
	The Windows scripting host version: https://www.GRC.com/otg/wsh-uheprng.js
	----------------------------------------------------------------------------
	Qualifying MWC multipliers are: 187884, 686118, 898134, 1104375, 1250205,
	1460910 and 1768863. (We use the largest one that's < 2^21)
	============================================================================ */
'use strict';

var stringify = require('json-stringify-safe');
/*	============================================================================
This is based upon Johannes Baagoe's carefully designed and efficient hash
function for use with JavaScript.  It has a proven "avalanche" effect such
that every bit of the input affects every bit of the output 50% of the time,
which is good.	See: http://baagoe.com/en/RandomMusings/hash/avalanche.xhtml
============================================================================
*/


var Mash = function () {
  var n = 0xefc8249d;

  var mash = function (data) {
    if (data) {
      data = data.toString();

      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }

      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    } else {
      n = 0xefc8249d;
    }
  };

  return mash;
};

var uheprng = function (seed) {
  return function () {
    var o = 48; // set the 'order' number of ENTROPY-holding 32-bit values

    var c = 1; // init the 'carry' used by the multiply-with-carry (MWC) algorithm

    var p = o; // init the 'phase' (max-1) of the intermediate variable pointer

    var s = new Array(o); // declare our intermediate variables array

    var i; // general purpose local

    var j; // general purpose local

    var k = 0; // general purpose local
    // when our "uheprng" is initially invoked our PRNG state is initialized from the
    // browser's own local PRNG. This is okay since although its generator might not
    // be wonderful, it's useful for establishing large startup entropy for our usage.

    var mash = new Mash(); // get a pointer to our high-performance "Mash" hash
    // fill the array with initial mash hash values

    for (i = 0; i < o; i++) {
      s[i] = mash(Math.random());
    } // this PRIVATE (internal access only) function is the heart of the multiply-with-carry
    // (MWC) PRNG algorithm. When called it returns a pseudo-random number in the form of a
    // 32-bit JavaScript fraction (0.0 to <1.0) it is a PRIVATE function used by the default
    // [0-1] return function, and by the random 'string(n)' function which returns 'n'
    // characters from 33 to 126.


    var rawprng = function () {
      if (++p >= o) {
        p = 0;
      }

      var t = 1768863 * s[p] + c * 2.3283064365386963e-10; // 2^-32

      return s[p] = t - (c = t | 0);
    }; // this EXPORTED function is the default function returned by this library.
    // The values returned are integers in the range from 0 to range-1. We first
    // obtain two 32-bit fractions (from rawprng) to synthesize a single high
    // resolution 53-bit prng (0 to <1), then we multiply this by the caller's
    // "range" param and take the "floor" to return a equally probable integer.


    var random = function (range) {
      return Math.floor(range * (rawprng() + (rawprng() * 0x200000 | 0) * 1.1102230246251565e-16)); // 2^-53
    }; // this EXPORTED function 'string(n)' returns a pseudo-random string of
    // 'n' printable characters ranging from chr(33) to chr(126) inclusive.


    random.string = function (count) {
      var i;
      var s = '';

      for (i = 0; i < count; i++) {
        s += String.fromCharCode(33 + random(94));
      }

      return s;
    }; // this PRIVATE "hash" function is used to evolve the generator's internal
    // entropy state. It is also called by the EXPORTED addEntropy() function
    // which is used to pour entropy into the PRNG.


    var hash = function () {
      var args = Array.prototype.slice.call(arguments);

      for (i = 0; i < args.length; i++) {
        for (j = 0; j < o; j++) {
          s[j] -= mash(args[i]);

          if (s[j] < 0) {
            s[j] += 1;
          }
        }
      }
    }; // this EXPORTED "clean string" function removes leading and trailing spaces and non-printing
    // control characters, including any embedded carriage-return (CR) and line-feed (LF) characters,
    // from any string it is handed. this is also used by the 'hashstring' function (below) to help
    // users always obtain the same EFFECTIVE uheprng seeding key.


    random.cleanString = function (inStr) {
      inStr = inStr.replace(/(^\s*)|(\s*$)/gi, ''); // remove any/all leading spaces

      inStr = inStr.replace(/[\x00-\x1F]/gi, ''); // remove any/all control characters

      inStr = inStr.replace(/\n /, '\n'); // remove any/all trailing spaces

      return inStr; // return the cleaned up result
    }; // this EXPORTED "hash string" function hashes the provided character string after first removing
    // any leading or trailing spaces and ignoring any embedded carriage returns (CR) or Line Feeds (LF)


    random.hashString = function (inStr) {
      inStr = random.cleanString(inStr);
      mash(inStr); // use the string to evolve the 'mash' state

      for (i = 0; i < inStr.length; i++) {
        // scan through the characters in our string
        k = inStr.charCodeAt(i); // get the character code at the location

        for (j = 0; j < o; j++) {
          //	"mash" it into the UHEPRNG state
          s[j] -= mash(k);

          if (s[j] < 0) {
            s[j] += 1;
          }
        }
      }
    }; // this EXPORTED function allows you to seed the random generator.


    random.seed = function (seed) {
      if (typeof seed === 'undefined' || seed === null) {
        seed = Math.random();
      }

      if (typeof seed !== 'string') {
        seed = stringify(seed, function (key, value) {
          if (typeof value === 'function') {
            return value.toString();
          }

          return value;
        });
      }

      random.initState();
      random.hashString(seed);
    }; // this handy exported function is used to add entropy to our uheprng at any time


    random.addEntropy = function ()
    /* accept zero or more arguments */
    {
      var args = [];

      for (i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }

      hash(k++ + new Date().getTime() + args.join('') + Math.random());
    }; // if we want to provide a deterministic startup context for our PRNG,
    // but without directly setting the internal state variables, this allows
    // us to initialize the mash hash and PRNG's internal state before providing
    // some hashing input


    random.initState = function () {
      mash(); // pass a null arg to force mash hash to init

      for (i = 0; i < o; i++) {
        s[i] = mash(' '); // fill the array with initial mash hash values
      }

      c = 1; // init our multiply-with-carry carry

      p = o; // init our phase
    }; // we use this (optional) exported function to signal the JavaScript interpreter
    // that we're finished using the "Mash" hash function so that it can free up the
    // local "instance variables" is will have been maintaining.  It's not strictly
    // necessary, of course, but it's good JavaScript citizenship.


    random.done = function () {
      mash = null;
    }; // if we called "uheprng" with a seed value, then execute random.seed() before returning


    if (typeof seed !== 'undefined') {
      random.seed(seed);
    } // Returns a random integer between 0 (inclusive) and range (exclusive)


    random.range = function (range) {
      return random(range);
    }; // Returns a random float between 0 (inclusive) and 1 (exclusive)


    random.random = function () {
      return random(Number.MAX_VALUE - 1) / Number.MAX_VALUE;
    }; // Returns a random float between min (inclusive) and max (exclusive)


    random.floatBetween = function (min, max) {
      return random.random() * (max - min) + min;
    }; // Returns a random integer between min (inclusive) and max (inclusive)


    random.intBetween = function (min, max) {
      return Math.floor(random.random() * (max - min + 1)) + min;
    }; // when our main outer "uheprng" function is called, after setting up our
    // initial variables and entropic state, we return an "instance pointer"
    // to the internal anonymous function which can then be used to access
    // the uheprng's various exported functions.  As with the ".done" function
    // above, we should set the returned value to 'null' once we're finished
    // using any of these functions.


    return random;
  }();
}; // Modification for use in node:


uheprng.create = function (seed) {
  return new uheprng(seed);
};

module.exports = uheprng;
},{"json-stringify-safe":"../node_modules/json-stringify-safe/stringify.js"}],"../node_modules/tumult/lib/util/noise.js":[function(require,module,exports) {
'use strict'

const rand = require('random-seed')

class Noise {
  constructor (s) {
    this.p = new Uint8Array(512)
    this.seed(s)
  }

  gen () {}

  seed (s) {
    const rng = rand.create(s || Math.random())

    for (let i = 0; i < 256; i++) this.p[i] = i
    for (let i = 0; i < 256; i++) {
      const r = rng(256)
      const temp = this.p[i]
      this.p[i] = this.p[r]
      this.p[r] = temp
    }
    for (let i = 0; i < 256; i++) this.p[i + 256] = this.p[i]
  }

  transform (fn) {
    const transformedFn = (...dims) => fn.apply(this, dims)

    return transformedFn.bind(this)
  }

  octavate (...args) {
    const octaves = args[0]
    const dims = args.slice(1)
    let val = 0
    let max = 0

    for (let i = 0; i < octaves; i++) {
      const w = 1 << i
      val += this.gen.apply(this, dims.map(x => x * w)) / w
    }

    for (let i = 0; i < octaves; i++) {
      max += 1 / (1 << i)
    }

    return val / max
  }
}

module.exports = Noise

},{"random-seed":"../node_modules/random-seed/index.js"}],"../node_modules/tumult/lib/util/1d.js":[function(require,module,exports) {
'use strict'

class Vec1 {
  constructor (x) {
    this.x = x
  }

  dot (x) {
    return this.x * x
  }
}

const g1 = [ new Vec1(1), new Vec1(-1) ]

function grad1 (p, x) {
  return g1[p[x] % g1.length]
}

module.exports = {
  grad1
}

},{}],"../node_modules/tumult/lib/util/math.js":[function(require,module,exports) {
'use strict'

function falloff (...args) {
  const dims = args.slice(1)
  const t = args[0] - dims.reduce((sum, val) => {
    return sum + val * val
  }, 0)

  return t * t * t * t
}

function lerp (a, b, t) {
  return a * (1 - t) + b * t
}
function fade (t) {
  return t * t * t * (10 + t * (-15 + t * 6))
}
const cut1 = falloff.bind(null, 1)
const cut = falloff.bind(null, 0.5)

module.exports = {
  lerp,
  fade,
  cut1,
  cut
}

},{}],"../node_modules/tumult/lib/simplex/simplex1.js":[function(require,module,exports) {
'use strict'

const Noise = require('../util/noise')
const { grad1 } = require('../util/1d')
const { cut1 } = require('../util/math')

class Simplex1 extends Noise {
  gen (x) {
    const gx = Math.floor(x) % 256
    const dx = x - gx

    const n0 = cut1(dx) * grad1(this.p, gx).dot(dx)
    const n1 = cut1(dx - 1) * grad1(this.p, gx + 1).dot(dx - 1)

    return 0.5 * (n0 + n1)
  }
}

module.exports = Simplex1

},{"../util/noise":"../node_modules/tumult/lib/util/noise.js","../util/1d":"../node_modules/tumult/lib/util/1d.js","../util/math":"../node_modules/tumult/lib/util/math.js"}],"../node_modules/tumult/lib/util/2d.js":[function(require,module,exports) {
'use strict'

class Vec2 {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  dot (x, y) {
    return this.x * x + this.y * y
  }
}

const g2 = [
  new Vec2(1, 0), new Vec2(1, 1), new Vec2(0, 1), new Vec2(-1, 1),
  new Vec2(-1, 0), new Vec2(-1, -1), new Vec2(0, -1), new Vec2(1, -1)
]

function grad2 (p, x, y) {
  const hash = p[x + p[y]] % g2.length
  return g2[hash]
}
const S2_TO_C = 0.5 * (Math.sqrt(3) - 1)
const C_TO_S2 = (3 - Math.sqrt(3)) / 6

module.exports = {
  grad2,
  S2_TO_C,
  C_TO_S2
}

},{}],"../node_modules/tumult/lib/simplex/simplex2.js":[function(require,module,exports) {
'use strict'

const Noise = require('../util/noise')
const { grad2, S2_TO_C, C_TO_S2 } = require('../util/2d')
const { cut } = require('../util/math')

class Simplex2 extends Noise {
  gen (x, y) {
    const skew = (x + y) * S2_TO_C
    const i = Math.trunc(x + skew)
    const j = Math.trunc(y + skew)

    const unskew = (i + j) * C_TO_S2
    const gx = i - unskew
    const gy = j - unskew

    const dx0 = x - gx
    const dy0 = y - gy

    const di = dx0 > dy0 ? 1 : 0
    const dj = dx0 > dy0 ? 0 : 1

    const dx1 = dx0 - di + C_TO_S2
    const dy1 = dy0 - dj + C_TO_S2
    const dx2 = dx0 - 1 + 2 * C_TO_S2
    const dy2 = dy0 - 1 + 2 * C_TO_S2

    const n0 = cut(dx0, dy0) * grad2(this.p, i, j).dot(dx0, dy0)
    const n1 = cut(dx1, dy1) * grad2(this.p, i + di, j + dj).dot(dx1, dy1)
    const n2 = cut(dx2, dy2) * grad2(this.p, i + 1, j + 1).dot(dx2, dy2)

    return 70 * (n0 + n1 + n2)
  }
}

module.exports = Simplex2

},{"../util/noise":"../node_modules/tumult/lib/util/noise.js","../util/2d":"../node_modules/tumult/lib/util/2d.js","../util/math":"../node_modules/tumult/lib/util/math.js"}],"../node_modules/tumult/lib/perlin/perlin1.js":[function(require,module,exports) {
'use strict'

const Noise = require('../util/noise')
const { grad1 } = require('../util/1d')
const { lerp, fade } = require('../util/math')

class Perlin1 extends Noise {
  gen (x) {
    const gx = Math.floor(x) % 256
    const dx = x - gx

    const n0 = grad1(this.p, gx).dot(dx)
    const n1 = grad1(this.p, gx + 1).dot(dx - 1)

    return lerp(n0, n1, fade(dx))
  }
}

module.exports = Perlin1

},{"../util/noise":"../node_modules/tumult/lib/util/noise.js","../util/1d":"../node_modules/tumult/lib/util/1d.js","../util/math":"../node_modules/tumult/lib/util/math.js"}],"../node_modules/tumult/lib/perlin/perlin2.js":[function(require,module,exports) {
'use strict'

const Noise = require('../util/noise')
const { grad2 } = require('../util/2d')
const { fade, lerp } = require('../util/math')

class Perlin2 extends Noise {
  gen (x, y) {
    const gx = Math.trunc(x) % 256
    const gy = Math.trunc(y) % 256

    const dx = x - gx
    const dy = y - gy

    const n00 = grad2(this.p, gx, gy).dot(dx, dy)
    const n10 = grad2(this.p, gx + 1, gy).dot(dx - 1, dy)
    const n01 = grad2(this.p, gx, gy + 1).dot(dx, dy - 1)
    const n11 = grad2(this.p, gx + 1, gy + 1).dot(dx - 1, dy - 1)

    return lerp(
      lerp(n00, n10, fade(dx)),
      lerp(n01, n11, fade(dx)),
      fade(dy)
    )
  }
}

module.exports = Perlin2

},{"../util/noise":"../node_modules/tumult/lib/util/noise.js","../util/2d":"../node_modules/tumult/lib/util/2d.js","../util/math":"../node_modules/tumult/lib/util/math.js"}],"../node_modules/tumult/lib/util/3d.js":[function(require,module,exports) {
'use strict'

class Vec3 {
  constructor (x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }

  dot (x, y, z) {
    return this.x * x + this.y * y + this.z * z
  }
}

const g3 = [
  new Vec3(1, 1, 1), new Vec3(-1, 1, 1), new Vec3(1, -1, 1), new Vec3(-1, -1, 1),
  new Vec3(1, 1, 0), new Vec3(-1, 1, 0), new Vec3(1, -1, 0), new Vec3(-1, -1, 0),
  new Vec3(1, 1, -1), new Vec3(-1, 1, -1), new Vec3(1, -1, -1), new Vec3(-1, -1, -1)
]

function grad3 (p, x, y, z) {
  const hash = p[x + p[y + p[z]]] % g3.length
  return g3[hash]
}

module.exports = {
  grad3
}

},{}],"../node_modules/tumult/lib/perlin/perlin3.js":[function(require,module,exports) {
'use strict'

const Noise = require('../util/noise')
const { grad3 } = require('../util/3d')
const { fade, lerp } = require('../util/math')

class Perlin3 extends Noise {
  gen (x, y, z) {
    const gx = Math.trunc(x) % 256
    const gy = Math.trunc(y) % 256
    const gz = Math.trunc(z) % 256

    const dx = x - gx
    const dy = y - gy
    const dz = z - gz

    const n000 = grad3(this.p, gx, gy, gz).dot(dx, dy, dz)
    const n100 = grad3(this.p, gx + 1, gy, gz).dot(dx - 1, dy, dz)
    const n010 = grad3(this.p, gx, gy + 1, gz).dot(dx, dy - 1, dz)
    const n110 = grad3(this.p, gx + 1, gy + 1, gz).dot(dx - 1, dy - 1, dz)
    const n001 = grad3(this.p, gx, gy, gz + 1).dot(dx, dy, dz - 1)
    const n101 = grad3(this.p, gx + 1, gy, gz + 1).dot(dx - 1, dy, dz - 1)
    const n011 = grad3(this.p, gx, gy + 1, gz + 1).dot(dx, dy - 1, dz - 1)
    const n111 = grad3(this.p, gx + 1, gy + 1, gz + 1).dot(dx - 1, dy - 1, dz - 1)

    return lerp(
      lerp(
        lerp(n000, n100, dx),
        lerp(n010, n110, dx),
        fade(dy)
      ),
      lerp(
        lerp(n001, n101, dx),
        lerp(n011, n111, dx),
        fade(dy)
      ),
      fade(dz)
    )
  }
}

module.exports = Perlin3

},{"../util/noise":"../node_modules/tumult/lib/util/noise.js","../util/3d":"../node_modules/tumult/lib/util/3d.js","../util/math":"../node_modules/tumult/lib/util/math.js"}],"../node_modules/tumult/lib/util/4d.js":[function(require,module,exports) {
'use strict'

class Vec4 {
  constructor (x, y, z, t) {
    this.x = x
    this.y = y
    this.z = z
    this.t = t
  }

  dot (x, y, z, t) {
    return this.x * x + this.y * y + this.z * z + this.t * t
  }
}

const g4 = [
  new Vec4(0, 1, 1, 1), new Vec4(0, 1, 1, -1), new Vec4(0, 1, -1, 1), new Vec4(0, 1, -1, -1),
  new Vec4(0, -1, 1, 1), new Vec4(0, -1, 1, -1), new Vec4(0, -1, -1, 1), new Vec4(0, -1, -1, -1),
  new Vec4(1, 0, 1, 1), new Vec4(1, 0, 1, -1), new Vec4(1, 0, -1, 1), new Vec4(1, 0, -1, -1),
  new Vec4(-1, 0, 1, 1), new Vec4(-1, 0, 1, -1), new Vec4(-1, 0, -1, 1), new Vec4(-1, 0, -1, -1),
  new Vec4(1, 1, 0, 1), new Vec4(1, 1, 0, -1), new Vec4(1, -1, 0, 1), new Vec4(1, -1, 0, -1),
  new Vec4(-1, 1, 0, 1), new Vec4(-1, 1, 0, -1), new Vec4(-1, -1, 0, 1), new Vec4(-1, -1, 0, -1),
  new Vec4(1, 1, 1, 0), new Vec4(1, 1, -1, 0), new Vec4(1, -1, 1, 0), new Vec4(1, -1, -1, 0),
  new Vec4(-1, 1, 1, 0), new Vec4(-1, 1, -1, 0), new Vec4(-1, -1, 1, 0), new Vec4(-1, -1, -1, 0)
]

function grad4 (p, x, y, z, t) {
  const hash = p[x + p[y + p[z + p[t]]]] % g4.length
  return g4[hash]
}

module.exports = {
  grad4
}

},{}],"../node_modules/tumult/lib/perlin/perlin4.js":[function(require,module,exports) {
'use strict'

const Noise = require('../util/noise')
const { grad4 } = require('../util/4d')
const { fade, lerp } = require('../util/math')

class Perlin4 extends Noise {
  gen (x, y, z, t) {
    const gx = Math.trunc(x) % 256
    const gy = Math.trunc(y) % 256
    const gz = Math.trunc(z) % 256
    const gt = Math.trunc(t) % 256

    const dx = x - gx
    const dy = y - gy
    const dz = z - gz
    const dt = t - gt

    const n0000 = grad4(this.p, gx, gy, gz, gt).dot(dx, dy, dz, dt)
    const n1000 = grad4(this.p, gx + 1, gy, gz, gt).dot(dx - 1, dy, dz)
    const n0100 = grad4(this.p, gx, gy + 1, gz, gt).dot(dx, dy - 1, dz)
    const n1100 = grad4(this.p, gx + 1, gy + 1, gz, gt).dot(dx - 1, dy - 1, dz)
    const n0010 = grad4(this.p, gx, gy, gz + 1, gt).dot(dx, dy, dz - 1)
    const n1010 = grad4(this.p, gx + 1, gy, gz + 1, gt).dot(dx - 1, dy, dz - 1)
    const n0110 = grad4(this.p, gx, gy + 1, gz + 1, gt).dot(dx, dy - 1, dz - 1)
    const n1110 = grad4(this.p, gx + 1, gy + 1, gz + 1, gt).dot(dx - 1, dy - 1, dz - 1)
    const n0001 = grad4(this.p, gx, gy, gz, gt + 1).dot(dx, dy, dz, dt - 1)
    const n1001 = grad4(this.p, gx + 1, gy, gz, gt + 1).dot(dx - 1, dy, dz, dt - 1)
    const n0101 = grad4(this.p, gx, gy + 1, gz, gt + 1).dot(dx, dy - 1, dz, dt - 1)
    const n1101 = grad4(this.p, gx + 1, gy + 1, gz, gt + 1).dot(dx - 1, dy - 1, dz, dt - 1)
    const n0011 = grad4(this.p, gx, gy, gz + 1, gt + 1).dot(dx, dy, dz - 1, dt - 1)
    const n1011 = grad4(this.p, gx + 1, gy, gz + 1, gt + 1).dot(dx - 1, dy, dz - 1, dt - 1)
    const n0111 = grad4(this.p, gx, gy + 1, gz + 1, gt + 1).dot(dx, dy - 1, dz - 1, dt - 1)
    const n1111 = grad4(this.p, gx + 1, gy + 1, gz + 1, gt + 1).dot(dx - 1, dy - 1, dz - 1, dt - 1)

    return lerp(
      lerp(
        lerp(
          lerp(n0000, n1000, dx),
          lerp(n0100, n1100, dx),
          fade(dy)
        ),
        lerp(
          lerp(n0010, n1010, dx),
          lerp(n0110, n1110, dx),
          fade(dy)
        ),
        fade(dz)
      ),
      lerp(
        lerp(
          lerp(n0001, n1001, dx),
          lerp(n0101, n1101, dx),
          fade(dy)
        ),
        lerp(
          lerp(n0011, n1011, dx),
          lerp(n0111, n1111, dx),
          fade(dy)
        ),
        fade(dz)
      ),
      fade(dt)
    )
  }
}

module.exports = Perlin4

},{"../util/noise":"../node_modules/tumult/lib/util/noise.js","../util/4d":"../node_modules/tumult/lib/util/4d.js","../util/math":"../node_modules/tumult/lib/util/math.js"}],"../node_modules/tumult/lib/util/nd.js":[function(require,module,exports) {
'use strict'

const { lerp, fade } = require('./math')

function hashN (p, gs) {
  if (gs.length === 1) return p[gs[0]]

  return p[gs[0] + hashN(p, gs.slice(1))]
}

class VecN {
  constructor (R) {
    this.R = R
  }

  dot (R) {
    let val = 0

    for (let i = 0; i < R.length; i++) {
      val += this.R[i] * R[i]
    }

    return val
  }
}

const gN = []
function generateGN (dim) {
  for (let i = 0; i < dim * 2; i++) {
    const vec = new Array(dim).fill(0)

    vec[i % dim] = i / dim >= 1 ? 1 : -1
    gN[i] = new VecN(vec)
  }
}

function lerpN (ns, ds) {
  if (ds.length === 1) return lerp(ns[0], ns[1], fade(ds[0]))

  const ns1 = ns.slice(0, Math.floor(ns.length / 2))
  const ns2 = ns.slice(Math.ceil(ns.length / 2))

  return lerp(
    lerpN(ns1, ds.slice(0, ds.length - 1)),
    lerpN(ns2, ds.slice(0, ds.length - 1)),
    fade(ds[ds.length - 1])
  )
}
function getNs (p, dim, gs, ds) {
  const ns = []

  if (gN.length === 0) {
    generateGN(dim)
  }

  for (let i = 0; i < (2 << (dim - 1)); i++) {
    const gsPerm = gs.slice()
    const dsPerm = ds.slice()
    let temp = i

    for (let j = 0; j < dim; j++) {
      if (temp & 1) {
        gsPerm[j] += 1
        dsPerm[j] -= 1
      }
      temp = temp >> 1
    }
    ns[i] = gN[hashN(p, gsPerm) % gN.length].dot(dsPerm)
  }

  return ns
}

module.exports = {
  lerpN,
  getNs
}

},{"./math":"../node_modules/tumult/lib/util/math.js"}],"../node_modules/tumult/lib/perlin/perlinN.js":[function(require,module,exports) {
'use strict'

const Noise = require('../util/noise')
const { lerpN, getNs } = require('../util/nd')

class PerlinN extends Noise {
  gen (...args) {
    const gs = []
    const ds = []

    for (let i = 0; i < args.length; i++) {
      gs[i] = Math.trunc(args[i]) % 256
      ds[i] = args[i] - gs[i]
    }

    const ns = getNs(this.p, args.length, gs, ds)

    return lerpN(ns, ds)
  }
}

module.exports = PerlinN

},{"../util/noise":"../node_modules/tumult/lib/util/noise.js","../util/nd":"../node_modules/tumult/lib/util/nd.js"}],"../node_modules/tumult/lib/index.js":[function(require,module,exports) {
'use struct'

const Simplex1 = require('./simplex/simplex1')
const Simplex2 = require('./simplex/simplex2')

const Perlin1 = require('./perlin/perlin1')
const Perlin2 = require('./perlin/perlin2')
const Perlin3 = require('./perlin/perlin3')
const Perlin4 = require('./perlin/perlin4')
const PerlinN = require('./perlin/perlinN')

module.exports = {
  Simplex1,
  Simplex2,
  Perlin1,
  Perlin2,
  Perlin3,
  Perlin4,
  PerlinN
}

},{"./simplex/simplex1":"../node_modules/tumult/lib/simplex/simplex1.js","./simplex/simplex2":"../node_modules/tumult/lib/simplex/simplex2.js","./perlin/perlin1":"../node_modules/tumult/lib/perlin/perlin1.js","./perlin/perlin2":"../node_modules/tumult/lib/perlin/perlin2.js","./perlin/perlin3":"../node_modules/tumult/lib/perlin/perlin3.js","./perlin/perlin4":"../node_modules/tumult/lib/perlin/perlin4.js","./perlin/perlinN":"../node_modules/tumult/lib/perlin/perlinN.js"}],"../node_modules/tumult/index.js":[function(require,module,exports) {
'use strict'

module.exports = require('./lib')

},{"./lib":"../node_modules/tumult/lib/index.js"}],"../node_modules/inherits/inherits_browser.js":[function(require,module,exports) {
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
exports.getClosestColour = exports.getInterpolatedColours = exports.clamp = exports.colourInterpolate = exports.color = exports.distance = exports.randomBetween = exports.interpolate = exports.trackMouse = void 0;

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

var distance = function distance(x1, y1, x2, y2) {
  var a = x1 - x2;
  var b = y2 - y2;
  return Math.sqrt(a * a + b * b);
};

exports.distance = distance;

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

exports.colourInterpolate = colourInterpolate;

var clamp = function clamp(value, max) {
  var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  return Math.min(Math.max(value, min), max);
};
/**
 * Creates an array of stepped colours through an array of colours
 *
 * @param {Array.<{ r: number, g: number, b: number }>} colours
 * @param {number} granularity
 *
 * @returns {Array.<{ r: number, g: number, b: number }>}
 */


exports.clamp = clamp;

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
},{"./baseEngine":"js/utils/baseEngine.js"}],"js/script.js":[function(require,module,exports) {
"use strict";

var _tumult = _interopRequireDefault(require("tumult"));

var _engine = _interopRequireDefault(require("./utils/engine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Engine from './utils/engine3d';
var WIDTH = 480;
var HEIGHT = 480;
var el = document.getElementById('canvas'); // const el = document.getElementById('container');

var app = new _engine.default(el, {
  debug: false,
  width: WIDTH,
  height: HEIGHT
});
var noise = new _tumult.default.Perlin3();

var noiseGen = function noiseGen(x, y) {
  var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var gen = noise.gen(x, y, z);
  return (gen + 1) / 2;
};

var cols = 40;
var rows = 40;
var layers = 15;
var layerDepth = 20;
var xOffset = 0;
var yOffset = 100;
var zOffset = 0;
var threshold = 0.5;
var hue = 150;

function drawShape(x, y, width, height) {
  ctx.save(); // ctx.translate(x + (width / 2), y + (height / 2));
  // ctx.beginPath();
  // ctx.arc(0, 0, width / 2, 0, Math.PI * 2);
  // ctx.fill();

  ctx.translate(x, y);
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawPlane(x, y, z, width, height) {
  var xSize = width / cols;
  var ySize = height / rows;

  for (var _x = 0; _x < cols; _x++) {
    for (var _y = 0; _y < rows; _y++) {
      var point = noiseGen(_x / 10, _y / 10, z);

      if (point > threshold) {
        drawShape(_x * xSize, _y * ySize, xSize + 1, ySize + 1);
      }
    }
  }

  ctx.strokeRect(0, 0, width, height);
}

var radians = function radians(angle) {
  return degrees * (Math.PI / 180);
};

app.onRender(function (_ref) {
  var frame = _ref.frame,
      width = _ref.width,
      height = _ref.height,
      debug = _ref.debug;
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.transform(0.5, -0.1, 0, 0.5, width / 2, width / 2);
  ctx.translate(-(width / 2 + layers * layerDepth / 2), -(height / 2 + layers * layerDepth / 2));

  for (var i = 0; i < layers; i++) {
    ctx.translate(layerDepth, layerDepth);
    ctx.fillStyle = "hsl(".concat(hue, ", ").concat(i / layers * 100 + 0, "%, 50%)");
    ctx.strokeStyle = "hsl(".concat(hue, ", 100%, 50%)");
    drawPlane(0, 0, i / layers + zOffset, width, height);
  }

  xOffset += 0.01;
  yOffset += 0.01;
  zOffset += 0.01;
  ctx.restore();
});
app.start();
},{"tumult":"../node_modules/tumult/index.js","./utils/engine":"js/utils/engine.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53550" + '/');

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