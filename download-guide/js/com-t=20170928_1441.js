(function () {
  xla = window.xla || (window.xla = []);
  xla.push({
    type: 'config',
    appid: 20021,
    secret: 'a6160ea5292629d5fe23e642d5b5ae43'
  });
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = location.protocol + '//res-etl-ssl.xunlei.com/v1.0.0/xla.min.js';
  var x = document.getElementsByTagName('script')[0];
  x.parentNode.insertBefore(s, x);
})();

var ua = navigator.userAgent;
var UA_IOS_REG = /\b(iPad|iPhone|iPod)\b.*? OS ([\d_]+)/;
var UA_ANDROID_REG = /\bAndroid([^;]+)/;
var UA_WX_REG = /MicroMessenger/;
var UA_WEIBO_REG = /\bWeibo/;
var UA_QZONE_REG = /Qzone\//;

var isIOS = UA_IOS_REG.test(ua);
var isAndroid = UA_ANDROID_REG.test(ua);
var isWx = UA_WX_REG.test(ua);
var isWeibo = UA_WEIBO_REG.test(ua);
var isQzone = UA_QZONE_REG.test(ua);

function getPlatform() {
  if( isWx ) {
    return 'wechat'
  }

  if( isQzone ) {
    return 'qq'
  }

  if( isWeibo ) {
    return 'weibo'
  }

  return 'safari';
}

function QueryString() {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
};

try{
  var _finger = (function(){
    var fingerDebugIsOpen =  true;
    var fingersDefaultNumber = 4;

    function fn(ev){
      if( fingerDebugIsOpen === false ){
        return;
      }

      if(ev.touches.length === fingersDefaultNumber){
        window.location.reload(true);
      }
    }

    return {
      open: function(fingers){
        fingerDebugIsOpen = true;

        if(typeof fingers === "number" && fingers > 0){
          fingersDefaultNumber = fingers;
        }

        // 如果已经绑定过就不再绑定了，但可以修改手指的数量
        document.removeEventListener('touchstart', fn);
        document.addEventListener('touchstart', fn, false);
      },

      close : function(){
        fingerDebugIsOpen = false;
        document.removeEventListener('touchstart', fn);
      }
    }
  })();

  _finger.open();
}catch (e){}

// 如果不是微信引导页，在微信中打开，都去引导页
if( typeof G_is_wx_yindaoye === 'undefined' ) {
  if( isIOS ) {
    if( isWx || isWeibo || isQzone ) {
      window.location.href = 'index.html' + location.search;
    }
  }else{
    window.location.href = 'http://wenshidata.com/';
  }
}

function getIOSVersion() {
    if( isIOS ) {
        var ver = navigator.userAgent.match(/os\s+(\d+)/i);
        
        if( ver && ver[1] ) {
            return parseInt(ver[1], 10)
        }
    }
    
    // 如果不是iOS系统，就假设大于9
    return 100;
}

var IOS_VERSION = getIOSVersion();