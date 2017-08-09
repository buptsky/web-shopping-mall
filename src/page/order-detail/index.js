require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide = require('page/common/nav-side/index.js');
var templateIndex = require('./index.string');

var _mall = require('util/mall.js');
var _order = require('service/order-service');

// page逻辑部分
var page = {
  data: {
    orderNumber: _mall.getUrlParam('orderNumber')
  },
  init: function () {
    this.onLoad();
    this.bindEvent();
  },
  onLoad: function () {
    // 初始化左侧菜单
    navSide.init({
      name: 'order-list'
    });
    this.loadDetail();
  },
  loadDetail: function () { // 加载订单列表
    var orderDetailHtml = '';
    var self = this;
    var $content = $('.content');
    $content.html('<div class="loading"></div>')
    _order.getOrderDetail(self.data.orderNumber, function (res) {
      self.dataFilter(res);
      orderDetailHtml = _mall.renderHtml(templateIndex, res);
      $content.html(orderDetailHtml);
    }, function (errMsg) {
      $content.html('<p class="err-tip">' + errMsg + '</p>');
    });
  },
  dataFilter: function (data) {
    data.needPay = data.status === 10;
    data.isCancelable = data.status === 10;
  },
  bindEvent: function () {
    var self = this;
    $(document).on('click', '.order-cancel', function () {
      if (window.confirm('确实要取消订单么？')) {
        _order.cancelOrder(self.data.orderNumber, function (res) {
          _mall.successTips('订单取消成功');
          self.loadDetail();
        }, function (errMsg) {
          _mall.errorTips(errMsg);
        });
      }
    });
  }
};
$(function () {
  page.init();
});
