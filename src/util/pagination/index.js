require('./index.css');
var _mall = require('util/mall.js');
var templatePagination = require('./index.string');

var Pagination = function () {
  var self = this;
  this.defaultOption = {
    container: null,
    pageNum: 1,
    pageRange: 3,
    onSelectPage: null
  }
  // 事件处理
  $(document).on('click', '.pg-item', function () {
    var $this = $(this);
    // 点击不做处理的情况
    if ($this.hasClass('active') || $this.hasClass('disabled')) {
      return;
    }
    typeof self.option.onSelectPage === 'function' ? self.option.onSelectPage($this.data('value')) : null;
  })
}
// 渲染分页组件
Pagination.prototype.render = function (userOption) {
  this.option= $.extend({}, this.defaultOption, userOption);
  // 判断容器是否为合法jquery对象
  if (!(this.option.container instanceof jQuery)) {
    return;
  }
  // 是否只有一页
  if (this.option.pages <= 1) {
    return;
  }
  // 渲染分页内容
  console.log(this.option.container);
  this.option.container.html(this.getPaginationHtml());

};
// 获取分页的html
Pagination.prototype.getPaginationHtml = function () {
  // |上一页| 1 2 =3= 4 |下一页| 3/4
  var html = '';
  var pageArr = [];
  var start = this.option.pageNum - this.option.pageRange > 0 ? this.option.pageNum - this.option.pageRange : 1;
  var end = this.option.pageNum + this.option.pageRange > this.option.pages ? this.option.pages : this.option.pageNum + this.option.pageRange;
  // 上一页按钮的数据
  pageArr.push({
    name: '上一页',
    value: this.option.prePage,
    disabled: !this.option.hasPreviousPage
  });
  // 数字按钮的处理
  for (var i = start; i <= end; i++) {
    pageArr.push({
      name: i,
      value: i,
      active: (i === this.option.pageNum)
    });
  }
  // 下一页按钮的数据
  pageArr.push({
    name: '下一页',
    value: this.option.nextPage,
    disabled: !this.option.hasNextPage
  });
  html = _mall.renderHtml(templatePagination, {
    pageArray: pageArr,
    pageNum: this.option.pageNum,
    pages: this.option.pages
  });
  console.log(html);
  return html;
};

module.exports = Pagination;