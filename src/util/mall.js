var Hogan = require('hogan.js');
var conf = {
  serverHost: ''
};
var _mall = {
  request: function (param) { // ajax请求数据
    var self = this;
    $.ajax({
      type: param.method || 'get',
      url: param.url || '',
      dataType: param.type || 'json',
      data: param.data || '',
      success: function (res) {
        if (res.status === 0) { // 请求成功
          typeof param.success === 'function' && param.success(res.data, res.msg);
        } else if (res.status === 10) { // 没有登录状态
          self.doLogin(); // 跳转到登录页
        } else if (res.status === 1) { // 请求数据错误
          typeof param.error === 'function' && param.error(res.msg);
        }
      },
      error: function (err) { // 获取服务器地址
        typeof param.error === 'function' && param.error(err.statusText);
      }
    })
  },
  getServerUrl: function (path) { // 获取url参数
    return conf.serverHost + path;
  },
  getUrlParam:function (name) {
    // happymmall.com/product/list?keyword=xxx&page=1
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var result = window.location.search.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
  },
  renderHtml: function (htmlTemplate, data) { // 渲染html模板
    var template = Hogan.compile(htmlTemplate),
        result = template.render(data);
    return result;
  },
  successTips: function (msg) { // 成功提示
    alert(msg || '操作成功！');
  },
  errorTips: function (msg) { // 错误提示
    alert(msg || '发生错误');
  },
  validate: function (value, type) { // 字段验证，支持非空、手机、邮箱
    var value = $.trim(value);
    if (type === 'require') { // 非空验证
      return !!value;
    }
    if (type === 'phone') { // 手机验证
      return /^1\d{10}$/.test(value);
    }
    if (type === 'email') { // 邮箱格式
      return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value);
    }
  },
  doLogin: function () { // 跳转登录
    window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);
  },
  goHome: function () { // 返回主页
    window.location.href = './nav.html';
  }
};

module.exports = _mall;