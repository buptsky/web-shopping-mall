require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var Pagination = require('util/pagination/index.js');
var templateIndex = require('./index.string');

var _mall = require('util/mall.js');
var _product = require('service/product-service');

var page = {
  data: {
    listParam: {
      keyword: _mall.getUrlParam('keyword') || '',
      categoryId: _mall.getUrlParam('categoryId') || '',
      orderBy: _mall.getUrlParam('orderBy') || 'default',
      pageNum: _mall.getUrlParam('pageNum') || 1,
      pageSize: _mall.getUrlParam('pageSize') || 20,
    }
  },
  init: function () {
    this.onLoad();
    this.bindEvent();
  },
  onLoad: function () {
    this.loadList();
  },
  bindEvent: function () {
    var self = this;
    self.data.listParam.pageNum = 1; // 重置页码
    $('.sort-item').on('click', function () {
      // 排序切换
      var $this = $(this);
      if ($this.data('type') === 'default') {
        // 已经是active样式
        if ($this.hasClass('active')) {
          return;
        } else {
          $this.addClass('active').siblings('.sort-item').removeClass('active asc desc');
          self.data.listParam.orderBy = 'default';
        }
      } else if ($this.data('type') === 'price') {
        // 价格排序
        $this.addClass('active').siblings('.sort-item').removeClass('active asc desc');
        // 升序降序处理
        if (!$this.hasClass('asc')) { // 升序
          $this.addClass('asc').removeClass('desc');
          self.data.listParam.orderBy = 'price_asc';
        } else { // 降序
          $this.addClass('desc').removeClass('asc');
          self.data.listParam.orderBy = 'price_desc';
        }
      }
      // 重新加载列表
      self.loadList();
    });
  },
  loadList: function () { // 加载list数据
    var listHtml = '';
    var self = this;
    var listParam = this.data.listParam;
    var listHeight = $('.p-list-con').innerHeight();
    // 防止页面抖动
    if (listHeight) { // 忽略首次加载
      $('.p-list-con').height(listHeight);
    }
    // 载入loading效果
    $('.p-list-con').html('<div class="loading"></div>');
    // 删除列表中不必要的字段
    listParam.categoryId ? (delete listParam.keyword) : (delete listParam.categoryId);
    // 请求接口
    _product.getProductList(listParam, function (res) {
      listHtml = _mall.renderHtml(templateIndex, {
        list: res.list
      });
      $('.p-list-con').html(listHtml);
      self.loadPagination({
        hasPreviousPage: res.hasPreviousPage,
        prePage: res.prePage,
        hasNextPage: res.hasNextPage,
        nextPage: res.nextPage,
        pageNum: res.pageNum,
        pages: res.pages
      });
    }, function (errMsg) {
      _mall.errorTips(errMsg);
    });
  },
  loadPagination: function (pageInfo) { // 列表分页
    var self = this;
    this.pagination ? '' : (this.pagination = new Pagination());
    this.pagination.render($.extend({}, pageInfo, {
        container: $('.pagination'),
        onSelectPage: function (pageNum) { // 回掉
          self.data.listParam.pageNum = pageNum;
          self.loadList();
        }
      }
    ));
  }
};
$(function () {
  page.init();
});
