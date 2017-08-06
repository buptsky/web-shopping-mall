require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var templateIndex = require('./index.string');
var _mall = require('util/mall.js');
var _product = require('service/product-service');
var _cart = require('service/cart-service');

var page = {
  data: {
    productId: _mall.getUrlParam('productId') || '',
  },
  init: function () {
    this.onLoad();
    this.bindEvent();
  },
  onLoad: function () {
    // 没有商品ID返回首页
    if (!this.data.productId) {
      _mall.goHome();
    }
    this.loadDetail();
  },
  bindEvent: function () {
    var self = this;
    // 图片预览
    $(document).on('mouseenter', '.p-img-item', function () {
      var imgUrl = $(this).find('.p-img').attr('src');
      $('.main-img').attr('src', imgUrl);
    });
    // 购物车数量
    $(document).on('click', '.p-count-btn', function () {
      var type = $(this).hasClass('plus') ? 'plus' : 'minus';
      var $pCount = $('.p-count');
      var currCount = parseInt($pCount.val());
      var minCount = 1;
      var maxCount = self.data.detailInfo.stock || 1;
      if (type === 'plus') {
        $pCount.val(currCount < maxCount ? currCount + 1 : maxCount);
      } else if (type === 'minus') {
        $pCount.val(currCount > minCount ? currCount - 1 : minCount);
      }
    });
    // 加入购物车
    $(document).on('click', '.cart-add', function () {
      _cart.addToCart({
        productId: self.data.productId,
        count: $('.p-count').val()
      }, function (res) {
        window.location.href = './result.html?type=cart-add';
      }, function (errMsg) {
        _mall.errorTips(errMsg);
      });
    });
  },
  loadDetail: function () { // 加载商品详情数据
    var html = '';
    var self = this;
    // loading
    $('.page-wrap').html('<div class="loading"></div>')
    // 获取数据
    _product.getProductDetail(this.data.productId, function (res) {
      self.filter(res);
      // 缓存数据
      self.data.detailInfo = res;
      html = _mall.renderHtml(templateIndex, res);
      $('.page-wrap').html(html);
    }, function (errMsg) {
      $('.page-wrap').html('<p class="err-tip">找不到此商品</p>');
    });
  },
  filter: function (data) { // 数据处理
    data.subImages = data.subImages.split(',');
  }
};
$(function () {
  page.init();
});
