require('./index.css');
require('page/common/nav-simple/index.js');
var _mall = require('util/mall.js');
var _user = require('service/user-service');
// 表单错误提示
var formError = {
  show: function (errMsg) {
    $('.error-item').show().find('.err-msg').text(errMsg);
  },
  hide: function () {
    $('.error-item').hide().find('.err-msg').text('');
  }
};
// page逻辑部分
var page = {
  init: function () {
    this.bindEvent();
  },
  bindEvent: function () {
    var self = this;
    // 登录按钮点击
    $('#submit').on('click', function () {
      self.submit();
    });
    // 回车提交
    $('.user-content').on('keyup', function (e) {
      if (e.keyCode === 13) {
        self.submit();
      }
    });
  },
  submit: function () { // 提交表单
    var formData = {
      username: $.trim($('#username').val()),
      password: $.trim($('#password').val())
    };
    // 表单验证结果
    var validateResult = this.formValidate(formData);
    if (validateResult.status) {
      // 提交
      _user.login(formData, function(res){
        window.location.href = _mall.getUrlParam('redirect') || './index.html';
      }, function(errMsg){
        formError.show(errMsg);
      });
    } else {
      // 验证失败
      formError.show(validateResult.msg);
    }
  },
  formValidate: function (formData) { // 表单字段验证
    var result = {
      status: false,
      msg: ''
    }
    if (!_mall.validate(formData.username, 'require')) {
      result.msg = '用户名不能为空';
      return result;
    }
    // console.log(_mall.validate(forData.password, 'require'));
    if (!_mall.validate(formData.password, 'require')) {
      result.msg = '密码不能为空';
      return result;
    }
    // 通过验证
    result.status = true;
    result.msg = '验证通过';
    return result;
  }
};
$(function () {
  page.init();
});