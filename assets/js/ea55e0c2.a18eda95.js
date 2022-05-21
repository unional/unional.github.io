"use strict";(self.webpackChunkxyz=self.webpackChunkxyz||[]).push([[158],{3905:function(t,e,n){n.d(e,{Zo:function(){return c},kt:function(){return m}});var o=n(7294);function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function a(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,o)}return n}function i(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?a(Object(n),!0).forEach((function(e){r(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function l(t,e){if(null==t)return{};var n,o,r=function(t,e){if(null==t)return{};var n,o,r={},a=Object.keys(t);for(o=0;o<a.length;o++)n=a[o],e.indexOf(n)>=0||(r[n]=t[n]);return r}(t,e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);for(o=0;o<a.length;o++)n=a[o],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(r[n]=t[n])}return r}var u=o.createContext({}),p=function(t){var e=o.useContext(u),n=e;return t&&(n="function"==typeof t?t(e):i(i({},e),t)),n},c=function(t){var e=p(t.components);return o.createElement(u.Provider,{value:e},t.children)},s={inlineCode:"code",wrapper:function(t){var e=t.children;return o.createElement(o.Fragment,{},e)}},f=o.forwardRef((function(t,e){var n=t.components,r=t.mdxType,a=t.originalType,u=t.parentName,c=l(t,["components","mdxType","originalType","parentName"]),f=p(n),m=r,d=f["".concat(u,".").concat(m)]||f[m]||s[m]||a;return n?o.createElement(d,i(i({ref:e},c),{},{components:n})):o.createElement(d,i({ref:e},c))}));function m(t,e){var n=arguments,r=e&&e.mdxType;if("string"==typeof t||r){var a=n.length,i=new Array(a);i[0]=f;var l={};for(var u in e)hasOwnProperty.call(e,u)&&(l[u]=e[u]);l.originalType=t,l.mdxType="string"==typeof t?t:r,i[1]=l;for(var p=2;p<a;p++)i[p]=n[p];return o.createElement.apply(null,i)}return o.createElement.apply(null,n)}f.displayName="MDXCreateElement"},1535:function(t,e,n){n.r(e),n.d(e,{assets:function(){return c},contentTitle:function(){return u},default:function(){return m},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return s}});var o=n(3117),r=n(102),a=(n(7294),n(3905)),i=["components"],l={slug:"struct-type-func-overload",title:"Structural Type vs Function Overload",authors:["unional"],tags:["type-system","structural-type","function-overload"]},u=void 0,p={permalink:"/blog/struct-type-func-overload",editUrl:"https://github.com/unional/unional.github.io/edit/master/blog/blog/2021-04-10-structural-type-and-function-overload.mdx",source:"@site/blog/2021-04-10-structural-type-and-function-overload.mdx",title:"Structural Type vs Function Overload",description:"Structural type is what I want.",date:"2021-04-10T00:00:00.000Z",formattedDate:"April 10, 2021",tags:[{label:"type-system",permalink:"/blog/tags/type-system"},{label:"structural-type",permalink:"/blog/tags/structural-type"},{label:"function-overload",permalink:"/blog/tags/function-overload"}],readingTime:1.635,truncated:!1,authors:[{name:"Homa Wong (unional)",title:"Clean Architect",url:"https://github.com/unional",imageURL:"https://github.com/unional.png",key:"unional"}],frontMatter:{slug:"struct-type-func-overload",title:"Structural Type vs Function Overload",authors:["unional"],tags:["type-system","structural-type","function-overload"]},nextItem:{title:"What is Functional Programming",permalink:"/blog/what-is-fp"}},c={authorsImageUrls:[void 0]},s=[],f={toc:s};function m(t){var e=t.components,n=(0,r.Z)(t,i);return(0,a.kt)("wrapper",(0,o.Z)({},f,n,{components:e,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Structural type is what I want."),(0,a.kt)("p",null,"Function overloading is also what I want."),(0,a.kt)("p",null,"Can they co-exist? The answer is no."),(0,a.kt)("p",null,"Let me explain."),(0,a.kt)("p",null,"Structural type avoids a lot of architecture problems existed in nominal type languages."),(0,a.kt)("p",null,"So to me, when designing a new language or choosing a language to work on,\nit is ",(0,a.kt)("em",{parentName:"p"},"almost")," a must (except ",(0,a.kt)("inlineCode",{parentName:"p"},"rust"),", which is too good to pass on)."),(0,a.kt)("p",null,"Function overloading allows the code to be humane,\nespecially for functional programming."),(0,a.kt)("p",null,"With function overloading,\nyou can define the same function with different parameters and different types of parameters with the same name."),(0,a.kt)("p",null,"So instead of using a different function for each type,\nyou can call the same function (at least that's how it appears at the call site)."),(0,a.kt)("p",null,"Why can't they co-exist?\nLet's take a look at an example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"type A = { a: number }\ntype B = { b: string }\n\nfunction foo(input: A) { /*\u2026snip\u2026*/ }\n\nfunction foo(input: B) { /*\u2026snip\u2026*/ }\n")),(0,a.kt)("p",null,"If the ",(0,a.kt)("inlineCode",{parentName:"p"},"input")," is ",(0,a.kt)("inlineCode",{parentName:"p"},"{ a: 1, b: 'b' }"),",\nthe compiler will not be able to figure out which ",(0,a.kt)("inlineCode",{parentName:"p"},"foo()")," to invoke."),(0,a.kt)("p",null,"Note that when I say function overloading,\nI mean function with the same name but with different parameters,\nand each of them have their own implementation."),(0,a.kt)("p",null,"i.e.:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"function foo(input: A) { /*\u2026snip\u2026*/ }\n\nfunction foo(input: B) { /*\u2026snip\u2026*/ }\n")),(0,a.kt)("p",null,"TypeScript's function overloading is really signature overloading:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"function foo(input: A): void\nfunction foo(input: B): void\nfunction foo(input: A | B) { /*\u2026snip\u2026*/ }\n")),(0,a.kt)("p",null,"This difference is important because it allows you to add function overload in different files and modules."),(0,a.kt)("p",null,"With signature overloading,\nyou have to know ahead of time all the types you need to support,\ncreating a top-down dependency same as those in nominal type languages."),(0,a.kt)("p",null,"In the same fashion, discriminated union has the same problem."),(0,a.kt)("p",null,"Is there a way to solve this?"),(0,a.kt)("p",null,"Well, sort of: generics and HKT."),(0,a.kt)("p",null,"But that's a different topic."),(0,a.kt)("p",null,"Happy Coding."))}m.isMDXComponent=!0}}]);