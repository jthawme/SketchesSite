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
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=e(require("raf-loop"));function e(t){return t&&t.__esModule?t:{default:t}}function i(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),i.push.apply(i,n)}return i}function n(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?i(n,!0).forEach(function(e){o(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):i(n).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}function o(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function a(t,e,i){return e&&s(t.prototype,e),i&&s(t,i),t}var c={debug:!1,width:480,height:480,pixelRatio:window.devicePixelRatio,clickToggleDebug:!0,pixelate:1},u=function(){function e(i){var o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};r(this,e),this.options=n({},c,{},o),this.canvasEl=i,this.canvasCtx=this.canvasEl.getContext("2d"),window.ctx=this.canvasCtx,this.frame=0,this.loop=(0,t.default)(this.update.bind(this)),this._renderer=function(){},this._addEventListeners(),this.updateDimensions(this.options.width,this.options.height,this.options.pixelate,this.options.pixelRatio)}return a(e,[{key:"_addEventListeners",value:function(){var t=this;this.canvasEl.addEventListener("click",function(){t.options.debug=!t.options.debug,document.body.classList.toggle("debug",t.options.debug)},!1)}},{key:"updateDimensions",value:function(t,e,i,n){this.canvasEl.width=t*n,this.canvasEl.height=e*n,this.canvasEl.width=t*n,this.canvasEl.height=e*n,this.canvasEl.style.width="".concat(t*i,"px"),this.canvasEl.style.height="".concat(e*i,"px"),this.canvasCtx.scale(n,n)}},{key:"onRender",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){};this._renderer=t}},{key:"start",value:function(){this.loop.start()}},{key:"update",value:function(t){this._renderer({debug:this.options.debug,frame:this.frame,deltaTime:t,width:this.options.width,height:this.options.height}),this.frame++}},{key:"stop",value:function(){this.loop.stop()}}]),e}(),h=u;exports.default=h;
},{"raf-loop":"Hgz4"}],"9F4T":[function(require,module,exports) {
"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function n(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var i=function(){function e(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=n.x,u=void 0===i?0:i,a=n.y,r=void 0===a?0:a,s=n.magnitude,h=void 0===s?1:s;return t(this,e),this.x=u,this.y=r,this.magnitude=h,this}return n(e,[{key:"set",value:function(t,e){return this.x=t,this.y=e,this}},{key:"setMag",value:function(t){return this.normalize(),this.magnitude=t,this.mult(this.magnitude)}},{key:"setAngle",value:function(t){return this.x=Math.cos(t),this.y=Math.sin(t),this.mult(this.magnitude)}},{key:"getAngle",value:function(){return Math.atan2(this.y,this.x)}},{key:"getAngleOf",value:function(t){var e=t.x,n=t.y;return Math.atan2(n-this.y,e-this.y)}},{key:"rotate",value:function(t){var e=this.getAngle()+t;this.setAngle(e%(2*Math.PI))}},{key:"normalize",value:function(){return this.mult(1/this.magnitude)}},{key:"mult",value:function(t){return this.x*=t,this.y*=t,this}},{key:"div",value:function(t){return this.x/=t,this.y/=t,this}},{key:"sub",value:function(t){var e=t.x,n=t.y;return this.x-=e,this.y-=n,this}},{key:"add",value:function(t){var e=t.x,n=t.y;return this.x+=e,this.y+=n,this}},{key:"getDistance",value:function(t){var e=t.x,n=t.y,i=this.x-e,u=this.y-n;return Math.sqrt(i*i+u*u)}},{key:"randomAngle",value:function(){return this.setAngle(2*Math.PI*Math.random())}},{key:"clone",value:function(){return new e({x:this.x,y:this.y,magnitude:this.magnitude})}}]),e}();exports.default=i;
},{}],"gNN/":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=e(require("./utils/vector"));function e(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function n(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function o(t,e,i){return e&&n(t.prototype,e),i&&n(t,i),t}var a=function(){function e(n){var o=n.x,a=void 0===o?0:o,r=n.y,s=void 0===r?0:r;i(this,e),this.position=new t.default({x:a,y:s}),this.velocity=(new t.default).setAngle(Math.PI).setMag(1),this.rotateAmount=.01*Math.PI,this.currentRotate=0,this.leneance=20}return o(e,[{key:"_outOfBounds",value:function(t,e,i){var n=t.x,o=t.y;return n<0||o<0||n>=e||o>=i}},{key:"_wrapPosition",value:function(t,e){var i=this.position,n=i.x,o=i.y;n<-this.leneance&&(this.position.x=t+this.leneance),o<-this.leneance&&(this.position.y=e+this.leneance),n>t+this.leneance&&(this.position.x=-this.leneance),o>e+this.leneance&&(this.position.y=-this.leneance)}},{key:"update",value:function(t,e,i){if(t%30==0){var n=Math.random();n>.6?this.currentRotate=n<.8?this.rotateAmount:-this.rotateAmount:n>.4&&(this.currentRotate=0)}this.velocity.rotate(this.currentRotate),this.position.add(this.velocity),this._wrapPosition(e,i)}},{key:"render",value:function(){var t=this;ctx.save(),ctx.beginPath(),ctx.arc(this.position.x,this.position.y,3,0,2*Math.PI),ctx.fill();var e=function(e){return Math.cos(t.velocity.getAngle())*e+t.position.x},i=function(e){return Math.sin(t.velocity.getAngle())*e+t.position.y};ctx.beginPath(),ctx.moveTo(e(1),i(1)),ctx.lineTo(e(10),i(10)),ctx.stroke(),ctx.restore()}}]),e}();exports.default=a;
},{"./utils/vector":"9F4T"}],"6ixC":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=t(require("./utils/vector"));function t(e){return e&&e.__esModule?e:{default:e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function a(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}var o=function(){function t(r){var a=r.x,o=r.y,i=r.angle;n(this,t),this.position=new e.default({x:a,y:o}),this.angle=(new e.default).setAngle(i)}return a(t,[{key:"update",value:function(e,t){var n=e.x,r=e.y;this.position.set(n,r),this.angle.setAngle(t.getAngle())}},{key:"render",value:function(e,t){var n=t.fontSize,r=t.fontWeight;ctx.save(),ctx.font="".concat(r," ").concat(n,"px Helvetica");var a=ctx.measureText(e);return ctx.translate(this.position.x,this.position.y),ctx.rotate(this.angle.getAngle()+Math.PI),ctx.fillText(e,-n/2,.3*n),ctx.restore(),a}}]),t}();exports.default=o;
},{"./utils/vector":"9F4T"}],"jNJA":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=i(require("./Pointer")),t=i(require("./LinePoint"));function i(e){return e&&e.__esModule?e:{default:e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function o(e,t,i){return t&&r(e.prototype,t),i&&r(e,i),e}var a=function(){function i(r,o,a){var l=this,s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},h=s.letterSpacing,u=void 0===h?25:h,d=s.fontSize,f=void 0===d?48:d,c=s.fontWeight,v=void 0===c?"bold":c,p=arguments.length>4?arguments[4]:void 0;n(this,i),this.letters=a.split(""),this.text={letterSpacing:u,fontSize:f,fontWeight:v},this.offset=p,this.header=new e.default({x:r,y:o}),this.line=new Array(1e3).fill(0).map(function(e,i){return new t.default({x:l.header.position.x+1*i,y:l.header.position.y,angle:l.header.velocity.getAngle()})})}return o(i,[{key:"_cascadeLine",value:function(){for(var e=this.line.length-1;e>=0;e--)0==e?this.line[e].update(this.header.position,this.header.velocity):this.line[e].update(this.line[e-1].position,this.line[e-1].angle)}},{key:"update",value:function(e,t,i){this.header.update(e,t,i),this._cascadeLine()}},{key:"render",value:function(){for(var e=0,t=0,i=0;i<this.line.length;i++)if(i===t&&e<this.letters.length){var n=this.line[i].render(this.letters[e],this.text);t+=Math.round(n.width),e++}}}]),i}();exports.default=a;
},{"./Pointer":"gNN/","./LinePoint":"6ixC"}],"L4bL":[function(require,module,exports) {
"use strict";var e=n(require("./utils/engine")),t=n(require("./SnakeText"));function n(e){return e&&e.__esModule?e:{default:e}}var l=480,o=480,a=document.getElementById("canvas"),i=new e.default(a,{debug:!1,width:l,height:o}),r=[new t.default(50,130,"Modern Baseball",{fontSize:48,fontWeight:"bold"},80),new t.default(42,180,"Beach Slang",{fontSize:32,fontWeight:"bold"},60),new t.default(37,216,"Chumped",{fontSize:21,fontWeight:"bold"},40),new t.default(37,250,"Crow Bait",{fontSize:21,fontWeight:"bold"},20)];i.onRender(function(e){var t=e.frame,n=e.width,l=e.height;e.debug;ctx.clearRect(0,0,n,l),ctx.font="bold 12px Helvetica",ctx.fillText("Noisey presents",30,50),ctx.save(),ctx.beginPath(),ctx.fillStyle="orange",ctx.moveTo(n,0),ctx.lineTo(0,l),ctx.lineTo(n,l),ctx.fill(),ctx.restore();for(var o=0;o<r.length;o++)r[o].offset<t&&r[o].update(t,n,l),r[o].render();ctx.save(),ctx.translate(30,380),ctx.font="bold 12px Helvetica",ctx.fillText("Friday 5th September",0,0),ctx.fillText("Brooklyn Bazaar",0,20),ctx.fillText("Free Entry",0,40),ctx.restore()}),i.start();
},{"./utils/engine":"lyxZ","./SnakeText":"jNJA"}]},{},["L4bL"], null)
//# sourceMappingURL=script.e510a51a.js.map