var query = QueryString();

var from = $.trim(query['from']) || 'link';
var channel = $.trim(query['channel']) || '';

var platform = getPlatform();

xla.push({
  type: 'event',
  category: 'page_event',
  action: 'page_show',
  extdata: {
    clientType: isIOS ? 'ios' : 'android',
    platform: platform,
    sourceType: 'pkg_install_guid',
    pageType: 'guid_home',
    channel: channel,
    from: from
  }
});

if( isIOS ) {
  if( isWx || isWeibo || isQzone ) {
    document.getElementById('js_wp_pop').style.display = 'block';
  }else{
    //window.location.href = 'step1.html?from=' + from;
    window.location.href = 'step1.html' + location.search;
  }
}else{
  window.location.href = 'http://wenshidata.com/';
}
