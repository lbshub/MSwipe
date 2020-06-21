!function(t,i){"object"==typeof exports&&"object"==typeof module?module.exports=i():"function"==typeof define&&define.amd?define([],i):"object"==typeof exports?exports.MSwipe=i():t.MSwipe=i()}(this,(function(){return function(t){var i={};function e(s){if(i[s])return i[s].exports;var n=i[s]={i:s,l:!1,exports:{}};return t[s].call(n.exports,n,n.exports,e),n.l=!0,n.exports}return e.m=t,e.c=i,e.d=function(t,i,s){e.o(t,i)||Object.defineProperty(t,i,{enumerable:!0,get:s})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,i){if(1&i&&(t=e(t)),8&i)return t;if(4&i&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(e.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&i&&"string"!=typeof t)for(var n in t)e.d(s,n,function(i){return t[i]}.bind(null,n));return s},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,i){return Object.prototype.hasOwnProperty.call(t,i)},e.p="",e(e.s=2)}([function(t,i){t.exports=function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}},function(t,i){function e(t,i){for(var e=0;e<i.length;e++){var s=i[e];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}t.exports=function(t,i,s){return i&&e(t.prototype,i),s&&e(t,s),t}},function(t,i,e){"use strict";e.r(i);var s,n,r,o,a=e(0),h=e.n(a),l=e(1),u=e.n(l),c=(n=function(t){return parseFloat(s(t,"borderLeftWidth"))+parseFloat(s(t,"paddingLeft"))+parseFloat(s(t,"width"))+parseFloat(s(t,"paddingRight"))+parseFloat(s(t,"borderRightWidth"))},r=function(t){return parseFloat(s(t,"borderTopWidth"))+parseFloat(s(t,"paddingTop"))+parseFloat(s(t,"height"))+parseFloat(s(t,"paddingBottom"))+parseFloat(s(t,"borderBottomWidth"))},o=function(t,i,e){Object.defineProperty(t,i,{get:function(){return this["__"+i]},set:function(t){t!==this["__"+i]&&(this["__"+i]=t,e())}})},{on:function(t,i,e){if("string"==typeof i){var s=!!i.indexOf("touch")&&{passive:!1,capture:!1};return t.addEventListener(i,e,s)}for(var n=0;n<i.length;n++)t.addEventListener(i[n],e,!1)},off:function(t,i,e){if("string"==typeof i)return t.removeEventListener(i,e,!1);for(var s=0;s<i.length;s++)t.removeEventListener(i[s],e,!1)},css:s=function(t,i){return window.getComputedStyle(t,null)[i]},query:function(t){return"string"==typeof t?document.querySelector(t):t},range:function(t,i,e){return Math.min(Math.max(t,i),e)},prefix:function(t){return t in document.createElement("div").style?t:("webkit-"+t).replace(/-\D/g,(function(t){return t.charAt(1).toUpperCase()}))},observe:function(t,i,e){for(var s=0;s<i.length;s++)o(t,i[s],e)},width:n,height:r,outterWidth:function(t){return parseFloat(s(t,"marginLeft"))+n(t)+parseFloat(s(t,"marginRight"))},outterHeight:function(t){return parseFloat(s(t,"marginTop"))+r(t)+parseFloat(s(t,"marginBottom"))},getDirection:function(t,i){return t>i&&t>5?"horizontal":i>t&&i>5?"vertical":""}}),f=c.prefix("transition"),d=c.prefix("transform"),p=function(){function t(i){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};h()(this,t);var s=Object.assign({},e);this.wrapper=c.query(i),this.wrapper&&(this.scroller=this.wrapper.children[0],this.loop=0!=s.loop,this.vertical=s.vertical||!1,this.showIndicator=0!=s.showIndicator,this.indicatorClass=s.indicatorClass||"swipe-indicator",this.indicatorTag=s.indicatorTag||"span",this.activeClass=s.activeClass||"active",this.autoplay=0==s.autoplay?0:5e3,this.scrollTime=s.duration||500,this.lazyload=s.lazyload||!1,this.attribute=s.attribute||"data-src",this.index=s.index||0,this.step=s.step||0,this.locked=s.locked||!1,this.disable=s.disable||!1,this.setup=s.setup||function(){},this.scrollStart=s.scrollStart||function(){},this.scrollEnd=s.scrollEnd||function(){},this.$events={},this._init())}return u()(t,[{key:"_init",value:function(){this._initObserve(),this._initIndicator(),this._initLazyLoad(),this._initEvent(),this.refresh()}},{key:"_setup",value:function(){var t=this;this._hasInstall||(this._hasInstall=!0,"static"===c.css(this.wrapper,"position")&&(this.wrapper.style.position="relative"),"hidden"!==c.css(this.wrapper,"overflow")&&(this.wrapper.style.overflow="hidden"),this.styleProp=this.vertical?"height":"width"),this.items=Array.from(this.scroller.children),this.count=this.items.length,this.items.forEach((function(i){return i.style[t.styleProp]=""})),this.wrapperSize=this.vertical?c.height(this.wrapper):c.width(this.wrapper),this.itemSize=this.vertical?c.height(this.items[0]):c.width(this.items[0]),this.items.forEach((function(i){return i.style[t.styleProp]=t.itemSize+"px"})),this.scale=this.wrapperSize/this.itemSize,this.scale>1?this.size=this.step>0?this.step:this.vertical?c.outterHeight(this.items[0]):c.outterWidth(this.items[0]):this.size=this.wrapperSize,this.totalSize=this.items.reduce((function(i,e){return i+(t.vertical?c.outterHeight(e):c.outterWidth(e))}),0),this.maxOffset=this.wrapperSize-this.totalSize,this.maxCount=this.scale>1?Math.ceil(Math.abs(this.maxOffset)/this.size):this.count-1,this.scroller.style[this.styleProp]=this.totalSize+"px",this.offset=0,this.duration=0,this._scroll(),this._autoPlay(),this.$emit("setup",this.index)}},{key:"_start",value:function(t){this.startX=t.touches[0].pageX,this.startY=t.touches[0].pageY,this.startTime=Date.now(),this._resetTouch(),this._resetPosition(),this._clearPlay()}},{key:"_move",value:function(t){if(t.stopPropagation(),this.vertical&&t.preventDefault(),!this.locked){var i=t.touches[0].pageX-this.startX,e=t.touches[0].pageY-this.startY;if(this.delta=this.vertical?e:i,""==this.direction&&(this.direction=c.getDirection(Math.abs(i),Math.abs(e))),!this.vertical){if("vertical"===this.direction)return;"horizontal"===this.direction&&t.preventDefault()}this.moving||(this.moving=!0),this.loop||(0==this.index&&this.delta>0||this.index==this.maxCount&&this.delta<0)&&(this.delta/=4),this.disable||this._scroll({offset:this.delta})}}},{key:"_end",value:function(t){if(t.stopPropagation(),this.moving){var i=Date.now()-this.startTime,e=Math.abs(this.delta),s=0;(e/i>.25||e>this.size/2)&&(s=this.delta>0?-1:1),this._scroll({pace:s,duration:this.scrollTime})}else this._autoPlay()}},{key:"_resetTouch",value:function(){this.delta=0,this.direction="",this.moving=!1,this.duration=0}},{key:"_resetPosition",value:function(){this.loop&&(-1==this.index&&this._scroll({pace:this.count}),this.index==this.count&&this._scroll({pace:-this.count}))}},{key:"_resize",value:function(){var t=this;this._resizeTimer&&clearTimeout(this._resizeTimer),this._resizeTimer=setTimeout((function(){t._clearPlay(),t.refresh()}),100)}},{key:"_visibility",value:function(){document.hidden?this._clearPlay():this._autoPlay()}},{key:"_scroll",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=t.offset||0,e=t.pace||0,s=t.duration,n=this._getTargetIndex(e),r=this._getTargetOffset(n,i),o=this.index;this.loop&&(this._setItemTransform(this.items[this.count-1],n<=0?-this.totalSize:""),this._setItemTransform(this.items[0],n>=this.count-1?this.totalSize:"")),s&&(this.duration=s,0!=e&&(this.scrolling=!0,this.$emit("scrollStart",this.oIndex=(o+this.count)%this.count))),this.index=n,this.offset=r}},{key:"_scrollEnd",value:function(){this.duration=0,this.scrolling&&(this.scrolling=!1,this.$emit("scrollEnd",(this.index+this.count)%this.count,this.oIndex)),this._autoPlay()}},{key:"_getTargetIndex",value:function(t){if(0==t)return this.index;var i=this.index+t;return this.loop?c.range(i,-1,this.count):this.autoplay?i>this.maxCount?0:i<0?this.maxCount:i:c.range(i,0,this.maxCount)}},{key:"_getTargetOffset",value:function(t,i){var e=t*this.size;return this.loop||(e=Math.min(e,-this.maxOffset)),i-e}},{key:"_setTransition",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;this.scroller.style[f]=0!=t?"all "+t+"ms":""}},{key:"_setTransform",value:function(t){this._setItemTransform(this.scroller,t),this.$emit("scrollMove",t)}},{key:"_setItemTransform",value:function(t,i){t.style[d]=""!=i?this.vertical?"translate3d(0px, "+i+"px, 0px)":"translate3d("+i+"px, 0px, 0px)":""}},{key:"_initEvent",value:function(){c.on(this.wrapper,"touchstart",this.start=this._start.bind(this)),c.on(this.wrapper,"touchmove",this.move=this._move.bind(this)),c.on(this.wrapper,"touchend",this.end=this._end.bind(this)),c.on(this.scroller,["transitionend","webkitTransitionEnd"],this.transitionEnd=this._scrollEnd.bind(this)),c.on(window,"resize",this.resize=this._resize.bind(this)),c.on(window,"visibilitychange",this.visibility=this._visibility.bind(this)),this.$on("setup",this.setup),this.$on("scrollStart",this.scrollStart),this.$on("scrollEnd",this.scrollEnd)}},{key:"_initObserve",value:function(){var t=this;c.observe(this,["offset","duration"],(function(){t._setTransition(t.duration),t._setTransform(t.offset)}))}},{key:"_initIndicator",value:function(){var t=this;if(this.showIndicator&&!(this.count<2)){var i=[],e=document.createElement("div");e.className=this.indicatorClass,this.wrapper.appendChild(e),this.$on("setup",(function(){!function(){i=[],e.innerHTML="";for(var s=0;s<t.count;s++){var n=document.createElement(t.indicatorTag);s===t.index&&(n.className=t.activeClass),e.appendChild(n),i.push(n)}}()})),this.$on("scrollEnd",(function(e,s){i[s].className="",i[e].className=t.activeClass}))}}},{key:"_initLazyLoad",value:function(){var t=this;if(this.lazyload){var i=function(i){if(i&&!i.__loaded){var e=i.getElementsByTagName("img"),s=e.length;if(s){i.__loaded=!0;for(var n=0;n<s;n++){var r=e[n];r.getAttribute(t.attribute)&&(r.classList.add("loaded"),r.setAttribute("src",r.getAttribute(t.attribute)),r.removeAttribute(t.attribute))}}}},e=function(e){if(!(t.scale>1))return i(t.items[e]);for(var s=0;s<t.count;s++){var n=t.items[s];if(!n.__loaded){var r=n.getBoundingClientRect(),o=t.wrapper.getBoundingClientRect();(t.vertical?r.top<o.bottom&&r.bottom>o.top:r.left<o.right&&r.right>o.left)&&i(n)}}};this.$on("setup",(function(t){e(t)})),this.$on("scrollEnd",(function(t){e(t)}))}}},{key:"_autoPlay",value:function(){var t=this;this.autoplay<1||this.count<2||(this._clearPlay(),this._autoTimer=setTimeout((function(){t.next(),t._autoPlay()}),this.autoplay))}},{key:"_clearPlay",value:function(){clearTimeout(this._autoTimer),this._autoTimer=null}},{key:"$emit",value:function(t){if(this.$events[t]){var i=this.$events[t].length;if(i)for(var e=0;e<i;e++)this.$events[t][e].apply(this,[].slice.call(arguments,1))}}},{key:"$on",value:function(t,i){this.$events[t]||(this.$events[t]=[]),this.$events[t].push(i)}},{key:"$off",value:function(t,i){if(this.$events[t]){var e=this.$events[t].indexOf(i);e>-1&&this.$events[t].splice(e,1)}}},{key:"refresh",value:function(){this._setup(),this.$emit("refresh")}},{key:"prev",value:function(){var t=this;this.scrolling||this.destroyed||(this._clearPlay(),this._resetPosition(),setTimeout((function(){t._scroll({pace:-1,duration:t.scrollTime})}),100))}},{key:"next",value:function(){var t=this;this.scrolling||this.destroyed||(this._clearPlay(),this._resetPosition(),setTimeout((function(){t._scroll({pace:1,duration:t.scrollTime})}),100))}},{key:"destroy",value:function(){this.destroyed=!0,this.$emit("destroy"),this.$events={},this._clearPlay(),c.off(this.wrapper,"touchstart",this.start),c.off(this.wrapper,"touchmove",this.move),c.off(this.wrapper,"touchend",this.end),c.off(this.scroller,["transitionend","webkitTransitionEnd"],this.transitionEnd),c.off(window,"resize",this.resize),c.off(window,"visibilitychange",this.visibility)}}]),t}();i.default=p}]).default}));