(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/navbar/navbar"],{2745:function(t,n,e){"use strict";var a=e("3dd0"),u=e.n(a);u.a},2878:function(t,n,e){"use strict";e.d(n,"b",(function(){return a})),e.d(n,"c",(function(){return u})),e.d(n,"a",(function(){}));var a=function(){var t=this,n=t.$createElement;t._self._c;t._isMounted||(t.e0=function(n){return t.$util.navigateBack()})},u=[]},"3dd0":function(t,n,e){},"94ec":function(t,n,e){"use strict";e.r(n);var a=e("e6f5"),u=e.n(a);for(var r in a)["default"].indexOf(r)<0&&function(t){e.d(n,t,(function(){return a[t]}))}(r);n["default"]=u.a},c77c:function(t,n,e){"use strict";e.r(n);var a=e("2878"),u=e("94ec");for(var r in u)["default"].indexOf(r)<0&&function(t){e.d(n,t,(function(){return u[t]}))}(r);e("2745");var i=e("f0c5"),o=Object(i["a"])(u["default"],a["b"],a["c"],!1,null,"47ce9d1a",null,!1,a["a"],void 0);n["default"]=o.exports},e6f5:function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e={props:{bgColor:{type:String,default:"transparent"},showBar:{type:Boolean,default:!0},showBack:{type:Boolean,default:!0}},data:function(){return{statusBarHeight:0}},beforeMount:function(){var n=t.getSystemInfoSync();this.statusBarHeight=n.statusBarHeight;var e=n.system.indexOf("iOS")>-1;this.statusBarHeight=e?this.statusBarHeight-2:this.statusBarHeight+2,console.log(this.statusBarHeight)}};n.default=e}).call(this,e("543d")["default"])}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/navbar/navbar-create-component',
    {
        'components/navbar/navbar-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("c77c"))
        })
    },
    [['components/navbar/navbar-create-component']]
]);
