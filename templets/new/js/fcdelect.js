var ports = ["30506", "31007"]

/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/

var Base64 = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}

function onInstallFCDownloader(fcUrl, channelName){
    if (channelName === null || channelName === undefined || channelName === "") {
        channelName = "FCDownloader"
    }
    alert("您还没安装" + channelName + "，无法下载该文件！" + channelName+ "为下载平均加速80%，安装即可体验高速下载！")
    window.location = fcUrl
}

function tryUseProtocol(url, failCb, successCb){
    proto = "btboe://"+Base64.encode(url)
    window.protocolCheck(proto, failCb, successCb)
    //location.href = proto
}

function PostToPort(portindex, method, data, onSuccess, onFailed){
    if(portindex >= ports.length){
        onFailed()
        return
    }
    var port = ports[portindex];

    $.ajax({
        url: "http://127.0.0.1:" + port + "/" + method,
        dataType: "json",
        contentType: 'text/plain',
        type: "POST",
        data: data,
        timeout: 15000,
        success: function (a) {
            onSuccess(a)
        },
        error: function (a, b) {
            PostToPort(portindex+1, method, data, onSuccess, onFailed)
        }
    })
    
}

function BeginPost(method, data, onSuccess, onFailed){
    PostToPort(0, method, data, onSuccess, onFailed)
}

function IsInApp()
{
    return navigator.userAgent.match(/(FCDownload)/i) != null
}

function IsMobile()
{
    return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i) != null
}

function Download(url, noInstallCallback) {
    if (IsMobile())
    {
        var proto = "btboe://"+Base64.encode(url)
        openApp(proto, noInstallCallback)
    }
    else
    {
        BeginPost("getversion", "{}", function (a){
            BeginPost("newtask", "[{\"url\":\""+url+"\"}]", function(a){
        }, function(){
                var proto = "btboe://"+Base64.encode(url)
                window.protocolCheck(proto, noInstallCallback, function(){})
        })
        }, function () {
            var proto = "btboe://"+Base64.encode(url)
            window.protocolCheck(proto, noInstallCallback, function(){})
        })
    }
}

function DownloadAndPlay(url, callback, noInstallCallback) {
    if (IsMobile())
    {
        var proto = "btbop://"+Base64.encode(url)
        openApp(proto, noInstallCallback)
    }
    else
    {
        BeginPost("getversion", "{}", function (a) {
                BeginPost("downloadplay", "{\"url\":\"" + url + "\"}", function (a) {
                    callback(a['data'])
                }, function () {
                    noInstallCallback()
                })
            }
            , function () {
                noInstallCallback()
            }
        )
    }
}

function toFCDEUrl(url) {
    return "btboe://"+Base64.encode(url)
}

function openApp(schemaUrl, fail) {
    //创建一个iframe用于存放想要打开的APP的URI Scheme
    var ifr = document.createElement('iframe'),
        t = 3000,
        t1,
        timeout

    ifr.style.display = 'none'
    document.body.appendChild(ifr)
    t1 = Date.now()
    ifr.src = schemaUrl
    timeout = setTimeout(function () {
        var t2 = Date.now()
        if (!IsInApp())
        {
            if (t2 - t1 < t + 100) {
                if (typeof fail == 'function') {
                    fail()
                } else {
                    location.href = fail
                }
            }
        }
        document.body.removeChild(ifr)
    }, t)
}

