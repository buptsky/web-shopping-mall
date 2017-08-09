require('./index.css');
require('page/common/header/index.js');
var nav = require('page/common/nav/index.js');
var templateIndex = require('./index.string');
var _mall = require('util/mall.js');
var _cart = require('service/cart-service');

var page = {
  data: {
    cartInfo: {}
  },
  init: function () {
    this.onLoad();
    this.bindEvent();
  },
  onLoad: function () {
    this.loadCart();
  },
  bindEvent: function () {
    var self = this;
    // 商品选择/取消选择
    $(document).on('click', '.cart-select', function () {
      var productId = $(this).parents('.cart-table').data('product-id');
      // 切换选中状态
      if ($(this).is(':checked')) { // 选中
        _cart.selectProduct(productId, function (res) {
          self.renderCart(res);
        }, function (errMsg) {
          self.showCartError(errMsg);
        });
      } else { // 取消选中
        _cart.unselectProduct(productId, function (res) {
          self.renderCart(res);
        }, function (errMsg) {
          self.showCartError(errMsg);
        });
      }
    });
    // 商品全选/取消全选
    $(document).on('click', '.cart-select-all', function () {
      // 切换选中状态
      if ($(this).is(':checked')) { // 全选
        _cart.selectAllProduct(function (res) {
          self.renderCart(res);
        }, function (errMsg) {
          self.showCartError(errMsg);
        });
      } else { // 取消全选
        _cart.unselectAllProduct(function (res) {
          self.renderCart(res);
        }, function (errMsg) {
          self.showCartError(errMsg);
        });
      }
    });
    // 商品数量变化
    $(document).on('click', '.count-btn', function () {
      var $pCount = $(this).siblings('.count-input');
      var type = $(this).hasClass('plus') ? 'plus' : 'minus';
      var productId = $(this).parents('.cart-table').data('product-id');
      var currCount = parseInt($pCount.val());
      var minCount = 1;
      var maxCount = parseInt($pCount.data('max'));
      var newCount = 0;
      if (type === 'plus') {
        if (currCount >= maxCount) {
          _mall.errorTips('该商品数量达到上限');
          return;
        }
        newCount = currCount + 1;
      } else if (type === 'minus') {
        if (currCount <= minCount) {
          return;
        }
        newCount = currCount - 1;
      }
      // 更新购物车商品数量
      _cart.updateProduct({
        productId: productId,
        count: newCount
      }, function (res) {
        self.renderCart(res);
      }, function (errMsg) {
        self.showCartError(errMsg);
      });
    });
    // 删除单个商品
    $(document).on('click', '.cart-delete', function () {
      // 切换选中状态
      if (window.confirm('确认要删除该商品？')) {
        var productId = $(this).parents('.cart-table').data('product-id');
        self.deleteCartProduct(productId);
      }
    });
    // 删除选中商品
    $(document).on('click', '.delete-selected', function () {
      // 切换选中状态
      if (window.confirm('确认要删除选中的商品？')) {
        var arrProductIds = [];
        var $selectItem = $('.cart-select:checked');
        // 循环查找选中的商品id
        for (var i = 0, iLength = $selectItem.length; i < iLength; i++) {
          arrProductIds.push($($selectItem[i]).parents('.cart-table').data('product-id'));
        }
        if (arrProductIds.length) {
          self.deleteCartProduct(arrProductIds.join(','));
        } else {
          _mall.errorTips('您还没有选中要删除的商品');
        }
      }
    });
    // 提交购物车
    $(document).on('click', '.btn-submit', function () {
     // 总价大于0，进行提交
      if (self.data.cartInfo && self.data.cartInfo.cartTotalPrice > 0) {
        window.location.href = './order-confirm.html';
      } else {
        _mall.errorTips('请选择商品后再提交');
      }
    });
  },
  loadCart: function () { // 加载购物车信息
    var html = '';
    var self = this;
    // loading
    // $('.page-wrap').html('<div class="loading"></div>')
    // 获取购物车列
    _cart.getCartList(function (res) {
      self.renderCart(res);
    }, function (errMsg) {
      self.showCartError(errMsg);
    });
  },
  renderCart: function (data) { // 渲染购物车
    this.filter(data);
    // 缓存购物车信息
    this.data.cartInfo = data;
    // 生成html
    var cartHtml = _mall.renderHtml(templateIndex, data);
    $('.page-wrap').html(cartHtml);
    // 通知导航购物车更新数量
    nav.loadCartCount();
  },
  deleteCartProduct: function (productIds) { // 删除指定商品，支持批量productId逗号分隔
    var self = this;
    _cart.deleteProduct(productIds, function (res) {
      self.renderCart(res);
    }, function (errMsg) {
      self.showCartError(errMsg);
    })
  },
  filter: function (data) { // 数据处理
    data.notEmpty = !!data.cartProductVoList.length;
  },
  showCartError: function () { // 显示错误信息
    $('.page-wrap').html('<p class="err-tip">出现不明问题，请刷新。</p>');
  }
};
$(function () {
  page.init();
});

