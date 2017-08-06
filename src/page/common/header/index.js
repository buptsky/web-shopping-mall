require('./index.css');
var _mall = require('util/mall.js');

// 通用页面头部
var header = {
  init: function () {
    this.bindEvent();
    this.onLoad();
  },
  onLoad: function () {
    var keyword = _mall.getUrlParam('keyword');
    // keyword存在，回填输入框
    if (keyword) {
      $('#search-input').val(keyword);
    }
  },
  bindEvent: function () {
    var self = this;
    // 搜索提交
    $('#search-btn').on('click', function () {
      self.searchSubmit();
    });
    // 回车搜索提交
    $('#search-input').on('keyup', function (e) {
      if (e.keyCode === 13) {
        self.searchSubmit();
      }
    });
  },
  // 搜索提交
  searchSubmit: function () {
    var keyword = $.trim($('#search-input').val());
    // 提交时候有keyword跳转
    if (keyword) {
      window.location.href = './list.html?keyword=' + keyword;
    } else { // 返回首页
      _mall.goHome();
    }
  }
};

header.init();