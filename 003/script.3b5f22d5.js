parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"4Bm0":[function(require,module,exports) {
"function"==typeof Object.create?module.exports=function(t,e){e&&(t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}))}:module.exports=function(t,e){if(e){t.super_=e;var o=function(){};o.prototype=e.prototype,t.prototype=new o,t.prototype.constructor=t}};
},{}],"T2os":[function(require,module,exports) {
"use strict";var e,t="object"==typeof Reflect?Reflect:null,n=t&&"function"==typeof t.apply?t.apply:function(e,t,n){return Function.prototype.apply.call(e,t,n)};function r(e){console&&console.warn&&console.warn(e)}e=t&&"function"==typeof t.ownKeys?t.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var i=Number.isNaN||function(e){return e!=e};function o(){o.init.call(this)}module.exports=o,o.EventEmitter=o,o.prototype._events=void 0,o.prototype._eventsCount=0,o.prototype._maxListeners=void 0;var s=10;function u(e){return void 0===e._maxListeners?o.defaultMaxListeners:e._maxListeners}function f(e,t,n,i){var o,s,f;if("function"!=typeof n)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof n);if(void 0===(s=e._events)?(s=e._events=Object.create(null),e._eventsCount=0):(void 0!==s.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),s=e._events),f=s[t]),void 0===f)f=s[t]=n,++e._eventsCount;else if("function"==typeof f?f=s[t]=i?[n,f]:[f,n]:i?f.unshift(n):f.push(n),(o=u(e))>0&&f.length>o&&!f.warned){f.warned=!0;var p=new Error("Possible EventEmitter memory leak detected. "+f.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");p.name="MaxListenersExceededWarning",p.emitter=e,p.type=t,p.count=f.length,r(p)}return e}function p(){for(var e=[],t=0;t<arguments.length;t++)e.push(arguments[t]);this.fired||(this.target.removeListener(this.type,this.wrapFn),this.fired=!0,n(this.listener,this.target,e))}function v(e,t,n){var r={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},i=p.bind(r);return i.listener=n,r.wrapFn=i,i}function h(e,t,n){var r=e._events;if(void 0===r)return[];var i=r[t];return void 0===i?[]:"function"==typeof i?n?[i.listener||i]:[i]:n?y(i):c(i,i.length)}function a(e){var t=this._events;if(void 0!==t){var n=t[e];if("function"==typeof n)return 1;if(void 0!==n)return n.length}return 0}function c(e,t){for(var n=new Array(t),r=0;r<t;++r)n[r]=e[r];return n}function l(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}function y(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}Object.defineProperty(o,"defaultMaxListeners",{enumerable:!0,get:function(){return s},set:function(e){if("number"!=typeof e||e<0||i(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");s=e}}),o.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},o.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||i(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},o.prototype.getMaxListeners=function(){return u(this)},o.prototype.emit=function(e){for(var t=[],r=1;r<arguments.length;r++)t.push(arguments[r]);var i="error"===e,o=this._events;if(void 0!==o)i=i&&void 0===o.error;else if(!i)return!1;if(i){var s;if(t.length>0&&(s=t[0]),s instanceof Error)throw s;var u=new Error("Unhandled error."+(s?" ("+s.message+")":""));throw u.context=s,u}var f=o[e];if(void 0===f)return!1;if("function"==typeof f)n(f,this,t);else{var p=f.length,v=c(f,p);for(r=0;r<p;++r)n(v[r],this,t)}return!0},o.prototype.addListener=function(e,t){return f(this,e,t,!1)},o.prototype.on=o.prototype.addListener,o.prototype.prependListener=function(e,t){return f(this,e,t,!0)},o.prototype.once=function(e,t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t);return this.on(e,v(this,e,t)),this},o.prototype.prependOnceListener=function(e,t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t);return this.prependListener(e,v(this,e,t)),this},o.prototype.removeListener=function(e,t){var n,r,i,o,s;if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t);if(void 0===(r=this._events))return this;if(void 0===(n=r[e]))return this;if(n===t||n.listener===t)0==--this._eventsCount?this._events=Object.create(null):(delete r[e],r.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(i=-1,o=n.length-1;o>=0;o--)if(n[o]===t||n[o].listener===t){s=n[o].listener,i=o;break}if(i<0)return this;0===i?n.shift():l(n,i),1===n.length&&(r[e]=n[0]),void 0!==r.removeListener&&this.emit("removeListener",e,s||t)}return this},o.prototype.off=o.prototype.removeListener,o.prototype.removeAllListeners=function(e){var t,n,r;if(void 0===(n=this._events))return this;if(void 0===n.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==n[e]&&(0==--this._eventsCount?this._events=Object.create(null):delete n[e]),this;if(0===arguments.length){var i,o=Object.keys(n);for(r=0;r<o.length;++r)"removeListener"!==(i=o[r])&&this.removeAllListeners(i);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(void 0!==t)for(r=t.length-1;r>=0;r--)this.removeListener(e,t[r]);return this},o.prototype.listeners=function(e){return h(this,e,!0)},o.prototype.rawListeners=function(e){return h(this,e,!1)},o.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):a.call(e,t)},o.prototype.listenerCount=a,o.prototype.eventNames=function(){return this._eventsCount>0?e(this._events):[]};
},{}],"nAQP":[function(require,module,exports) {
var global = arguments[3];
var e=arguments[3];module.exports=e.performance&&e.performance.now?function(){return performance.now()}:Date.now||function(){return+new Date};
},{}],"pBGv":[function(require,module,exports) {

var t,e,n=module.exports={};function r(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function i(e){if(t===setTimeout)return setTimeout(e,0);if((t===r||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}function u(t){if(e===clearTimeout)return clearTimeout(t);if((e===o||!e)&&clearTimeout)return e=clearTimeout,clearTimeout(t);try{return e(t)}catch(n){try{return e.call(null,t)}catch(n){return e.call(this,t)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:r}catch(n){t=r}try{e="function"==typeof clearTimeout?clearTimeout:o}catch(n){e=o}}();var c,s=[],l=!1,a=-1;function f(){l&&c&&(l=!1,c.length?s=c.concat(s):a=-1,s.length&&h())}function h(){if(!l){var t=i(f);l=!0;for(var e=s.length;e;){for(c=s,s=[];++a<e;)c&&c[a].run();a=-1,e=s.length}c=null,l=!1,u(t)}}function m(t,e){this.fun=t,this.array=e}function p(){}n.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];s.push(new m(t,e)),1!==s.length||l||i(h)},m.prototype.run=function(){this.fun.apply(null,this.array)},n.title="browser",n.env={},n.argv=[],n.version="",n.versions={},n.on=p,n.addListener=p,n.once=p,n.off=p,n.removeListener=p,n.removeAllListeners=p,n.emit=p,n.prependListener=p,n.prependOnceListener=p,n.listeners=function(t){return[]},n.binding=function(t){throw new Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(t){throw new Error("process.chdir is not supported")},n.umask=function(){return 0};
},{}],"xNmf":[function(require,module,exports) {
var process = require("process");
var e=require("process");(function(){var n,r,t,o,u,i;"undefined"!=typeof performance&&null!==performance&&performance.now?module.exports=function(){return performance.now()}:null!=e&&e.hrtime?(module.exports=function(){return(n()-u)/1e6},r=e.hrtime,o=(n=function(){var e;return 1e9*(e=r())[0]+e[1]})(),i=1e9*e.uptime(),u=o-i):Date.now?(module.exports=function(){return Date.now()-t},t=Date.now()):(module.exports=function(){return(new Date).getTime()-t},t=(new Date).getTime())}).call(this);
},{"process":"pBGv"}],"oXMl":[function(require,module,exports) {
var global = arguments[3];
for(var e=arguments[3],n=require("performance-now"),t="undefined"==typeof window?e:window,a=["moz","webkit"],l="AnimationFrame",c=t["request"+l],o=t["cancel"+l]||t["cancelRequest"+l],r=0;!c&&r<a.length;r++)c=t[a[r]+"Request"+l],o=t[a[r]+"Cancel"+l]||t[a[r]+"CancelRequest"+l];if(!c||!o){var i=0,u=0,f=[],m=1e3/60;c=function(e){if(0===f.length){var t=n(),a=Math.max(0,m-(t-i));i=a+t,setTimeout(function(){var e=f.slice(0);f.length=0;for(var n=0;n<e.length;n++)if(!e[n].cancelled)try{e[n].callback(i)}catch(t){setTimeout(function(){throw t},0)}},Math.round(a))}return f.push({handle:++u,callback:e,cancelled:!1}),u},o=function(e){for(var n=0;n<f.length;n++)f[n].handle===e&&(f[n].cancelled=!0)}}module.exports=function(e){return c.call(t,e)},module.exports.cancel=function(){o.apply(t,arguments)},module.exports.polyfill=function(e){e||(e=t),e.requestAnimationFrame=c,e.cancelAnimationFrame=o};
},{"performance-now":"xNmf"}],"Hgz4":[function(require,module,exports) {
var t=require("inherits"),i=require("events").EventEmitter,r=require("right-now"),s=require("raf");function n(t){if(!(this instanceof n))return new n(t);this.running=!1,this.last=r(),this._frame=0,this._tick=this.tick.bind(this),t&&this.on("tick",t)}module.exports=n,t(n,i),n.prototype.start=function(){if(!this.running)return this.running=!0,this.last=r(),this._frame=s(this._tick),this},n.prototype.stop=function(){return this.running=!1,0!==this._frame&&s.cancel(this._frame),this._frame=0,this},n.prototype.tick=function(){this._frame=s(this._tick);var t=r(),i=t-this.last;this.emit("tick",i),this.last=t};
},{"inherits":"4Bm0","events":"T2os","right-now":"nAQP","raf":"oXMl"}],"lyxZ":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=e(require("raf-loop"));function e(t){return t&&t.__esModule?t:{default:t}}function i(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),i.push.apply(i,n)}return i}function n(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?i(n,!0).forEach(function(e){o(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):i(n).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}function o(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function a(t,e,i){return e&&s(t.prototype,e),i&&s(t,i),t}var h={debug:!1,width:480,height:480,pixelRatio:window.devicePixelRatio,clickToggleDebug:!0},c=function(){function e(i){var o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};r(this,e),this.options=n({},h,{opts:o}),this.canvasEl=i,this.canvasCtx=this.canvasEl.getContext("2d"),this.frame=0,this.loop=(0,t.default)(this.update.bind(this)),this._preloader=function(){},this._renderer=function(){},this._addEventListeners(),this.updateDimensions(this.options.width,this.options.height,this.options.pixelRatio)}return a(e,[{key:"_addEventListeners",value:function(){var t=this;this.canvasEl.addEventListener("click",function(){t.options.debug=!t.options.debug},!1)}},{key:"updateDimensions",value:function(t,e,i){this.canvasEl.width=t*i,this.canvasEl.height=e*i,this.canvasEl.style.width="".concat(t,"px"),this.canvasEl.style.height="".concat(e,"px"),this.canvasCtx.scale(i,i)}},{key:"onPreload",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){};this._preloader=t}},{key:"onRender",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){};this._renderer=t}},{key:"start",value:function(){this._preloader(this.canvasCtx,{debug:this.options.debug,width:this.options.width,height:this.options.height}),this.loop.start()}},{key:"update",value:function(t){this._renderer(this.canvasCtx,{debug:this.options.debug,frame:this.frame,deltaTime:t,width:this.options.width,height:this.options.height}),this.frame++}},{key:"stop",value:function(){this.loop.stop()}}]),e}(),u=c;exports.default=u;
},{"raf-loop":"Hgz4"}],"ldwA":[function(require,module,exports) {
"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function n(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var r=function(){function t(n,r){e(this,t),this.x=n,this.y=r}return n(t,[{key:"sub",value:function(e){var t=e.x,n=e.y;return this.x-=t,this.y-=n,this}},{key:"add",value:function(e){var t=e.x,n=e.y;return this.x+=t,this.y+=n,this}}]),t}();exports.default=r;
},{}],"taTA":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=t(require("../utils/SimpleVector"));function t(e){return e&&e.__esModule?e:{default:e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function r(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),e}var o=function(){function t(i,r){var o=i.x,a=i.y,u=r.x,s=r.y;n(this,t),this.position=new e.default(o||0,a||0),this.speed=new e.default(u||0,s||0)}return r(t,[{key:"update",value:function(e,t){this.position.add(this.speed)}},{key:"render",value:function(e,t,n){e.save(),e.beginPath(),e.arc(this.position.x,this.position.y,2,0,2*Math.PI),e.fill(),e.restore()}}]),t}();exports.default=o;
},{"../utils/SimpleVector":"ldwA"}],"HUaJ":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.distance=exports.randomBetween=void 0;var e=function(e,t){return(t-e)*Math.random()+e};exports.randomBetween=e;var t=function(e,t,r,n){var o=e-r,a=n-n;return Math.sqrt(o*o+a*a)};exports.distance=t;
},{}],"c+xn":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=i(require("./Dot")),e=require("../utils/utils");function i(t){return t&&t.__esModule?t:{default:t}}function s(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}function n(t,e,i){return e&&o(t.prototype,e),i&&o(t,i),t}var r=function(){function i(t,e,o){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"red";s(this,i),this.dimensions={width:t,height:e},this.dots=this._createDots(o),this.color=n}return n(i,[{key:"_createDots",value:function(t){for(var e=[],i=this.dimensions.width/t,s=0;s<t;s++)e.push(this._createDot(i*s));return e}},{key:"_createDot",value:function(i){return new t.default({x:i,y:(0,e.randomBetween)(0,.5*this.dimensions.height)},{x:-1,y:0})}},{key:"update",value:function(){for(var t=[],e=0;e<this.dots.length;e++)this.dots[e].update(this.dimensions.width,this.dimensions.height),this.dots[e].position.x<0&&t.push(e);for(var i=0;i<t.length;i++)this.dots.splice(t[i],1),this.dots.push(this._createDot(this.dimensions.width))}},{key:"render",value:function(t){if(arguments.length>1&&void 0!==arguments[1]&&arguments[1])for(var e=0;e<this.dots.length;e++)this.dots[e].render(t,this.dimensions.width,this.dimensions.height);t.save(),t.fillStyle=this.color,t.beginPath();for(var i=0;i<this.dots.length;i++){var s=this.dots[i].position,o=s.x,n=s.y;if(0==i)t.moveTo(o,n);else{var r=this.dots[i-1].position,h=(r.x,r.y);t.bezierCurveTo(o,h,o,h,o,n)}}t.lineTo(this.dimensions.width,this.dimensions.height),t.lineTo(0,this.dimensions.height),t.closePath(),t.fill(),t.restore()}}]),i}();exports.default=r;
},{"./Dot":"taTA","../utils/utils":"HUaJ"}],"L4bL":[function(require,module,exports) {
"use strict";var e=r(require("./utils/engine")),t=r(require("./components/Line")),n=require("./utils/utils");function r(e){return e&&e.__esModule?e:{default:e}}var a,i=480,u=480,l=new e.default(document.getElementById("canvas"),{debug:!1,width:i,height:i}),f=["#f44336","#F48FB1","#ff8a65","#FFC107","#f4511e"],d=[new t.default(i,u/2,4,f[1]),new t.default(i,u/2,6,f[2]),new t.default(i,u/2,8,f[3])];l.onRender(function(e,t){t.frame;var n=t.width,r=t.height,a=t.debug;e.save(),e.fillStyle=f[0],e.fillRect(0,0,n,r),e.beginPath(),e.arc(n/2,r/2,.25*n,0,2*Math.PI),e.clip(),e.fillStyle=f[4],e.fillRect(0,0,n,r),d.forEach(function(e){return e.update()}),d.forEach(function(t,n){e.save(),e.translate(0,.2*r+r/6*n),t.render(e,a),e.restore()}),e.restore()}),l.start();
},{"./utils/engine":"lyxZ","./components/Line":"c+xn","./utils/utils":"HUaJ"}]},{},["L4bL"], null)
//# sourceMappingURL=script.3b5f22d5.js.map