(function(t){function e(e){for(var s,n,o=e[0],c=e[1],l=e[2],d=0,f=[];d<o.length;d++)n=o[d],i[n]&&f.push(i[n][0]),i[n]=0;for(s in c)Object.prototype.hasOwnProperty.call(c,s)&&(t[s]=c[s]);u&&u(e);while(f.length)f.shift()();return r.push.apply(r,l||[]),a()}function a(){for(var t,e=0;e<r.length;e++){for(var a=r[e],s=!0,o=1;o<a.length;o++){var c=a[o];0!==i[c]&&(s=!1)}s&&(r.splice(e--,1),t=n(n.s=a[0]))}return t}var s={},i={app:0},r=[];function n(e){if(s[e])return s[e].exports;var a=s[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=t,n.c=s,n.d=function(t,e,a){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)n.d(a,s,function(e){return t[e]}.bind(null,s));return a},n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="https://justamouse.com/readings/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],c=o.push.bind(o);o.push=e,o=o.slice();for(var l=0;l<o.length;l++)e(o[l]);var u=c;r.push([0,"chunk-vendors"]),a()})({0:function(t,e,a){t.exports=a("56d7")},"034f":function(t,e,a){"use strict";var s=a("85ec"),i=a.n(s);i.a},"56d7":function(t,e,a){"use strict";a.r(e);a("cadf"),a("551c"),a("f751"),a("097d");var s=a("2b0e"),i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{class:t.styling.backgroundColor,attrs:{id:"page"}},[a("div",{staticClass:"navbar-fixed",attrs:{id:"nav-container",role:"navigation"}},[a("nav",{class:t.styling.navbarColor},[a("div",{staticClass:"nav-wrapper"},[a("ul",{staticClass:"left"},[a("li",[a("div",{attrs:{id:"filters"}},[a("ul",{staticClass:"dropdown-content",attrs:{id:"filters-dropdown"}},t._l(t.filters,(function(e){return a("li",{key:e.topic,staticClass:"dropdown-item filter",class:{active:t.filterKey===e.topic}},[a("a",{attrs:{href:"#"+e.uid,role:"button"},on:{click:function(a){t.filterKey=e.topic}}},[a("span",{staticClass:"dropdown-label-text"},[t._v(t._s(e.name))]),e.totalPosts?a("span",{staticClass:"badge"},[t._v(t._s(e.totalPosts))]):t._e(),e.newPosts?a("span",{staticClass:"badge new"},[t._v(t._s(e.newPosts))]):t._e()])])})),0),t._m(0)])]),a("li",[a("div",{staticClass:"search-form",attrs:{id:"search"}},[a("div",{staticClass:"input-field"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.searchKey,expression:"searchKey"}],staticClass:"search form-control",attrs:{role:"search",autocomplete:"off",debounce:"300",type:"search",id:"search-input"},domProps:{value:t.searchKey},on:{input:function(e){e.target.composing||(t.searchKey=e.target.value)}}}),t._m(1)])])])]),t.meta&&t.meta.title?a("span",{staticClass:"brand-logo center"},[t._v(t._s(t.meta.title))]):t._e(),a("ul",{staticClass:"right"},[a("li",[a("a",{directives:[{name:"show",rawName:"v-show",value:t.meta&&t.meta.about,expression:"meta && meta.about"}],staticClass:"valign-wrapper modal-trigger",attrs:{href:"#about"}},[a("i",{staticClass:"icon info zmdi zmdi-info tooltipped",attrs:{"data-tooltip":"What's this?","data-delay":"25","data-position":"left"}})])])])])])]),a("div",{staticClass:"modal",attrs:{id:"about"}},[a("div",{staticClass:"modal-content image-text-wrap"},[t.meta&&t.meta.about&&t.meta.about.avatar?a("span",[a("img",{staticClass:"image-text-wrap-left",attrs:{alt:"Avatar",src:t.meta.about.avatar}})]):t._e(),t.meta&&t.meta.about&&t.meta.about.blurb?a("span",{domProps:{innerHTML:t._s(t.markdownToHtml(t.meta.about.blurb))}}):t._e()]),t._m(2)]),a("div",{attrs:{id:"posts",role:"main"}},[a("div",{staticClass:"container"},[a("div",{staticClass:"row"},[a("transition-group",{attrs:{name:"fade"}},t._l(t.filteredPosts,(function(e){return a("div",{key:e.uid,staticClass:"post card col s12 hoverable",class:{deemphasize:t.selectedPostUid&&t.selectedPostUid!==e.uid}},[a("div",{staticClass:"card-deselect"},[t.selectedPostUid===e.uid?a("a",{attrs:{href:"#!",role:"button"},on:{click:function(e){t.selectedPostUid=""}}},[a("i",{staticClass:"icon close card-menu zmdi zmdi-close"})]):t._e()]),a("div",{staticClass:"card-block card-content"},[a("h4",{staticClass:"card-title"},[t._v(t._s(e.title))]),a("p",{staticClass:"card-text",domProps:{innerHTML:t._s(t.markdownToHtml(e.summary))}})]),a("div",{staticClass:"card-block card-action activator"},[e.url?a("a",{staticClass:"card-link",attrs:{href:e.url}},[t._v("Origin")]):t._e(),a("a",{staticClass:"card-link",attrs:{href:"#"+e.uid},on:{click:function(a){t.selectedPostUid=e.uid}}},[t._v("Permalink")]),a("i",{staticClass:"card-menu icon more zmdi zmdi-more-vert"})]),a("div",{staticClass:"card-reveal"},[a("h4",{staticClass:"card-title"},[t._v(t._s(e.title)),a("i",{staticClass:"card-menu icon close zmdi zmdi-close"})]),a("p",{staticClass:"card-text"},[a("ul",[a("li",[t._v("Date: "+t._s(t._f("displayDate")(e)))]),a("li",[t._v("Topics: "+t._s(t._f("displayTopics")(e)))]),a("li",[t._v("Type: "+t._s(e.type))])])])])])})),0)],1)])])])},r=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a",{staticClass:"dropdown-button",attrs:{"data-activates":"filters-dropdown","data-constrainwidth":"false","data-beloworigin":"true","data-alignment":"right",href:"#!",role:"button",id:"filters-trigger"}},[a("i",{staticClass:"icon filter zmdi zmdi-filter-list tooltipped",attrs:{"data-tooltip":"Filter","data-delay":"25","data-position":"right"}})])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("label",{attrs:{for:"search-input"}},[a("i",{staticClass:"icon search zmdi zmdi-search tooltipped",attrs:{"data-tooltip":"Search","data-delay":"25","data-position":"right"}})])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"modal-footer"},[a("a",{staticClass:"modal-action modal-close",attrs:{href:"#!",role:"button"}},[a("i",{staticClass:"modal-menu icon close zmdi zmdi-close"})])])}],n=(a("6b54"),a("28a5"),a("a481"),a("ac6a"),a("456d"),a("55dd"),a("a78e")),o=a("0e54"),c="All",l="post_",u="filter_",d=y(),f=w(),p={data:function(){return{posts:[],styling:{},meta:{},filters:[],filterKey:c,searchKey:"",selectedPostUid:""}},filters:{displayDate:function(t){return z(t.date)},displayTopics:function(t){return t.topics.filter((function(t){return t!==c})).join(", ")}},mounted:function(){this.fetchData()},computed:{filteredPosts:function(){var t=this,e=this.searchKey.toLowerCase();return this.posts.filter((function(e){return-1!==e.topics.indexOf(t.filterKey)})).filter((function(t){return-1!=="".concat(t.title," ").concat(t.summary).toLowerCase().indexOf(e)}))}},methods:{markdownToHtml:function(t){return t?o(t):""},fetchData:function(){var t=this;k(h(),(function(e){t.posts=m(e.content),t.filters=v(e.content),t.styling=e.styling,t.meta=e.meta,t.highlightPost(f.selectedPostUid),t.setupMaterialize()}))},highlightPost:function(t){t&&(this.posts.sort((function(e,a){return e.uid===t?-1:a.uid===t?1:0})),this.selectedPostUid=t)},setupMaterialize:function(){$(".dropdown-button").each((function(){$(this).dropdown()})),$(".modal-trigger").leanModal()}}};function m(t){return t.map((function(t){return t.topics.unshift(c),{date:x(t.date),summary:t.summary,title:t.title,topics:t.topics,type:t.type,url:t.url,uid:l+b(t)}}))}function v(t){var e={};t.map((function(t){var a=x(t.date)>=d.lastVisited?1:0;t.topics.map((function(t){t in e?(e[t].totalPosts+=1,e[t].newPosts+=a):e[t]={totalPosts:1,newPosts:a}}))}));var a=Object.keys(e).map((function(t){return{name:t,topic:t,newPosts:e[t].newPosts,totalPosts:e[t].totalPosts,uid:u+g(t)}}));return a.sort((function(t,e){return e.totalPosts-t.totalPosts})),a}function h(){return"https://raw.githubusercontent.com/c-w/readings/master/data.json"}function g(t){return t.toLowerCase().replace(/[^a-z]/g,"")}function b(t){var e=t.title.toLowerCase().replace(/[^a-z0-9 ]/g,""),a=e.split(" ").map((function(t){return t.charAt(0)})).join(""),s=x(t.date).toString().toLowerCase().split(" "),i=s[2]+s[1]+s[3].substring(2,4);return i+a}function w(){return{selectedPostUid:P(l)}}function y(){var t=n["get"]("lastVisited");return t=void 0!==t?new Date(x(t)):new Date,n["set"]("lastVisited",z(new Date),{expires:365,domain:window.location.hostname}),{lastVisited:t}}function _(t,e,a){return t=""+t,t.length<e?new Array(e-t.length+1).join(a||"0")+t:t}function C(t,e){return 0===t.indexOf(e)}function P(t){var e=window.location.hash;return C(e,"#".concat(t))?e.substring(1):void 0}function x(t){var e=t.split("-");return new Date(e[0],e[1]-1,e[2])}function z(t){return t.getFullYear()+"-"+_(t.getMonth()+1,2)+"-"+_(t.getDate(),2)}function k(t,e){$.ajax({url:t,dataType:"json",crossDomain:!0,success:e,error:function(t){j("AJAX error: ".concat(t.statusText)),console.log(JSON.stringify(t))},failure:function(t){j("AJAX failure: ".concat(t.statusText)),console.log(JSON.stringify(t))}})}function j(t){var e='<i class="material-icons">error</i>'+'<span class="message">'.concat(t,"</span>");Materialize.toast(e,void 0,"error")}var O=p,T=(a("034f"),a("2877")),D=Object(T["a"])(O,i,r,!1,null,null,null),M=D.exports;s["a"].config.productionTip=!1,new s["a"]({render:function(t){return t(M)}}).$mount("#app")},"85ec":function(t,e,a){}});
//# sourceMappingURL=app.4e606ffe.js.map