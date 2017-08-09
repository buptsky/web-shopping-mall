require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide = require('page/common/nav-side/index.js');
var templateIndex = require('./index.string');
var Pagination = require('util/pagination/index.js');

var _mall = require('util/mall.js');
var _order = require('service/order-service');

// page逻辑部分
var page = {
  data: {
    listParam: {
      pageNum: 1,
      pageSize: 10
    }
  },
  init: function () {
    this.onLoad();
  },
  onLoad: function () {
    // 初始化左侧菜单
    navSide.init({
      name: 'order-list'
    });
    this.loadOrderList();
  },
  loadOrderList: function () { // 加载订单列表
    var orderListHtml = '';
    var self = this;
    var $listCon = $('.order-list-con');
    $listCon.html('<div class="loading"></div>')
    _order.getOrderList(self.data.listParam, function (res) {
      orderListHtml = _mall.renderHtml(templateIndex, res);
      $listCon.html(orderListHtml);
      // 加载分页
      self.loadPagination({
        hasPreviousPage: res.hasPreviousPage,
        prePage: res.prePage,
        hasNextPage: res.hasNextPage,
        nextPage: res.nextPage,
        pageNum: res.pageNum,
        pages: res.pages
      });
    }, function (errMsg) {
      $listCon.html('<p class="err-tip">加载订单失败，刷新后重试</p>')
    });
  },
  loadPagination: function (pageInfo) { // 列表分页
    var self = this;
    this.pagination ? '' : (this.pagination = new Pagination());
    this.pagination.render($.extend({}, pageInfo, {
        container: $('.pagination'),
        onSelectPage: function (pageNum) { // 回调
          self.data.listParam.pageNum = pageNum;
          self.loadOrderList();
        }
      }
    ));
  }
};
$(function () {
  page.init();
});
