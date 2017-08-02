require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide = require('page/common/nav-side/index.js');

var _mall = require('util/mall.js');
var _user = require('service/user-service');

// page逻辑部分
var page = {
  init: function () {
    this.onLoad();
    this.bindEvent();
  },
  onLoad: function () {
    // 初始化左侧菜单
    navSide.init({
      name: 'pass-update'
    });
  },
  bindEvent: function () {
    var self = this;
    $(document).on('click', '.btn-submit', function () {
      var userInfo = {
        password: $.trim($('#password').val()),
        passwordNew: $.trim($('#password-new').val()),
        passwordConfirm: $.trim($('#password-confirm').val())
      };
      var validateResult = self.formValidate(userInfo);
      if (validateResult.status) {
        // 更新用户信息
        _user.updatePassword({
          passwordOld: userInfo.password,
          passwordNew: userInfo.passwordNew
        }, function (res, msg) {
          _mall.successTips(msg);
        }, function (errMsg) {
          _mall.errorTips(errMsg)
        });
      } else {
        _mall.errorTips(validateResult.msg)
      }
    });
  },
  formValidate: function (formData) { // 表单字段验证
    var result = {
      status: false,
      msg: ''
    }
    // 原密码是否为空
    if (!_mall.validate(formData.password, 'require')) {
      result.msg = '密码不能为空';
      return result;
    }
    // 新密码存在及长度
    if (!formData.passwordNew || formData.passwordNew.length < 6) {
      result.msg = '密码长度不能小于6位';
      return result;
    }
    // 两次输入密码一致性
    if (formData.passwordNew !== formData.passwordConfirm) {
      result.msg = '两次密码输入不一致';
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
