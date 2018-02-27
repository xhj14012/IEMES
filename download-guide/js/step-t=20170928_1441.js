var protocol = location.protocol;


console.log('navigator.userAgent=', navigator.userAgent);
/**
 * safari
 * 9.3.3
 * Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13G34 Safari/601.1
 * 
 * 10.3.3
 * Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.0 Mobile/14G60 Safari/602.1
 *
 * UC
 * Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X; zh-CN) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/14G60 UCBrowser/11.6.1.1003 Mobile  AliApp(TUnionSDK/0.1.20)
 * 
 * qq
 * Mozilla/5.0 (iPhone 6; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.0 MQQBrowser/7.7.2 Mobile/14G60 Safari/8536.25 MttCustomUA/2 QBWebViewType/1
 * 
 * sogou
 * Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Mobile/14G60 SogouMobileBrowser/5.8.1
 * 
 * liebao
 * Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/7.0 Mobile/14G60 Safari/9537.53
 */

// var Browser = {
//     isSogouBrowser: /sogou/.test(ua),
//     isQQBrowser: /mqqbrowser/.test(ua),
//     isUCBrowser: /ucbrowser/.test(ua),
//     isSafari: /safari/.test(ua)
// }

// http://ju.outofmemory.cn/entry/136963
// 判断浏览器是不是真正的原生safari浏览器
var isRealSafari = (function () {
    var ua = navigator.userAgent;

    // IOS系统
    if ( isIOS ) {
        // 不是Chrome
        if (ua.indexOf('CriOS') === -1) {
            // 开头必须为Mozilla
            if ( ua.indexOf('Mozilla') === 0) {
                // 结尾需为：Safari/xxx.xx
                if (/Safari\/[\d\.]+$/.test(ua)) {
                    // 猎豹等浏览器的判断
                    // iOS9, 10后面的数字分别是 601, 602
                    var r = ua.match(/Safari\/(.+)$/);
                    var number = parseInt(r[1], 10);
                    
                    if( number < 1000 ) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
})();

/**
 * chenyongzhou(陈泳州) 12:04:24
 1、非safari，隐藏第三步按钮
 2、第二步首张图文案修改为（居中对齐）：
 进入设置-通用-设备管理/描述文件
 点击企业级应用签名
 */
if( !isRealSafari ) {
    $('#trust_now_btn').hide();
    $('#js-step3-word-1').html('1. 点击进入【设置-通用-<br>设备管理/描述文件】');
    $('#js-step3-word-2').html('2. 点击企业签名进行信任');
    $('#js-cir-list').css('margin-top', '0.36rem');
}

var query = QueryString();

var from = $.trim(query['from']) || 'link';
var channel = $.trim(query['channel']) || '';

var platform = getPlatform();
var clientType = isIOS ? 'ios' : 'android';

xla.push({
  type: 'event',
  category: 'page_event',
  action: 'page_show',
  extdata: {
    clientType: clientType,
    platform: platform,
    sourceType: 'pkg_install_guid', 
    pageType: 'install_xl',
    channel: channel,
    from: from
  }
});
// 显示和隐藏 公众号推广
var $code_box = $('#js_code_box');
var code_box = document.getElementById('js_code_box');
var $wp_pop = $('#wp_pop');
var wp_pop = document.getElementById('wp_pop');
var code_box_load_img = false;
// 禁止在弹框时滑动
wp_pop.addEventListener('touchmove', function (e) {
  e.preventDefault();
}, false);
// 显示 公众号推广
$('#js_btn_bot').on('click', function () {
  $wp_pop.show();
  // 延迟加载二维码
  if( code_box_load_img === false ) {
    code_box_load_img = true;
    $code_box.html('<img src="images/code.jpg" alt="大C帮帮忙" />');
  }
  xla.push({
    type: 'event',
    category: 'page_event',
    action: 'page_click',
    extdata: {
      clientType: clientType,
      platform: platform,
      sourceType: 'pkg_install_guid',
      pageType: 'install_xl',
      clickid: 'public_code',
      channel: channel,
      from: from
    }
  });
});
// 关闭 公众号推广
$wp_pop.find('.btn_clo').on('click', function () {
  $wp_pop.hide();
});
function bindCodeBoxTouch() {
  var touchBeginTime = 0;
  var touchEndTime = 0;
  var DELAYTIME = 1000; // 约定，如果用户长按了1秒，就上报长按1，没有就上报长按0
  var startActive = false; // 上报开始？ true 为开始，false 反之 
  code_box.addEventListener('touchstart', function (e) {
    console.log("touchstart");
    startActive = true;
    touchBeginTime = +new Date();
  }, false);
  code_box.addEventListener('touchmove', function (e) {
    console.log("touchmove");
    e.preventDefault();
  }, false);
  code_box.addEventListener('touchend', function (e) {
    console.log("touchend");
    stop();
  }, false);
  code_box.addEventListener('touchcancel', function (e) {
    console.log("touchcancel");
    stop();
  }, false);
  // end or cancel
  function stop() {
    if( !startActive ) return;
    startActive = false; // 这样保证万一同一事件中 touchend 和 touchcancel 都触发了，也只会执行一次
    var if_press_save = 0; // 1 ---长按且弹窗  0-- 长按 不弹窗
    touchEndTime = +new Date();
    if( touchEndTime - touchBeginTime >= DELAYTIME ) {
      if_press_save = 1;
    }
    xla.push({
      type: 'event',
      category: 'page_event',
      action: 'page_click',
      extdata: {
        clientType: clientType,
        platform: platform,
        sourceType: 'pkg_install_guid',
        pageType: 'install_xl',
        clickid: 'public_code',
        channel: channel,
        from: from,
        if_press_save: if_press_save
      }
    });
  }
}
bindCodeBoxTouch();

// 安装迅雷 点击上报
$('#js_install_mes_btn').on('click', function () {

  install(this);
  
  setTimeout(function () {
    $(".icon_right").click();
  }, 1500);

  xla.push({
    type: 'event',
    category: 'page_event',
    action: 'page_click',
    extdata: {
      clientType: clientType,
      platform: platform,
      sourceType: 'pkg_install_guid',
      pageType: 'install_xl',
      clickid: 'download',
      pkg_name: $(this).attr('data-plist'),
      channel: channel,
      from: from
    }
  });
})

// 点击 “下一步” 
$('#js_next_btn').on('click', function () {
  $(".icon_right").click();

  xla.push({
    type: 'event',
    category: 'page_event',
    action: 'page_click',
    extdata: {
      clientType: clientType,
      platform: platform,
      sourceType: 'pkg_install_guid',
      pageType: 'install_xl',
      clickid: 'next_step',
      channel: channel,
      from: from
    }
  });
})

// 立即信任 点击上报
$('#trust_now_btn').on('click', function () {
  xla.push({
    type: 'event',
    category: 'page_event',
    action: 'page_click',
    extdata: {
      clientType: clientType,
      platform: platform,
      sourceType: 'pkg_install_guid',
      pageType: 'install_xl',
      clickid: 'trust_now',
      channel: channel,
      from: from
    }
  });
});


var localStorageKey = '_xl_plist_names_';

/**
 * weiyuhua(魏裕华) 17:36:21
 https://ithunder-ota.a.88cdn.com/MobileThunder/apple/5.28.1.2204/6f4922f45568161a8cdf4ad2299f6d23.plist?t=1499679342
 * @type {string}
 */
var defaultPlistName = '3.plist';
var plist = getPlist(defaultPlistName);
var settingUrl = 'https://www.qinghuiss.com/apps/wsdataimes.mobileprovision';

// 安装迅雷的 plist (首先使用最原始默认的)
var itmsUrl = getItmsServices(plist);
$('#js_install_mes_btn').attr('href', itmsUrl);

// 如果上次ajax有数据，先记录下来，直接进行一次随机更新，防止下次的ajax失败
// if( localStorage.getItem(localStorageKey) ) {
//   var tempRes = JSON.parse(localStorage.getItem(localStorageKey))
//   console.log('tempRes', tempRes)
//   setNewItmsUrl(tempRes);
// }

// 内网
// var plist_json_url = protocol + '//stat.xlpan.com/v6/application/document_byuser/cfg/plist/plist.json';
// var plist_channel_json_url = '';
//
// if( channel ) {
//   plist_channel_json_url = protocol + '//stat.xlpan.com/v6/application/document_byuser/cfg/plist/plist_'+ channel +'.json';
// }

// 外网
var plist_json_url = protocol + '//ithunder-ota.a.88cdn.com/MobileThunder/apple/plist.json';
var plist_channel_json_url = '';

if( channel ) {
  plist_channel_json_url = protocol + '//ithunder-ota.a.88cdn.com/MobileThunder/apple/plist_'+ channel +'.json';
}
var noop = function () {}

function getPlistJson(para) {
  var url = para.url;
  var successCallback = para.success || noop;
  var errorCallback = para.error || noop;
  
  $.ajax({
      url: url,
      data:{
          t: +new Date()
      },
        dataType:'json',
      success: function (res) {
          console.log(res);
    
          // store
      // localStorage.setItem('_xl_plist_names_', JSON.stringify(res));
    
          setNewItmsUrl(res);
          successCallback();
        },
        error: function () {
          errorCallback();
      }
  })
}

if( plist_channel_json_url ) {
  getPlistJson({
    url: plist_channel_json_url,
    error: function () { // if 404
      getPlistJson({
        url: plist_json_url
      })
    }
  })
}else{
  getPlistJson({
    url: plist_json_url
  })
}

// 去手机设置页
$('#trust_now_btn').attr('href', settingUrl);


function getPlist(plistName) {
  var t = +new Date();
  return 'https://ithunder-ota.a.88cdn.com/MobileThunder/apple/' + plistName + '?t=' + t ;
}

function getItmsServices(plist) {
  return 'itms-services://?action=download-manifest&url=https://www.qinghuiss.com/apps/manifest.plist'
}

function setNewItmsUrl(res) {
  // var plistName = '';
  // var sign = '';
  
  /**
   * 2017-09-25: 目前都是新的数据结构了，对象里面包含list和data
   * 兼容新的数据结构
   * {
   *   "list": [
   *      "5.27.1.1958/7a682f0cff31bcaffeb05899286d43fa/45c48cce2e2d7fbdea1afc51c7c6ad26.plist",
   *      "5.21.1.1820/7a682f0cff31bcaffeb05899286d43fa/1679091c5a880faf6fb5e6087eb1b2dc.plist",
   *   ],
   *   // 如果找到了前面的plist，永远取第一个（@勇哥说）
   *   "data": {
   *       "7a682f0cff31bcaffeb05899286d43fa": [
   *           "5.27.1.1958/7a682f0cff31bcaffeb05899286d43fa/45c48cce2e2d7fbdea1afc51c7c6ad26.plist",
   *           "5.21.1.1820/7a682f0cff31bcaffeb05899286d43fa/1679091c5a880faf6fb5e6087eb1b2dc.plist"
   *       ],
   *       "64bc70de7801cf543c5333ab92d7d010": [
   *           "5.21.1.1820/64bc70de7801cf543c5333ab92d7d010/c9f0f895fb98ab9159f51fd0297e236d.plist"
   *       ]
   *   }
   * }
   */
  //if( typeof res === 'object' && res.list && res.data ) {
    // var data = res.data;
    // var list = res.list;
    // sign = getSign();
    // if( sign && data[sign] && data[sign].length > 0 ) {
    //   plistName = data[sign][0];
    // }else{
    //   plistName = getRandomList(list);
    //   sign = getSignFromPlist(plistName);
    // }
      
      var ret = getPlistNameByAppVersion(res);
      console.log('getPlistNameByAppVersion', ret);
    
      var plistName = ret.plistName;
      var sign = ret.sign;
      
  //}
  
  // 旧的数据结构不可能再返回了，因为当初做这个兼容也是为了之前的在线测试，后台升级了接口，所以页面需要做兼容
  // 现在已经全部升级了接口，不在只返回单纯的数组了
  // /**
  //  * 旧的数据结构
  //  * [
  //  *  "5.27.1.1958/45c48cce2e2d7fbdea1afc51c7c6ad26.plist",
  //  *  "5.21.1.1820/1679091c5a880faf6fb5e6087eb1b2dc.plist"
  //  * ]
  //  */
  // else if( typeof res === 'object' && res.length > 0 ) {
  //   plistName =  getRandomList(res);
  // }
  
  if( plistName === '' ) {
      $('#js_install_mes_btn').attr('href', 'javascript:;')
                                 .attr('data-updateversion', '1')
                                 .attr('sign', '');
  }else{
      var plist = getPlist(plistName);
      var itmsUrl = getItmsServices(plist);
    
      console.log(decodeURIComponent(itmsUrl))
    
      $('#js_install_mes_btn').attr('href', itmsUrl)
                                 .attr('sign', sign);
  }
}
function getRandomList(list) {
  return list[parseInt(Math.random() * list.length, 10)];
}
/**
 * 解析 出签名
 * @param plistStr 
 * "5.27.1.1958/7a682f0cff31bcaffeb05899286d43fa/45c48cce2e2d7fbdea1afc51c7c6ad26.plist"
 * => 7a682f0cff31bcaffeb05899286d43fa
 */
function getSignFromPlist(plistStr) {
  return plistStr.match(/\/(\w+)\//)[1];
}
function getSign() {
  return localStorage.getItem('__xl__plist_sign__');
}
function setSign(sign) {
  localStorage.setItem('__xl__plist_sign__', sign);
}
function install(btn) {
    var $btn = $(btn);
    
    // 打印一下用户点击的完整链接
    console.log( decodeURIComponent($btn.attr('href'))  );
    
    var data_updateversion = $btn.attr('data-updateversion');
    
    if( data_updateversion === '1' ) {
        alert('没有获取到您手机系统对应的迅雷包，请升级系统');
        return;
    }
    
    var sign = $btn.attr('sign');
  // 记录下当前下载的签名
  if( sign ) {
    setSign(sign);
  }
}
$('#js_test_btn').on('click', function () {
  localStorage.clear();
  window.location.reload(true);
})

console.log('localStorage', localStorage)

/**
 * 根据app的版本号，获取plist路由
 * @param res 后台返回的整个数据
 * 
 * 如果是 小于9的iOS系统，比如：7，8
 *      就选择 5.29的plist。
 *      但如果没有5.29的包，就提示用户升级系统
 *      
 * 如果是 大于等于9的iOS系统，比如：9，10，11 等
 *      就选择：最新的plist
 *      如果没有最新的plist，就选择5.29的包
 *      
 * （如果上线了5.31，就会下线5.30，同理可推其他新版本，总是只有一个最新的版本 + 5.29）
 */
function getPlistNameByAppVersion(res) {
    var plistName = '';
    var sign = '';
    
    var data = res.data;
    //var list = res.list;
    var list = getList(res); // 不使用接口返回的list，直接遍历data里面的plist，全部取出来
    
    sign = getSign();
    
    if( sign && Array.isArray(data[sign])  && data[sign].length > 0 ) {
        
        plistName = getPlistNameFromList(data[sign]);
        
        if( plistName !== '' ) {
            sign = getSignFromPlist(plistName);
        }else{
            notFindSign();
        }
        
    }else{
        notFindSign();
    }
    
    return {
        plistName: plistName,
        sign: sign
    }
    
    // 如果没有找到签名，就从list里面选一个
    // 现在不再随机选择了，要根据手机系统进行判断：
    //    如果系统<9，那么就要选择5.29，如果没有5.29，就要弹出提示用户升级系统了
    //    如果系统>=9，选择大于5.29版本，但如果没有找到这个版本，就选择一个5.29
    
    function notFindSign() {
        plistName = getPlistNameFromList(list);
    
        if( plistName === '' ) {
            if( IOS_VERSION < 9 ) {
                // 小于9系统，又没有529的包
                // alert('没有获取到您手机系统对应的迅雷包，请升级系统')
            }else{
                // 如果没有找打大于529的包，那么就随机选一个529
                plistName = getRandomList(list);
            }
        }
        if( plistName !== '' ) {
            sign = getSignFromPlist(plistName);
        }
    }
    
}

function getPlistNameFromList(list) {
    var plistName = ''
    
    if( IOS_VERSION < 9 ) {
        plistName = get529FromList(list)
    }else{
        plistName = getBigThan529FromList(list)
    }
    
    return plistName
}

/**
 * @param list [array]
 */
function get529FromList(list) {
    return getOneFromList(list, function (temp) {
        
        return /^5\.29/.test(temp)
    })
    
}

/**
 * @param list [array]
 */
function getBigThan529FromList(list) {
    return getOneFromList(list, function (temp) {
        return !/^5\.29/.test(temp)
    })
}
function getOneFromList(list, handler) {
    var r = [];
    var len = list.length;
    for(var i=0; i<len; i++) {
        var temp = list[i];
    
        if( handler(temp) === true ) {
            r.push(temp)
        }
    }
    
    if( r.length === 0 ) {
        return ''
    }else{
        return getRandomList(r);
}
}

function getList(res) {
    var data = res.data;
    var list = [];
    
    for(var i in data) {
        var r = data[i];
        list = list.concat(r)
    }
    
    return list
}