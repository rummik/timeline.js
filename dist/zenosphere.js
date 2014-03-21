/*! zenosphere.js - v0.4.5 - 2014-03-21
* https://github.com/rummik/zenosphere.js
* Copyright (c) 2014 rummik <r@9k1.us>; Licensed MPL */
!function(){"use strict";function a(b){function c(){++e==d.streams.length&&(d.ready=!0,d.next(150))}var d=this,e=0;this.element=document.querySelector(b.element)||document.createElement("div"),this.messages=document.createElement("div"),this.messages.className="messages";var f=document.createElement("a");f.href="#",f.innerHTML="Load more",f.onclick=function(){return d.next(150),!1},this.element.appendChild(this.messages),this.element.appendChild(f),this.ready=!1,this.streams=[],b.streams.forEach(function(b){if("undefined"!=typeof a.Stream.source[b.type]){var e=new a.Stream(b);e.ready=c,d.streams.push(e)}}),function g(){function a(a){if(b.push(a.reverse()),e+=a.length,++c==d.streams.length){for(var f,g=0;e>g;g++){f=b[0];for(var h=1;h<b.length;h++)(!f.length||b[h].length&&f[0].date<b[h][0].date)&&(f=b[h]);f.length&&d.display(f.shift(),!0)}d.updateTime()}}if(setTimeout(g,12e4),d.ready){var b=[],c=0,e=0;d.streams.forEach(function(b){b.poll(a)})}}()}var b=a.helpers={parseTime:function(a){return a=new Date(a).valueOf().toString(),parseInt(a.substr(0,a.length-3),10)},fuzzyTime:function(a){var b=(Date.now()-1e3*a)/1e3;return 2>b?"just now":60>b?b+"s ago":3600>b?Math.ceil(b/60)+"m ago":82800>b?Math.ceil(b/60/60)+"h ago":518400>b?Math.ceil(b/60/60/24)+"d ago":Math.ceil(b/60/60/24/7)+"w ago"},template:function(a,b){return a.toString().replace(/{(\w+)}/g,function(a,c){return b[c]})},toArray:function(a){return[].slice.apply(a)},copy:function(a,b){Object.keys(b).forEach(function(c){var d=b[c];"object"==typeof d&&(d=new d.constructor(d)),a["fill"==c?"_fill":c]=d})}};a.prototype.updateTime=function(){[].forEach.call(this.messages.children,function(a){a.firstChild.innerHTML=b.fuzzyTime(a.getAttribute("data-timestamp"))})},a.prototype.display=function(c,d){var e=document.createElement("div"),f=document.createElement("span"),g=document.createElement("span"),h=document.createElement("i"),i=c.type.toLowerCase().replace(/\W/g,"-");if(e.className="message message-"+i,e.setAttribute("data-timestamp",c.date),h.className="fa fa-"+a.Stream.source[c.type].icon,f.className="message-body",f.innerHTML=" "+c.message,g.className="message-date",g.innerHTML=b.fuzzyTime(c.date),c.link&&e.setAttribute("data-link",c.link),e.onclick=function(a){"A"!=a.target.tagName&&c.link&&window.open(c.link)},e.appendChild(g),e.appendChild(h),e.appendChild(f),!d)return this.messages.appendChild(e);for(var j=this.messages.children,k=j.length,l=0;k>l&&+j[l].getAttribute("data-timestamp")>c.date;l++);this.messages.insertBefore(e,j[l])},a.prototype.next=function(a,b){var c=this.streams[0],d=this.streams.length;b=b||0;for(var e=1;d>e;e++)this.streams[e].current()>c.current()&&(c=this.streams[e]);if(!(c.empty()||++b>a)){var f=this;c.shift(function(c){f.display(c),f.next(a,b)})}},window.Zenosphere=a}(),function(){"use strict";function a(c){b.copy(this,a.source[c.type]),this.vars={},b.copy(this.vars,c),this.buffer=[],this.results={max:0,min:0},this.options.paginate&&(this.vars.page=0);var d=this;setTimeout(function(){d.fill(d.ready)},1)}var b=Zenosphere.helpers;a.type={},a.source={},a.prototype.poll=function(a){this.request("poll",a)},a.prototype.fill=function(a){var b=this;this.request(this.results.min?"refill":"fill",function(c){b.buffer=c,a()})},a.prototype.request=function(a,c){var d;a=a||"fill",d="string"==typeof this.options.action?this.options.action:this.options.action[a]||this.options.action.fill,this.options.paginate&&"poll"!=a&&this.vars.page++,this.get(b.template(d,this.vars),a,function(b){var d=this,e=[],f=this.getEvents(b);return f.length?(f.forEach(function(b){var c,f=d.getEventID(b);"poll"==a&&f<=d.results.max||"refill"==a&&f>=d.results.min||(c=d.getEventMessage(b))&&e.push({type:d.vars.type,date:d.getEventDate(b),message:c,link:d.getEventLink(b)})}),this.results.max&&"poll"!=a||(this.results.max=this.getEventID(f[0])),this.results.min&&"fill"!=a&&"refill"!=a||(this.results.min=this.getEventID(f[f.length-1])),void("function"==typeof c&&c(e))):c(e)})},a.prototype.current=function(){return this.buffer.length?this.buffer[0].date:0},a.prototype.shift=function(a){return this.buffer.length<=1&&(!this.options.paginate||this.options.paginate!==!0&&this.vars.page<this.options.paginate)?this.fill(this.shift.bind(this,a)):void(this.empty()||a(this.buffer.shift()))},a.prototype.empty=function(){return!this.buffer.length&&this.options.paginate&&this.options.paginate!==!0&&this.vars.page>=this.options.paginate},a.prototype._callback=function(a){var b="timeline_cb_"+Math.random().toString().substr(2),c=this;return window[b]=function(){a.apply(c,arguments),delete window[b]},b},a.prototype._params=function(a){var c=this,d="";return Object.keys(this.params).forEach(function(e){var f=c.params[e];"function"==typeof f&&(f=f.call(c,a)),void 0!==f&&(d+="&"+e+"="+b.template(f,c.vars))}),"?"+d.substr(1)},a.prototype.get=function(a,b,c){var d=this.options.url+a+this._params(3==arguments.length?b:"");if("undefined"==typeof c&&(c=b),"jsonp"==this.options.response){var e=document.createElement("script");e.src=d.replace(/([?&][^=]+=)\?(&|$)/,"$1"+this._callback(c)+"$2"),document.body.appendChild(e)}else{var f=new XMLHttpRequest;f.open("GET",d),f.send();var g=this;f.onreadystatechange=function(){4==f.readyState&&200==f.status&&c.call(g,"xml"==g.options.response?f.responseXML:JSON.parse(f.responseText))}}},Zenosphere.Stream=a}(),function(){"use strict";var a=Zenosphere.helpers;Zenosphere.Stream.source.GitHub={icon:"github",options:{response:"json",paginate:10,url:"https://api.github.com/",action:"{stream}/events/public"},params:{page:function(a){return"poll"==a?1:"{page}"}},headers:{Accept:"applicatioin/vnd.github.v3+json"},getEvents:function(a){return a},getEventID:function(a){return parseInt(this.getEventDate(a),10)},getEventDate:function(b){return a.parseTime(b.created_at)},getEventMessage:function(b){var c="",d={};switch(b.type){case"PushEvent":c='Pushed {commits} commit{s} to <code>{ref}</code> on <a href="{repoUrl}" target="_blank">{repo}</a>',d={commits:b.payload.size,s:1==b.payload.size?"":"s",ref:b.payload.ref.replace(/^refs\/heads\//,""),repoUrl:"https://github.com/"+b.repo.name,repo:b.repo.name.replace(new RegExp("^"+b.actor.login+"/"),"")}}return c.length?a.template(c,d):void 0},getEventLink:function(a){switch(a.type){case"PushEvent":return"https://github.com/"+a.repo.name+"/compare/"+a.payload.before+"..."+a.payload.head}}}}(),function(){"use strict";var a=Zenosphere.helpers;Zenosphere.Stream.source.Lastfm={icon:"music",options:{response:"xml",url:"https://ws.audioscrobbler.com/2.0/",action:"user/{stream}/recenttracks.rss"},params:{limit:200,from:function(a){return"poll"==a?this.results.max:void 0},to:function(a){return"refill"==a?this.results.min:void 0}},getEvents:function(b){return a.toArray(b.querySelectorAll("item"))},getEventID:function(a){return this.getEventDate(a)},getEventDate:function(b){return a.parseTime(b.querySelector("pubDate").innerHTML)},getEventMessage:function(a){return a.querySelector("title").innerHTML},getEventLink:function(a){return a.querySelector("link").innerHTML}}}(),function(){"use strict";var a=Zenosphere.helpers;Zenosphere.Stream.source.Twitter={icon:"twitter",options:{response:"jsonp",url:"https://cdn.syndication.twimg.com/widgets/timelines/",action:{fill:"{stream}",poll:"paged/{stream}",refill:"paged/{stream}"}},params:{lang:"en",suppress_response_codes:"true",rnd:function(){return Math.random()},domain:location.host,callback:"?",since_id:function(a){return"poll"==a?this.results.max:void 0},max_id:function(a){return"refill"==a?this.results.min:void 0}},getEvents:function(b){var c=document.implementation.createHTMLDocument("twitter");return c.body.innerHTML=b.body,this.vars.user||(this.vars.user=this.getUser(c)),a.toArray(c.querySelectorAll(".tweet"))},getUser:function(a){var b=a.querySelector(".profile").href;return b.substr(b.lastIndexOf("/")+1)},getEventID:function(a){return parseInt(a.getAttribute("data-tweet-id"),10)},getEventDate:function(a){var b=parseInt(a.getAttribute("data-tweet-id"),10);return Math.floor((b/4194304+1288834974657)/1e3)},getEventMessage:function(b){var c=b.querySelector(".e-entry-title");a.toArray(c.querySelectorAll(".tco-hidden")).forEach(function(a){a.parentNode.removeChild(a)}),a.toArray(c.querySelectorAll("a")).forEach(function(a){var b=document.createElement("a");b.textContent=a.textContent,b.target="_blank",b.href=a.href,b.title=a.title,a.parentNode.insertBefore(b,a),a.parentNode.removeChild(a)});var d=this.getUser(b);return c=c.innerHTML,d!=this.vars.user&&(c=a.template('RT <a href="https://twitter.com/{user}" target="_blank">@{user}</a>: {message}',{user:d,message:c})),c},getEventLink:function(a){return a.querySelector(".permalink").href}}}();