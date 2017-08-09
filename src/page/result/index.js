require('./index.css');
require('page/common/nav-simple/index.js');
var _mall = require('util/mall.js');

$(function () {
  var type = _mall.getUrlParam('type') || 'default',
    $element = $('.' + type + '-success');
  if (type === 'payment') {
    var orderNumber = _mall.getUrlParam('orderNumber');
    var $orderNumber = $element.find('.order-number');
    $orderNumber.attr('href', $orderNumber.attr('href') + orderNumber);
  }
  // 显示对应提示元素
  $element.show();
});