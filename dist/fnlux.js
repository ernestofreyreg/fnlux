!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.createFnlux=n():e.createFnlux=n()}(this,function(){return function(e){function n(r){if(t[r])return t[r].exports;var o=t[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,n),o.loaded=!0,o.exports}var t={};return n.m=e,n.c=t,n.p="",n(0)}([function(e,n,t){e.exports=t(1)},function(e,n){"use strict";function t(e,n,t){function r(e){return u.indexOf(e)>=0}var o=[e],u=[],c=function(e){a(i(e,o[o.length-1]))},i=function(e,t){return(n||[]).reduce(function(n,t){return t(n,e)},t)},f=function(e){var n=Promise.all(Array.isArray(e)?e:[e]).then(function(e){r(n)&&a(e.reduce(function(e,n){return i(n,e)},o[o.length-1]))});return u.push(n),n},p=function(e){var n=u.indexOf(e);n>=0&&u.splice(n,1)},s=function(){if(!(o.length<2)){o.pop();var e=o.pop();a(e)}},a=function(e){o.push(e),t&&t(e)};return{apply:c,applyAsync:f,cancelAsync:p,reducers:n,state:function(){return o[o.length-1]},undo:s}}Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=t}])});