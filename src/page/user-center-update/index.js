require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide = require('page/common/nav-side/index.js');
var templateIndex = require('./index.string');

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
      name: 'user-center'
    });
    // 加载用户信息
    this.loadUserInfo();
  },
  bindEvent: function () {
    var self = this;
    $(document).on('click', '.btn-submit', function () {
      var userInfo = {
        phone: $.trim($('#phone').val()),
        email: $.trim($('#email').val()),
        question: $.trim($('#question').val()),
        answer: $.trim($('#answer').val())
      };
      var validateResult = self.formValidate(userInfo);
      if (validateResult.status) {
        // 更新用户信息
        _user.updateUserInfo(userInfo, function (res, msg) {
          _mall.successTips(msg);
          window.location.href = './user-center.html';
        }, function (errMsg) {
          _mall.errorTips(errMsg)
        });
      } else {
        _mall.errorTips(validateResult.msg)
      }
    });
  },
  loadUserInfo: function () {
    var userHtml = '';
    _user.getUserInfo(function (res) {
      userHtml = _mall.renderHtml(templateIndex, res);
      $('.panel-body').html(userHtml);
    }, function (errMsg) {
      _mall.errorTips(errMsg);
    })
  },
  formValidate: function (formData) { // 表单字段验证
    var result = {
      status: false,
      msg: ''
    }
    // 手机号
    if (!_mall.validate(formData.phone, 'phone')) {
      result.msg = '手机号不符合要求';
      return result;
    }
    // 邮箱
    if (!_mall.validate(formData.email, 'email')) {
      result.msg = '邮箱格式有误';
      return result;
    }
    // 密码提示问题
    if (!_mall.validate(formData.question, 'require')) {
      result.msg = '密码提示问题为空';
      return result;
    }
    // 提示问题答案
    if (!_mall.validate(formData.answer, 'require')) {
      result.msg = '提示问题答案为空';
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
