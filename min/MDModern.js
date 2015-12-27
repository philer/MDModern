/*! MDModern by Philipp Miller */
!function(a,b,c){"use strict";function d(){return u?!1:(u=!0,h("locked"),!0)}function e(){return u?(u=!1,h("unlocked"),!0):!1}function f(a){c("MDM: sending username"),alert("USER###"+a)}function g(a){c("MDM: sending password"),t=!1,alert("LOGIN###"+a)}function h(a,b){c("EVENT: "+a,b),m.triggerHandler(a,b)}function i(a,b,c,d){this.name=a,this.gecos=b,this.loggedIn=c||!1,this.facefile=d||"file:///home/"+a+"/.face"}function j(a,b){this.name=a,this.file=b}function k(a,b){this.name=a,this.code=b}var l=a.mdm={},m=b(l),n=null,o=null,p=null,q=[],r=[],s=[],t=!1,u=!0;l.on=b.fn.on.bind(m),l.one=b.fn.one.bind(m),l.on("passwordPrompt",function(){t=!0}).one("prompt",e),l.login=function(a,b){return d()&&(l.one("passwordPrompt",function(){l.one("prompt",e),g(b)}),f(a)),this},l.selectUser=function(a){return a=""+a,a!==n&&d()&&(l.one("prompt",e),f(a)),this},l.sendPassword=function(a){return d()&&(t?(l.one("prompt",e),g(a)):n&&(l.one("passwordPrompt",function(){l.one("prompt",e),g(a)}),f(n))),this},l.getUser=function(a){for(var b=0,c=q.length;c>b;++b)if(q[b].name===""+a)return q[b]},l.getSession=function(a){for(var b=0,c=r.length;c>b;++b)if(r[b].file===""+a)return r[b]},l.selectSession=function(a){return c("MDM: sending session info"),alert("SESSION###"+a.name+"###"+a.file),l},l.getLanguage=function(a){for(var b=0,c=s.length;c>b;++b)if(s[b].code===""+a)return s[b]},l.selectLanguage=function(a){return c("MDM: sending language info"),alert("LANGUAGE###"+a.code),l},l.shutdown=function(){return c("MDM: sending force-shutdown request"),alert("FORCE-SHUTDOWN###"),l},l.restart=function(){return c("MDM: sending force-restart request"),alert("FORCE-RESTART###"),l},l.suspend=function(){return c("MDM: sending force-suspend request"),alert("FORCE-SUSPEND###"),l},l.quit=function(){return c("MDM: sending quit request"),alert("QUIT###"),l},i.prototype={toString:function(){return this.name},select:function(){return l.selectUser(this),this}},j.prototype={select:function(){return l.selectSession(this),this}},k.prototype={select:function(){return l.selectLanguage(this),this},countryCode:function(){return this.code.split(".")[0]},shortCode:function(){return this.code.split("_")[0]},charset:function(){return this.code.split(".")[1]}},a.mdm_enable=function(){h("enabled")},a.mdm_disable=function(){h("disabled")},a.mdm_prompt=function(){h("usernamePrompt"),h("prompt")},a.mdm_noecho=function(){h("passwordPrompt"),h("prompt")},a.mdm_add_user=function(a,b,c,d){var e=new i(a,b,c,d);q.push(e),h("userAdded",e)},a.mdm_add_session=function(a,b){var c=new j(a,b);r.push(c),h("sessionAdded",c)},a.mdm_add_language=function(a,b){var c=new k(a,b);s.push(c),h("languageAdded",c)},a.mdm_set_current_user=function(a){a&&n!==a&&(n=a,h("userSelected",l.getUser(a)||new i(a)))},a.mdm_set_current_session=function(a,b){o!==b&&(o=b,h("sessionSelected",l.getSession(b)))},a.mdm_set_current_language=function(a,b){p!==b&&(p=b,h("languageSelected",l.getLanguage(b)))},a.mdm_error=function(a){a&&h("error",a)},a.mdm_msg=function(a){a&&h("message",a)},a.mdm_timed=function(a){h("timedMessage",a),h("loginCountdown",+a.match(/[0-9]+/)[0])},a.set_welcome_message=function(a){a&&h("welcomeMessage",a)},a.set_clock=function(a){h("clockUpdate",a)},a.mdm_hide_shutdown=function(){h("shutdownHidden")},a.mdm_hide_restart=function(){h("restartHidden")},a.mdm_hide_suspend=function(){h("suspendHidden")},a.mdm_hide_quit=function(){h("quitHidden")},a.mdm_hide_xdmcp=function(){h("xdmcpHidden")}}(window,jQuery,console.log.bind(console)),function(a,b,c){"use strict";function d(a,d,e){if(a in l)return l[a];if("boolean"==typeof d&&(e=d,d=c),e=b&&(e===c||e),e&&b.hasOwnProperty(a))return l[a]=Promise.resolve(JSON.parse(b.getItem(a)));var g=!1,h=function(){return function(a){throw g||(g=!0),a}};return l[a]=new Promise(function(b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="text",d.addEventListener("load",function(){d.status<400?b(d.responseText):c(Error(d.statusText))}),d.send()}).catch(h("loading")).then(f(d)).catch(h("parsing")).then(function(c){return e&&b.setItem(a,JSON.stringify(c)),c}).catch(h("storing"))}function e(a){return b&&(a?delete b.filename:b.clear()),k}function f(a){if("function"==typeof a)return a;switch(a){case c:case null:case"properties":return h;case"plain":return j;case"lines":return g;case"json":return JSON.parse}throw Error('Config: Unknown parser "'+a+"'")}function g(a){return a.split("\n").map(i).filter(j)}function h(a){var b,c,d={};return a.split("\n").map(i).forEach(function(a,e){if(""!==a)if(c=m.exec(a))d[c[1]]=JSON?JSON.parse(c[2]):c[2];else if(c=n.exec(a))b=c[1],d.hasOwnProperty(b)||(d[b]=[]);else{if(!b)throw Error("Config: Syntax error on line "+(e+1)+" '"+a+"'");d[b].push(a)}}),d}function i(a){return o.exec(a)[0]}function j(a){return a}var k=a.config={require:d,clear:e},l=Object.create(null),m=/^(\S+)\s*=\s*(.*)$/,n=/^\[(\S+)\]$/,o=/^[^#"]*(:?"[^"]*"[^#"]*)*/}(window,localStorage),function(a,b){"use strict";["shutdown","restart","suspend","quit"].forEach(function(c){var d=b("#"+c);d.length&&(a.on(c+"Hidden",function(){d.hide()}),d.find("a").click(a[c]))})}(mdm,jQuery),function(a,b){"use strict";function c(a,c){if(c){var e=b('<li class="message">'+c+"</li>");d.append(e.fadeIn()).animate({scrollTop:d.height()},500)}}var d=b("#messages");a.on("error",c)}(mdm,jQuery),function(a,b){"use strict";function c(a,b){e.text(b)}function d(a,b){b>g&&(g=b,f.addClass("running")),f.css({width:100*b/g+"%"})}var e=b("#countdown"),f=b("#countdown-bar"),g=-1;e.length&&a.on("loginCountdown",c),f.length&&a.on("loginCountdown",d)}(mdm,jQuery),function(a,b){"use strict";function c(b){b.preventDefault(),a.login(k[0].value,l[0].value),l.select()}function d(a,c){var d=b("<li>"),f=b("<a>"+c.name+"</a>"),i=b('<i class="fa fa-user">'),j=new Image;p.append(d.append(f.prepend(i))),c.loggedIn&&d.addClass("loggedIn"),f.click(function(a){e(a,c)}),j.loaded=!1,j.src=c.facefile,b(j).one("load",function(){i.remove(),f.prepend(j),j.loaded=!0}),c.$li=d,c.img=j,n.push(c),1===n.length&&o.one("click",g),h||(h=c)}function e(a,b){h.$li.removeClass("selected"),f(b),b&&b.$li&&(k.is(a.target)||b.name===k[0].value||k.val(b.name),b.$li&&b.$li.addClass("selected"),h=b)}function f(a){j.removeClass("hasface"),a&&a.img&&(a.img.loaded?(m.src=a.img.src,j.addClass("hasface")):b(a.img).one("load",function(){a==h&&(m.src=a.img.src),j.addClass("hasface")}))}function g(a){q?(i.off("click",g),o.one("click",g)):(i.click(g),a.stopPropagation()),p.toggleClass("expanded"),q=!q}var h,i=b(document.body),j=b("#login"),k=b("#username",j),l=b("#password",j),m=b("#face",j)[0],n=[],o=b("#userlist-toggle",j),p=b("#users",j),q=!1;a.on("userAdded",d).on("userSelected",e).on("usernamePrompt",function(){k.select()}).one("passwordPrompt",function(){l.select()}),k.on("propertychange input paste",function(b){e(b,a.getUser(this.value))}),j.submit(c)}(mdm,jQuery),function(a){"use strict";function b(b,c){c.li=a(document.createElement("li")).append(a("<a>"+c.name+"</a>").click(c.select.bind(c))),f.append(c.li),d||(d=c)}function c(a,b){d.li.removeClass("selected"),e.html(b.name),b.li.addClass("selected"),d=b}var d,e=a("#session"),f=a("#sessions");mdm.on("sessionAdded",b).on("sessionSelected",c)}(jQuery),function(a){"use strict";function b(b,c){c.li=a(document.createElement("li")).append(a('<a><span class="code">'+c.countryCode()+'</span><span class="name">'+c.name+"</span></a>").click(c.select.bind(c))),f.append(c.li),d||(d=c)}function c(a,b){d.li.removeClass("selected"),e.html(b.shortCode()),b.li.addClass("selected"),d=b}var d,e=a("#language"),f=a("#languages");mdm.on("languageAdded",b).on("languageSelected",c)}(jQuery),function(a,b,c){"use strict";function d(a){var d=c.getElementsByClassName("slideshow"),f=d.length?d[0]:c.body;b.slideshow=a.grid&&"1x1"!==a.grid&&/^\d+x\d+$/.test(a.grid)?new g(f,a):new e(f,a)}function e(a,b){this.parent=a,this.parent.insertAdjacentHTML("afterbegin",h);var c=this.parent.getElementsByClassName("slideshow-layer"),d=this.parent.getElementsByClassName("slideshow-filename");this.layers=[];for(var e=0,g=c.length;g>e;++e)this.layers[e]=new f(this,c[e],d[e]);this.currentLayer=0,this.loader=new Image,this.loader.addEventListener("load",this._showCurrent.bind(this)),this.ctrlsElem=this.parent.getElementsByClassName("slideshow-controls")[0],b&&this.init(b),this._btn("next"),this._btn("prev"),this._btn("toggle")}function f(a,b,c){this.ss=a,this.elem=b,this.elemStyle=b.style,this.filenameElem=c}function g(b,d){var f,g=d.grid.split("x"),h=g[0],j=g[1];this.slideshows=[];for(var k=0;h>k;++k)for(var l=0;j>l;++l)f=c.createElement("div"),f.style.position="absolute",f.style.left=l/j*100+"%",f.style.top=k/h*100+"%",f.style.width=1/j*100+"%",f.style.height=1/h*100+"%",b.appendChild(f),this.slideshows.push(new e(f,a.extend(d,{interval_seconds:Math.round(1e3*(2.5+Math.random()*(2*(d.interval_seconds||i.interval_seconds)-5)))/1e3})))}var h='<div class="slideshow-layer"><span class="slideshow-filename"></span></div><div class="slideshow-layer"><span class="slideshow-filename"></span></div><span class="slideshow-controls"><a class="slideshow-prev"><i class="fa fa-chevron-left"></i></a><a class="slideshow-toggle"><i class="fa fa-play"></i></a><a class="slideshow-next"><i class="fa fa-chevron-right"></i></a></span>',i={interval_seconds:10,fade_seconds:2,shuffle:!0,show_controls:!0,show_filename:!1,grid:null,fill_style:null,background_style:"#222"};e.prototype={init:function(b){return this.cfg=b=a.extend(i,b),this.sources=b.backgrounds.slice(0),this.currentId=0,this.intervalId&&this.stop(),1===this.sources.length?(this.setImage(this.sources[0]),void(this.ctrlsElem.style.display="none")):(b.shuffle&&this.shuffle(),this.setImage(this.sources[0]).start(),this.ctrlsElem.style.display=b.show_controls?null:"none",this)},_btn:function(a){var b=this.ctrlsElem.getElementsByClassName("slideshow-"+a);return b.length?(b[0].addEventListener("click",this[a].bind(this)),b[0]):void 0},setImage:function(a){return this.loader.src=a,this},_showCurrent:function(){return this.layers[this.currentLayer].hide(),this.currentLayer=(this.currentLayer+1)%this.layers.length,this.layers[this.currentLayer].show(this.loader),this},next:function(a){return a&&(a.defaultPrevented||a.preventDefault())||(this.currentId=(this.currentId+1)%this.sources.length,this.setImage(this.sources[this.currentId])),this},prev:function(a){return a&&(a.defaultPrevented||a.preventDefault())||(this.currentId=(this.currentId+this.sources.length-1)%this.sources.length,this.setImage(this.sources[this.currentId])),this},start:function(a){return a&&(a.defaultPrevented||a.preventDefault())||this.intervalId||(this.intervalId=b.setInterval(this.next.bind(this),1e3*this.cfg.interval_seconds),this.ctrlsElem.classList.add("slideshow-running")),this},stop:function(a){return a&&(a.defaultPrevented||a.preventDefault())||this.intervalId&&(b.clearInterval(this.intervalId),this.intervalId=!1,this.ctrlsElem.classList.remove("slideshow-running")),this},toggle:function(a){return this.intervalId?this.stop(a):this.start(a)},shuffle:function(){for(var a,b,c=this.sources,d=c.length;d--;)b=Math.floor(Math.random()*d),a=c[d],c[d]=c[b],c[b]=a;return this},openCurrent:function(){b.open(this.sources[this.currentId])}},f.prototype={show:function(a){var b=this.ss.cfg.fill_style?this.ss.cfg.fill_style:"50% 50% / "+this._getCssSizing(a)+" no-repeat";return this.elemStyle.background='url("'+a.src+'") '+b+","+this.ss.cfg.background_style,this.elemStyle.transition="z-index 0s "+this.ss.cfg.fade_seconds+"s",this.elemStyle.zIndex=1,this.elemStyle.opacity=1,this.elemStyle.visibility="visible",this.ss.cfg.show_filename&&(this.filenameElem.innerHTML=a.src),this},hide:function(){var a=this.ss.cfg.fade_seconds;return this.elemStyle.transition="opacity "+a+"s,z-index 0s "+a+"s,visibility 0s "+a+"s",this.elemStyle.zIndex=0,this.elemStyle.opacity=0,this.elemStyle.visibility="hidden",this},_getCssSizing:function(a){{var b=this.elem.getBoundingClientRect(),c=b.bottom-b.top,d=b.right-b.left,e=a.naturalHeight,f=a.naturalWidth;Math.abs(c/d-e/f)}return.6*c>e&&.6*d>f?"auto":e>=c&&f>=d?"cover":.7*c>e||.7*d>f||Math.abs(c/d-e/f)>.5?"contain":"cover"}},g.prototype={},Object.getOwnPropertyNames(e.prototype).forEach(function(a){"_"!==a[0]&&(g.prototype[a]=function(){for(var b=0,c=this.slideshows.length;c>b;++b)this.slideshows[b][a]();return this})}),config.require("slideshow.conf",!1).then(d).catch(function(){})}(jQuery,window,document);