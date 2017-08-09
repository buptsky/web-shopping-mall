require('./index.css');
require('page/common/header/index.js');
require('page/common/nav/index.js');
var templateAddress = require('./address-list.string');
var templateProduct = require('./product-list.string');
var _mall = require('util/mall.js');
var _order = require('service/order-service.js');
var _address = require('service/address-service.js');
var addressModal = require('./address-modal');

var page = {
  data: {
    selectedAddressId: null
  },
  init: function () {
    this.onLoad();
    this.bindEvent();
  },
  onLoad: function () {
    this.loadAddressList();
    this.loadProductList();
  },
  bindEvent: function () {
    var self = this;
    // 地址选择
    $(document).on('click', '.address-item', function () {
      $(this).addClass('active').siblings('.address-item').removeClass('active');
      self.data.selectedAddressId = $(this).data('id');
    });
    // 订单提交
    $(document).on('click', '.order-submit', function () {
      var shippingId = self.data.selectedAddressId;
      if (shippingId) {
        _order.createOrder({
          shippingId: shippingId
        }, function (res) {
          window.location.href = './payment.html?orderNumber=' + res.orderNo;
        }, function (errMsg) {
          _mall.errorTips(errMsg);
        });
      } else {
        _mall.errorTips('选择地址后再提交');
      }
    });
    // 地址添加
    $(document).on('click', '.address-new', function () {
      addressModal.show({
        isUpdate: false,
        onSuccess: function () {
          self.loadAddressList();
        }
      });
    });
    // 地址删除
    $(document).on('click', '.address-delete', function (e) {
      e.stopPropagation();
      var id = $(this).parents('.address-item').data('id');
      if (window.confirm('确认要删除该地址么？')) {
        _address.deleteAddress(id, function (res) {
          self.loadAddressList();
        }, function (errMsg) {
          _mall.errorTips(errMsg);
        });
      }
    });
    // 地址编辑
    $(document).on('click', '.address-update', function (e) {
      e.stopPropagation();
      var shippingId = $(this).parents('.address-item').data('id');
      _address.getAddress(shippingId, function (res) {
        addressModal.show({
          isUpdate: true,
          data: res,
          onSuccess: function () {
            self.loadAddressList();
          }
        });
      }, function (errMsg) {
        _mall.errorTips(errMsg);
      });
    });
  },
  loadAddressList: function () { // 加载地址列表
    var self = this;
    // loading
    $('.address-con').html('<div class="loading"></div>');
    // 获取地址列表
    _address.getAddressList(function (res) {
      self.addressFilter(res);
      var addressListHtml = _mall.renderHtml(templateAddress, res);
      $('.address-con').html(addressListHtml);
    }, function (errMsg) {
      $('.address-con').html('<p class="err-tip">地址加载失败，刷新后重试</p>')
    });
  },
  addressFilter: function (data) { // 处理地址列表选中状态在更新后重置
    if (this.data.selectedAddressId) {
      var selectFlag = false;
      for (var i = 0, length = data.list.length; i < length; i++) {
        if (data.list[i].id === this.data.selectedAddressId) {
          data.list[i].isActive = true;
          selectFlag = true;
        }
      }
      // 如果以前选中地址不在列表中，删除记录
      if (!selectFlag) {
        this.data.selectedAddressId = null;
      }
    }
  },
  loadProductList: function () { // 加载商品清单
    var self = this;
    // loading
    $('.product-con').html('<div class="loading"></div>');
    // 获取地址列表
    _order.getProductList(function (res) {
      var productListHtml = _mall.renderHtml(templateProduct, res);
      $('.product-con').html(productListHtml);
    }, function (errMsg) {
      $('.product-con').html('<p class="err-tip">商品信息加载失败，刷新后重试</p>')
    });
  },
  renderCart: function (data) { // 渲染购物车
    this.filter(data);
  },
  filter: function (data) { // 数据处理
  }
};
$(function () {
  page.init();
});


