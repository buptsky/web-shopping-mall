require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var templateIndex = require('./index.string');

var _mall = require('util/mall.js');
var _payment = require('service/payment-service');

// page逻辑部分
var page = {
  data: {
    orderNumber: _mall.getUrlParam('orderNumber')
  },
  init: function () {
    this.onLoad();
  },
  onLoad: function () {
    this.loadPaymentInfo();
  },
  loadPaymentInfo: function () { // 加载订单列表
    var paymentHtml = '';
    var self = this;
    var $pageWrap = $('.page-wrap');
    $pageWrap.html('<div class="loading"></div>')
    _payment.getPaymentInfo(self.data.orderNumber, function (res) {
      paymentHtml = _mall.renderHtml(templateIndex, res);
      $pageWrap.html(paymentHtml);
      self.listenOrderStatus();
    }, function (errMsg) {
      $pageWrap.html('<p class="err-tip">' + errMsg + '</p>');
    });
  },
  listenOrderStatus: function () { // 监听订单状态
    var self = this;
    this.paymentTimer = setInterval(function () {
      _payment.getPaymentStatus(self.data.orderNumber, function (res) {
        if (res === true) {
          window.location.href = './result.html?type=payment&orderNumber=' + self.data.orderNumber;
        }
      }, function (errMsg) {
        
      });
    }, 5000);
  }
};
$(function () {
  page.init();
});
