parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"LFj2":[function(require,module,exports) {
function i(i,n,r,t){return JSON.stringify(i,e(n,t),r)}function e(i,e){var n=[],r=[];return null==e&&(e=function(i,e){return n[0]===e?"[Circular ~]":"[Circular ~."+r.slice(0,n.indexOf(e)).join(".")+"]"}),function(t,l){if(n.length>0){var u=n.indexOf(this);~u?n.splice(u+1):n.push(this),~u?r.splice(u,1/0,t):r.push(t),~n.indexOf(l)&&(l=e.call(this,t,l))}else n.push(l);return null==i?l:i.call(this,t,l)}}exports=module.exports=i,exports.getSerialize=e;
},{}],"f53L":[function(require,module,exports) {
"use strict";var n=require("json-stringify-safe"),r=function(){var n=4022871197;return function(r){if(r){r=r.toString();for(var t=0;t<r.length;t++){var e=.02519603282416938*(n+=r.charCodeAt(t));e-=n=e>>>0,n=(e*=n)>>>0,n+=4294967296*(e-=n)}return 2.3283064365386963e-10*(n>>>0)}n=4022871197}},t=function(t){return function(){var e,o,i=48,u=1,a=i,f=new Array(i),c=0,l=new r;for(e=0;e<i;e++)f[e]=l(Math.random());var g=function(){++a>=i&&(a=0);var n=1768863*f[a]+2.3283064365386963e-10*u;return f[a]=n-(u=0|n)},h=function(n){return Math.floor(n*(g()+1.1102230246251565e-16*(2097152*g()|0)))};h.string=function(n){var r,t="";for(r=0;r<n;r++)t+=String.fromCharCode(33+h(94));return t};return h.cleanString=function(n){return n=(n=(n=n.replace(/(^\s*)|(\s*$)/gi,"")).replace(/[\x00-\x1F]/gi,"")).replace(/\n /,"\n")},h.hashString=function(n){for(n=h.cleanString(n),l(n),e=0;e<n.length;e++)for(c=n.charCodeAt(e),o=0;o<i;o++)f[o]-=l(c),f[o]<0&&(f[o]+=1)},h.seed=function(r){null==r&&(r=Math.random()),"string"!=typeof r&&(r=n(r,function(n,r){return"function"==typeof r?r.toString():r})),h.initState(),h.hashString(r)},h.addEntropy=function(){var n=[];for(e=0;e<arguments.length;e++)n.push(arguments[e]);!function(){var n=Array.prototype.slice.call(arguments);for(e=0;e<n.length;e++)for(o=0;o<i;o++)f[o]-=l(n[e]),f[o]<0&&(f[o]+=1)}(c+++(new Date).getTime()+n.join("")+Math.random())},h.initState=function(){for(l(),e=0;e<i;e++)f[e]=l(" ");u=1,a=i},h.done=function(){l=null},void 0!==t&&h.seed(t),h.range=function(n){return h(n)},h.random=function(){return h(Number.MAX_VALUE-1)/Number.MAX_VALUE},h.floatBetween=function(n,r){return h.random()*(r-n)+n},h.intBetween=function(n,r){return Math.floor(h.random()*(r-n+1))+n},h}()};t.create=function(n){return new t(n)},module.exports=t;
},{"json-stringify-safe":"LFj2"}],"xZKK":[function(require,module,exports) {
"use strict";const t=require("random-seed");class s{constructor(t){this.p=new Uint8Array(512),this.seed(t)}gen(){}seed(s){const e=t.create(s||Math.random());for(let t=0;t<256;t++)this.p[t]=t;for(let t=0;t<256;t++){const s=e(256),r=this.p[t];this.p[t]=this.p[s],this.p[s]=r}for(let t=0;t<256;t++)this.p[t+256]=this.p[t]}transform(t){return((...s)=>t.apply(this,s)).bind(this)}octavate(...t){const s=t[0],e=t.slice(1);let r=0,i=0;for(let o=0;o<s;o++){const t=1<<o;r+=this.gen.apply(this,e.map(s=>s*t))/t}for(let o=0;o<s;o++)i+=1/(1<<o);return r/i}}module.exports=s;
},{"random-seed":"f53L"}],"SGJt":[function(require,module,exports) {
"use strict";class t{constructor(t){this.x=t}dot(t){return this.x*t}}const n=[new t(1),new t(-1)];function r(t,r){return n[t[r]%n.length]}module.exports={grad1:r};
},{}],"20ib":[function(require,module,exports) {
"use strict";function n(...n){const t=n.slice(1),u=n[0]-t.reduce((n,t)=>n+t*t,0);return u*u*u*u}function t(n,t,u){return n*(1-u)+t*u}function u(n){return n*n*n*(10+n*(6*n-15))}const e=n.bind(null,1),c=n.bind(null,.5);module.exports={lerp:t,fade:u,cut1:e,cut:c};
},{}],"f6Jh":[function(require,module,exports) {
"use strict";const t=require("../util/noise"),{grad1:e}=require("../util/1d"),{cut1:r}=require("../util/math");class s extends t{gen(t){const s=Math.floor(t)%256,i=t-s;return.5*(r(i)*e(this.p,s).dot(i)+r(i-1)*e(this.p,s+1).dot(i-1))}}module.exports=s;
},{"../util/noise":"xZKK","../util/1d":"SGJt","../util/math":"20ib"}],"IAyg":[function(require,module,exports) {
"use strict";class t{constructor(t,n){this.x=t,this.y=n}dot(t,n){return this.x*t+this.y*n}}const n=[new t(1,0),new t(1,1),new t(0,1),new t(-1,1),new t(-1,0),new t(-1,-1),new t(0,-1),new t(1,-1)];function s(t,s,e){const r=t[s+t[e]]%n.length;return n[r]}const e=.5*(Math.sqrt(3)-1),r=(3-Math.sqrt(3))/6;module.exports={grad2:s,S2_TO_C:e,C_TO_S2:r};
},{}],"Wv7/":[function(require,module,exports) {
"use strict";const t=require("../util/noise"),{grad2:e,S2_TO_C:r,C_TO_S2:s}=require("../util/2d"),{cut:u}=require("../util/math");class i extends t{gen(t,i){const n=(t+i)*r,o=Math.trunc(t+n),c=Math.trunc(i+n),d=(o+c)*s,h=t-(o-d),a=i-(c-d),l=h>a?1:0,p=h>a?0:1,_=h-l+s,q=a-p+s,g=h-1+2*s,m=a-1+2*s;return 70*(u(h,a)*e(this.p,o,c).dot(h,a)+u(_,q)*e(this.p,o+l,c+p).dot(_,q)+u(g,m)*e(this.p,o+1,c+1).dot(g,m))}}module.exports=i;
},{"../util/noise":"xZKK","../util/2d":"IAyg","../util/math":"20ib"}],"JE38":[function(require,module,exports) {
"use strict";const e=require("../util/noise"),{grad1:t}=require("../util/1d"),{lerp:r,fade:s}=require("../util/math");class i extends e{gen(e){const i=Math.floor(e)%256,o=e-i,u=t(this.p,i).dot(o),d=t(this.p,i+1).dot(o-1);return r(u,d,s(o))}}module.exports=i;
},{"../util/noise":"xZKK","../util/1d":"SGJt","../util/math":"20ib"}],"GngH":[function(require,module,exports) {
"use strict";const t=require("../util/noise"),{grad2:e}=require("../util/2d"),{fade:r,lerp:s}=require("../util/math");class i extends t{gen(t,i){const u=Math.trunc(t)%256,d=Math.trunc(i)%256,o=t-u,n=i-d,h=e(this.p,u,d).dot(o,n),a=e(this.p,u+1,d).dot(o-1,n),c=e(this.p,u,d+1).dot(o,n-1),l=e(this.p,u+1,d+1).dot(o-1,n-1);return s(s(h,a,r(o)),s(c,l,r(o)),r(n))}}module.exports=i;
},{"../util/noise":"xZKK","../util/2d":"IAyg","../util/math":"20ib"}],"98wp":[function(require,module,exports) {
"use strict";class n{constructor(n,e,t){this.x=n,this.y=e,this.z=t}dot(n,e,t){return this.x*n+this.y*e+this.z*t}}const e=[new n(1,1,1),new n(-1,1,1),new n(1,-1,1),new n(-1,-1,1),new n(1,1,0),new n(-1,1,0),new n(1,-1,0),new n(-1,-1,0),new n(1,1,-1),new n(-1,1,-1),new n(1,-1,-1),new n(-1,-1,-1)];function t(n,t,s,w){const r=n[t+n[s+n[w]]]%e.length;return e[r]}module.exports={grad3:t};
},{}],"PDJc":[function(require,module,exports) {
"use strict";const t=require("../util/noise"),{grad3:s}=require("../util/3d"),{fade:e,lerp:i}=require("../util/math");class r extends t{gen(t,r,d){const o=Math.trunc(t)%256,h=Math.trunc(r)%256,u=Math.trunc(d)%256,p=t-o,n=r-h,a=d-u,c=s(this.p,o,h,u).dot(p,n,a),l=s(this.p,o+1,h,u).dot(p-1,n,a),q=s(this.p,o,h+1,u).dot(p,n-1,a),M=s(this.p,o+1,h+1,u).dot(p-1,n-1,a),g=s(this.p,o,h,u+1).dot(p,n,a-1),m=s(this.p,o+1,h,u+1).dot(p-1,n,a-1),x=s(this.p,o,h+1,u+1).dot(p,n-1,a-1),f=s(this.p,o+1,h+1,u+1).dot(p-1,n-1,a-1);return i(i(i(c,l,p),i(q,M,p),e(n)),i(i(g,m,p),i(x,f,p),e(n)),e(a))}}module.exports=r;
},{"../util/noise":"xZKK","../util/3d":"98wp","../util/math":"20ib"}],"U54G":[function(require,module,exports) {
"use strict";class n{constructor(n,e,w,t){this.x=n,this.y=e,this.z=w,this.t=t}dot(n,e,w,t){return this.x*n+this.y*e+this.z*w+this.t*t}}const e=[new n(0,1,1,1),new n(0,1,1,-1),new n(0,1,-1,1),new n(0,1,-1,-1),new n(0,-1,1,1),new n(0,-1,1,-1),new n(0,-1,-1,1),new n(0,-1,-1,-1),new n(1,0,1,1),new n(1,0,1,-1),new n(1,0,-1,1),new n(1,0,-1,-1),new n(-1,0,1,1),new n(-1,0,1,-1),new n(-1,0,-1,1),new n(-1,0,-1,-1),new n(1,1,0,1),new n(1,1,0,-1),new n(1,-1,0,1),new n(1,-1,0,-1),new n(-1,1,0,1),new n(-1,1,0,-1),new n(-1,-1,0,1),new n(-1,-1,0,-1),new n(1,1,1,0),new n(1,1,-1,0),new n(1,-1,1,0),new n(1,-1,-1,0),new n(-1,1,1,0),new n(-1,1,-1,0),new n(-1,-1,1,0),new n(-1,-1,-1,0)];function w(n,w,t,s,i){const h=n[w+n[t+n[s+n[i]]]]%e.length;return e[h]}module.exports={grad4:w};
},{}],"OM1q":[function(require,module,exports) {
"use strict";const t=require("../util/noise"),{grad4:s}=require("../util/4d"),{fade:i,lerp:d}=require("../util/math");class h extends t{gen(t,h,o,p){const e=Math.trunc(t)%256,r=Math.trunc(h)%256,u=Math.trunc(o)%256,n=Math.trunc(p)%256,a=t-e,c=h-r,l=o-u,M=p-n,q=s(this.p,e,r,u,n).dot(a,c,l,M),g=s(this.p,e+1,r,u,n).dot(a-1,c,l),m=s(this.p,e,r+1,u,n).dot(a,c-1,l),x=s(this.p,e+1,r+1,u,n).dot(a-1,c-1,l),f=s(this.p,e,r,u+1,n).dot(a,c,l-1),b=s(this.p,e+1,r,u+1,n).dot(a-1,c,l-1),j=s(this.p,e,r+1,u+1,n).dot(a,c-1,l-1),k=s(this.p,e+1,r+1,u+1,n).dot(a-1,c-1,l-1),v=s(this.p,e,r,u,n+1).dot(a,c,l,M-1),w=s(this.p,e+1,r,u,n+1).dot(a-1,c,l,M-1),y=s(this.p,e,r+1,u,n+1).dot(a,c-1,l,M-1),z=s(this.p,e+1,r+1,u,n+1).dot(a-1,c-1,l,M-1),A=s(this.p,e,r,u+1,n+1).dot(a,c,l-1,M-1),B=s(this.p,e+1,r,u+1,n+1).dot(a-1,c,l-1,M-1),C=s(this.p,e,r+1,u+1,n+1).dot(a,c-1,l-1,M-1),D=s(this.p,e+1,r+1,u+1,n+1).dot(a-1,c-1,l-1,M-1);return d(d(d(d(q,g,a),d(m,x,a),i(c)),d(d(f,b,a),d(j,k,a),i(c)),i(l)),d(d(d(v,w,a),d(y,z,a),i(c)),d(d(A,B,a),d(C,D,a),i(c)),i(l)),i(M))}}module.exports=h;
},{"../util/noise":"xZKK","../util/4d":"U54G","../util/math":"20ib"}],"ovX9":[function(require,module,exports) {
"use strict";const{lerp:t,fade:e}=require("./math");function n(t,e){return 1===e.length?t[e[0]]:t[e[0]+n(t,e.slice(1))]}class l{constructor(t){this.R=t}dot(t){let e=0;for(let n=0;n<t.length;n++)e+=this.R[n]*t[n];return e}}const r=[];function c(t){for(let e=0;e<2*t;e++){const n=new Array(t).fill(0);n[e%t]=e/t>=1?1:-1,r[e]=new l(n)}}function o(n,l){if(1===l.length)return t(n[0],n[1],e(l[0]));const r=n.slice(0,Math.floor(n.length/2)),c=n.slice(Math.ceil(n.length/2));return t(o(r,l.slice(0,l.length-1)),o(c,l.slice(0,l.length-1)),e(l[l.length-1]))}function s(t,e,l,o){const s=[];0===r.length&&c(e);for(let c=0;c<2<<e-1;c++){const i=l.slice(),h=o.slice();let u=c;for(let t=0;t<e;t++)1&u&&(i[t]+=1,h[t]-=1),u>>=1;s[c]=r[n(t,i)%r.length].dot(h)}return s}module.exports={lerpN:o,getNs:s};
},{"./math":"20ib"}],"771I":[function(require,module,exports) {
"use strict";const e=require("../util/noise"),{lerpN:t,getNs:s}=require("../util/nd");class n extends e{gen(...e){const n=[],r=[];for(let t=0;t<e.length;t++)n[t]=Math.trunc(e[t])%256,r[t]=e[t]-n[t];const l=s(this.p,e.length,n,r);return t(l,r)}}module.exports=n;
},{"../util/noise":"xZKK","../util/nd":"ovX9"}],"rSCj":[function(require,module,exports) {
const e=require("./simplex/simplex1"),r=require("./simplex/simplex2"),i=require("./perlin/perlin1"),l=require("./perlin/perlin2"),p=require("./perlin/perlin3"),n=require("./perlin/perlin4"),u=require("./perlin/perlinN");module.exports={Simplex1:e,Simplex2:r,Perlin1:i,Perlin2:l,Perlin3:p,Perlin4:n,PerlinN:u};
},{"./simplex/simplex1":"f6Jh","./simplex/simplex2":"Wv7/","./perlin/perlin1":"JE38","./perlin/perlin2":"GngH","./perlin/perlin3":"PDJc","./perlin/perlin4":"OM1q","./perlin/perlinN":"771I"}],"KhfA":[function(require,module,exports) {
"use strict";module.exports=require("./lib");
},{"./lib":"rSCj"}],"4Bm0":[function(require,module,exports) {
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
},{"raf-loop":"Hgz4"}],"L4bL":[function(require,module,exports) {
"use strict";var t=r(require("tumult")),e=r(require("./utils/engine"));function r(t){return t&&t.__esModule?t:{default:t}}var n=480,c=480,a=document.getElementById("canvas"),u=new e.default(a,{debug:!1,width:n,height:c}),l=new t.default.Perlin3,o=function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;return(l.gen(t,e,r)+1)/2},i=40,s=40,f=15,d=20,x=0,v=100,h=0,g=.5,m=150;function w(t,e,r,n){ctx.save(),ctx.translate(t,e),ctx.fillRect(0,0,r,n),ctx.restore()}function R(t,e,r,n,c){for(var a=n/i,u=c/s,l=0;l<i;l++)for(var f=0;f<s;f++){o(l/10,f/10,r)>g&&w(l*a,f*u,a+1,u+1)}ctx.strokeRect(0,0,n,c)}var y=function(t){return degrees*(Math.PI/180)};u.onRender(function(t){t.frame;var e=t.width,r=t.height;t.debug;ctx.clearRect(0,0,e,r),ctx.save(),ctx.transform(.5,-.1,0,.5,e/2,e/2),ctx.translate(-(e/2+f*d/2),-(r/2+f*d/2));for(var n=0;n<f;n++)ctx.translate(d,d),ctx.fillStyle="hsl(".concat(m,", ").concat(n/f*100+0,"%, 50%)"),ctx.strokeStyle="hsl(".concat(m,", 100%, 50%)"),R(0,0,n/f+h,e,r);x+=.01,v+=.01,h+=.01,ctx.restore()}),u.start();
},{"tumult":"KhfA","./utils/engine":"lyxZ"}]},{},["L4bL"], null)
//# sourceMappingURL=script.f236ded7.js.map