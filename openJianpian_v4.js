function mainJp() {
    // 下载定时器
    var downloadTimer;

//  获取页面的可见性
    const getDocVisible = function () {

            if (document.hidden !== undefined) {
                return !document.hidden;
            }
            if (document.webkitHidden !== undefined) {
                return !document.webkitHidden;
            }
            return document.visibilityState === 'visible';

    };

// onVisibilityChange
    var hiddenProperty = 'hidden' in document ? 'hidden' :
        'webkitHidden' in document ? 'webkitHidden' :
            'mozHidden' in document ? 'mozHidden' :
                null;
    var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');

    var onVisibilityChange = function() {
        if (!document[hiddenProperty]) {
            // alert('页面激活');
        }else{
            // alert('页面非激活');
        }
        clearTimeout(downloadTimer);
    };
    document.addEventListener(visibilityChangeEvent, onVisibilityChange);
    window.onblur = function() {
        //console.log('blur');
        clearTimeout(downloadTimer);
    };
    $(function() {
        var isMobile=(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i));
        var domain = window.location.host;
        var client = 1;
        var type = 1;
        function ajaxTong(domain,client,type) {
            $.get('https://nginx.vipfanyongwang.com:8443/api/Land/index',{'domain':domain,'client':client,'type':type},function(data){
                console.log(data);
            })
        }

        //统计浏览量
        if(isMobile){
            if(/iPhone|iPod|ios|iPad/i.test(navigator.userAgent)){
                client = 3;

            }else{
                client = 2;

            }
            type = 1;
            ajaxTong(domain,client,type);
        }else{
            type = 1;
            client = 1;
            ajaxTong(domain,client,type);
        }

        //下载配置
        var config={
            "default":{
                exe:"https://dl.mqhwgl.com/jp-pc.exe",
                apk:"https://dl.mqhwgl.com/jp.apk"
            },
            "piaohua.com":{
                exe:"https://dl.mqhwgl.com/qudao/piaohua/jianpian_setup_10001.exe",
                apk:"https://dl.mqhwgl.com/jp.apk"
            },
            "dy2018.com":{
                exe:"https://dl.mqhwgl.com/qudao/2018/jianpian_setup_10002.exe",
                apk:"https://dl.mqhwgl.com/jp.apk"
            },
            "poxiao.com":{
                exe:"https://dl.mqhwgl.com/qudao/poxiao/jianpian_setup_10003.exe",
                apk:"https://dl.mqhwgl.com/jp.apk"
            },
            "xigua.com":{
                exe:"https://dl.mqhwgl.com/qudao/xigua/jianpian_setup_10004.exe",
                apk:"https://dl.mqhwgl.com/jp.apk"
            },
            "kankanwu.com":{
                exe:"https://dl.mqhwgl.com/qudao/kankanwu/jianpian_setup_10005.exe",
                apk:"https://dl.mqhwgl.com/jp.apk"
            },
            "lol5s.com":{
                exe:"https://dl.mqhwgl.com/qudao/lol5s/jianpian_setup_10006.exe",
                apk:"https://dl.mqhwgl.com/jp.apk"
            },
        };
        var root_domain=(function(){if(/[\.\d]+$/i.test(location.hostname)) return location.hostname; return location.hostname.toLowerCase().split('.').slice(-2).join('.'); })();
        var download=config[root_domain]||config['default'];
        var appDownloadPage=isMobile?download['apk']:download['exe'];


        var from=/(^jianpian:)/i, to='jianpian://pathtype=url&path=$1',too = 'jianpian://pathtype=url&path=';
        if(isMobile) {to='openbyurl://jp.app?id=$1'; too ='openbyurl://jp.app?id=';}

        jQuery('a').each(function() {
            var othis=$(this),href=othis.attr('href'),txt=othis.text();
            if(from.test(href)){
                href = href.replace(/jianpian:\/\/pathtype=url&path=/g,'');
                othis.attr('href', href.replace(from, to));
                othis.off('click').on('click',function(evt){
                    evt.preventDefault && evt.preventDefault(); evt.stopPropagation && evt.stopPropagation();

                    if(/iPhone|iPod|ios|iPad/i.test(navigator.userAgent)){
                        alert("客官: 荐片播放器放还没出ios版 最新消息请关注官网www.jianpian.com");return;
                    }
                    if(/baidub/i.test(navigator.userAgent) && isMobile){
                        alert("客官: 请更换为qq或uc浏览器 暂不支持该浏览器 （具体支持哪些浏览器 请访问官方www.jianpian.com）");return;
                    }
                    var isOpenJianpian = 1;
                    if(isMobile) {
                        //for android
                        window.location.href = too + othis.attr('href');
                        check_jianpian_install();
                        downloadTimer = setTimeout(function() {
                            if(check_jianpian_install.installed) return;
                            if (getDocVisible()) {
                                show_jianpian_ad_pop();
                                isOpenJianpian = 2;
                                window.location.href = appDownloadPage;
                            }
                        }, 4000);
                        //统计用户是下载还是播放
                        setTimeout(function () {
                            if(isOpenJianpian == 2){
                                type = 2;

                            }else{
                                type =3;
                            }
                            client = 2;
                            ajaxTong(domain,client,type);

                        },4500);

                    } else {
                        // for windows
                        window.protocolCheck(too+othis.attr('href'),
                            function () {
                                alert('您还没有下载视频播放器请下载!');
                                show_jianpian_ad_pop();
                                window.location.href = appDownloadPage;
                                isOpenJianpian = 2;
                            });

                        //统计用户是下载还是播放
                        setTimeout(function () {
                            if(isOpenJianpian == 2){
                                type = 2;

                            }else{
                                type =3;
                            }
                            client = 1;
                            ajaxTong(domain,client,type);

                        },4000);


                    }

                });
            }
            from.test(txt) && othis.text(txt.replace('jianpian://pathtype=url&path=' ,''));
        });
    });
}

//自动执行
mainJp();




(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.protocolCheck = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
        function _registerEvent(target, eventType, cb) {
            if (target.addEventListener) {
                target.addEventListener(eventType, cb);
                return {
                    remove: function () {
                        target.removeEventListener(eventType, cb);
                    }
                };
            } else {
                target.attachEvent(eventType, cb);
                return {
                    remove: function () {
                        target.detachEvent(eventType, cb);
                    }
                };
            }
        }

        function _createHiddenIframe(target, uri) {
            var iframe = document.createElement("iframe");
            iframe.src = uri;
            iframe.id = "hiddenIframe";
            iframe.style.display = "none";
            target.appendChild(iframe);

            return iframe;
        }

        function openUriWithHiddenFrame(uri, failCb, successCb) {

            var timeout = setTimeout(function () {
                failCb();
                handler.remove();
            }, 1000);

            var iframe = document.querySelector("#hiddenIframe");
            if (!iframe) {
                iframe = _createHiddenIframe(document.body, "about:blank");
            }

            var handler = _registerEvent(window, "blur", onBlur);

            function onBlur() {
                clearTimeout(timeout);
                handler.remove();
                successCb();
            }

            iframe.contentWindow.location.href = uri;
        }

        function openUriWithTimeoutHack(uri, failCb, successCb) {

            var timeout = setTimeout(function () {
                failCb();
                handler.remove();
            }, 1000);

            //handle page running in an iframe (blur must be registered with top level window)
            var target = window;
            while (target != target.parent) {
                target = target.parent;
            }

            var handler = _registerEvent(target, "blur", onBlur);

            function onBlur() {
                clearTimeout(timeout);
                handler.remove();
                successCb();
            }

            window.location = uri;
        }

        function openUriUsingFirefox(uri, failCb, successCb) {
            var iframe = document.querySelector("#hiddenIframe");

            if (!iframe) {
                iframe = _createHiddenIframe(document.body, "about:blank");
            }

            try {
                iframe.contentWindow.location.href = uri;
                successCb();
            } catch (e) {
                if (e.name == "NS_ERROR_UNKNOWN_PROTOCOL") {
                    failCb();
                }
            }
        }

        function openUriUsingIEInOlderWindows(uri, failCb, successCb) {
            if (getInternetExplorerVersion() === 10) {
                openUriUsingIE10InWindows7(uri, failCb, successCb);
            } else if (getInternetExplorerVersion() === 9 || getInternetExplorerVersion() === 11) {
                openUriWithHiddenFrame(uri, failCb, successCb);
            } else {
                openUriInNewWindowHack(uri, failCb, successCb);
            }
        }

        function openUriUsingIE10InWindows7(uri, failCb, successCb) {
            var timeout = setTimeout(failCb, 1000);
            window.addEventListener("blur", function () {
                clearTimeout(timeout);
                successCb();
            });

            var iframe = document.querySelector("#hiddenIframe");
            if (!iframe) {
                iframe = _createHiddenIframe(document.body, "about:blank");
            }
            try {
                iframe.contentWindow.location.href = uri;
            } catch (e) {
                failCb();
                clearTimeout(timeout);
            }
        }

        function openUriInNewWindowHack(uri, failCb, successCb) {
            var myWindow = window.open('', '', 'width=0,height=0');

            myWindow.document.write("<iframe src='" + uri + "'></iframe>");

            setTimeout(function () {
                try {
                    myWindow.location.href;
                    myWindow.setTimeout("window.close()", 1000);
                    successCb();
                } catch (e) {
                    myWindow.close();
                    failCb();
                }
            }, 1000);
        }

        function openUriWithMsLaunchUri(uri, failCb, successCb) {
            navigator.msLaunchUri(uri,
                successCb,
                failCb
            );
        }

        function checkBrowser() {
            var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
            var ua = navigator.userAgent.toLowerCase();
            return {
                isOpera   : isOpera,
                isFirefox : typeof InstallTrigger !== 'undefined',
                isSafari  : (~ua.indexOf('safari') && !~ua.indexOf('chrome')) || Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
                isIOS     : /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
                isChrome  : !!window.chrome && !isOpera,
                isIE      : /*@cc_on!@*/false || !!document.documentMode // At least IE6
            }
        }

        function getInternetExplorerVersion() {
            var rv = -1;
            if (navigator.appName === "Microsoft Internet Explorer") {
                var ua = navigator.userAgent;
                var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null)
                    rv = parseFloat(RegExp.$1);
            }
            else if (navigator.appName === "Netscape") {
                var ua = navigator.userAgent;
                var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null) {
                    rv = parseFloat(RegExp.$1);
                }
            }
            return rv;
        }

        module.exports = function(uri, failCb, successCb, unsupportedCb) {
            function failCallback() {
                failCb && failCb();
            }

            function successCallback() {
                successCb && successCb();
            }

            if (navigator.msLaunchUri) { //for IE and Edge in Win 8 and Win 10
                openUriWithMsLaunchUri(uri, failCb, successCb);
            } else {
                var browser = checkBrowser();

                if (browser.isFirefox) {
                    openUriUsingFirefox(uri, failCallback, successCallback);
                } else if (browser.isChrome || browser.isIOS) {
                    openUriWithTimeoutHack(uri, failCallback, successCallback);
                } else if (browser.isIE) {
                    openUriUsingIEInOlderWindows(uri, failCallback, successCallback);
                } else if (browser.isSafari) {
                    openUriWithHiddenFrame(uri, failCallback, successCallback);
                } else {
                    unsupportedCb();
                    //not supported, implement please
                }
            }
        }

    },{}]},{},[1])(1)
});

function show_jianpian_ad_pop() {
    var id='div_pop_bf4ae4d6f075f7bc6335f6fbd25e924b';
    var isMobile=(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i));
    
    var cfg = [{
        img:{
            app:"https://www.jianpian.vip/src/images/adx/cpm1.png",
            pc:"https://www.jianpian.vip/src/images/adx/cpm1.png",
        },
    }, {
        img:{
            app:"https://www.jianpian.vip/src/images/adx/cpm2.png",
            pc:"https://www.jianpian.vip/src/images/adx/cpm2.png",
        },
    }, {
        img:{
            app:"https://www.jianpian.vip/src/images/adx/cpm3.png",
            pc:"https://www.jianpian.vip/src/images/adx/cpm3.png",
        },
    }];

    var require=function(url,callback) {
        var script=document.createElement('script');
        if (script.readyState) { //IE
            script.onreadystatechange = function(){
                a.push(script.readyState);
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback && callback();
                }
            };
        } else { //Others
            script.onload = function(){
                callback();
            };
        }
        script.src=url; document.body.appendChild(script);
    };
    var fn=function (n) {
        var elem=$('#'+id);
        if(elem.length){
            $(elem).find('.carousel').carousel('cycle').carousel(0);
            return elem.show();
        }

        var o = document.createElement("script");o.src = "https://cdn.bootcss.com/twitter-bootstrap/4.2.1/js/bootstrap.js"; document.head.appendChild(o);

        var body = document.getElementsByTagName("body")[0];
        var elem=document.createElement('div'); elem.id=id;
        body.insertBefore(elem, body.lastChild);

        var c = document.createElement("div");
        c.className='xl_pop_tip'; elem.appendChild(c);

        var style=document.createElement('style');
        style.textContent= "            *,::after,::before{box-sizing:border-box;}\n" +
            "            a{color:#007bff;text-decoration:none;background-color:transparent;}\n" +
            "            a:hover{color:#0056b3;text-decoration:underline;}\n" +
            "            #"+id+" img{vertical-align:middle;border-style:none;}\n" +
            "            #"+id+" .carousel{position:relative;}\n" +
            "            #"+id+" .carousel-inner{position:relative;width:100%;overflow:hidden;}\n" +
            "            #"+id+" .carousel-inner::after{display:block;clear:both;content:\"\";}\n" +
            "            #"+id+" .carousel-item{position:relative;display:none;float:left;width:100%;margin-right:-100%;-webkit-backface-visibility:hidden;backface-visibility:hidden;transition:-webkit-transform .6s ease-in-out;transition:transform .6s ease-in-out;transition:transform .6s ease-in-out,-webkit-transform .6s ease-in-out;}\n" +
            "            @media screen and (prefers-reduced-motion:reduce){\n" +
            "             #"+id+" .carousel-item{transition:none;}\n" +
            "            }\n" +
            "            #"+id+" .carousel-item.active{display:block;}\n" +
            "            #"+id+" .d-block{display:block!important;}\n" +
            "            #"+id+" .w-100{width:100%!important;}\n" +
            "            #"+id+" {\n" +
            "                width:400px;height:325px;position:absolute; \n" +
            "                background-cloor:#fff;\n" +
            "                background:transparent;\n" +
            "                font: 14px/1.5 Arial,PingfangSC,Microsoft YaHei,sans-serif; \n" +
            "                box-sizing: border-box; border-radius: 4px;\n" +
            "                -webkit-box-shadow: 0 0 20px rgba(0,0,0,.2);\n" +
            "                box-shadow: 0 0 20px rgba(0,0,0,.2);\n" +
            "                line-height: 1;\n" +
            "                position: fixed;\n" +
            "                width: 100%;\n" +
            "                height: 100%;\n" +
            "                top: 0px;\n" +
            "                left: 0px;\n" +
            "                z-index: 99999;\n" +
            "            }\n" +
            "            \n" +
            "            #"+id+" .xl_pop_tip {\n" +
            "                font: 14px/1.5 Arial,PingfangSC,Microsoft YaHei,sans-serif; \n" +
            "                box-sizing: border-box;\n" +
            "                border-radius: 4px;\n" +
            "                -webkit-box-shadow: 0 0 20px rgba(0,0,0,.2);\n" +
            "                box-shadow: 0 0 20px rgba(0,0,0,.2);\n" +
            "                line-height: 1;\n" +
            "                background: #fff;\n" +
            "                width: 400px; height:325px;\n" +
            "                position: absolute;\n" +
            "                top: 0;\n" +
            "                left: 0;\n" +
            "                bottom: 0;\n" +
            "                right: 0;\n" +
            "                margin: auto;\n" +
            "            }\n" +
            "                \n" +
            "            \n" +
            "            @media print{\n" +
            "                *,::after,::before{text-shadow:none!important;box-shadow:none!important;}\n" +
            "                a:not(.btn){text-decoration:underline;}\n" +
            "                img{page-break-inside:avoid;}\n" +
            "            }";
        document.head.appendChild(style);

        var mode=isMobile?"app":"pc";

        var i = function (oelem, t) {
            var r = t;
            !function () {
                for (var e = "", t = 0; t < r.length; t++) {
                    var o = '<div data-id='+t+'  class="carousel-item {{active}}"><img src="{{imgPath}}" class="d-block w-100" /></div>';
                    o = (o = (o = 0 == t ? o.replace(/{{active}}/, "active") : o.replace(/{{active}}/, "")).replace(/{{url}}/, r[t].link)).replace(/{{imgPath}}/, r[t].img[mode]), e += o
                }
                oelem.innerHTML = '<div class="carousel slide" data-ride="carousel"><div class="carousel-inner">' + e + "</div></div>"
            }();
            var cb;
            cb=function(){
                try {
                    $(oelem).find('.carousel').carousel('cycle');
                }catch(e){;
                    setTimeout(cb,200);
                }
            };
            setTimeout(cb,200);

            $(oelem).on('click',function (evt) {
                evt.preventDefault(); evt.stopPropagation();
                var ocar=$(oelem).find('.carousel');
                var items=ocar.find('.carousel-item');
                var bid=$(items[items.length-1]).data('id');
                var aid=ocar.find('.carousel-item.active').data('id');
                if(aid==bid){
                    $('#'+id).css({'display':'none'});return;
                }
                ocar.carousel('next');
            });

        };

        new i(c,n);
    };
    var onload=function(){
        $(function () {
            fn(cfg);
        });
    };
    setTimeout(function () {
        if(!window.jQuery) {
            require("https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js", onload);
        }else{
            onload();
        }
    },10);

}

function check_jianpian_install(){
    var fn=function(){
        check_jianpian_install.installed=false;
        window.jianpian_callback=function(data){
            try{
                if(data.app=="jianpian"){
                    check_jianpian_install.installed=true;
                }
            }catch(e){;}
        };
        var ports=[26750];
        for(var i=0,n=ports.length;i<n;i++) {
            var elem = document.createElement('script');elem.src = "http://127.0.0.1:26750";document.body.appendChild(elem);
        }
    };
    setTimeout(fn,10);
}

