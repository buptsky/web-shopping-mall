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
    // 验证用户名存在性
    $('#username').on('blur', function () {
      var username = $.trim($(this).val());
      if (!username) {
        return;
      }
      // 异步验证用户名是否存在
      _user.checkUsername(username, function (res) {
        formError.hide();
      }, function (errMsg) {
        formError.show(errMsg);
      })
    });
    // 注册按钮点击
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
      password: $.trim($('#password').val()),
      passwordConfirm: $.trim($('#password-confirm').val()),
      phone: $.trim($('#phone').val()),
      email: $.trim($('#email').val()),
      question: $.trim($('#question').val()),
      answer: $.trim($('#answer').val())
    };
    // 表单验证结果
    var validateResult = this.formValidate(formData);
    if (validateResult.status) {
      // 提交
      _user.register(formData, function(res){
        window.location.href = './result.html?type=register';
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
    // 用户名是否为空
    if (!_mall.validate(formData.username, 'require')) {
      result.msg = '用户名不能为空';
      return result;
    }
    // 密码是否为空
    if (!_mall.validate(formData.password, 'require')) {
      result.msg = '密码不能为空';
      return result;
    }
    // 密码长度
    if (formData.password.length < 6) {
      result.msg = '密码长度不能小于6位';
      return result;
    }
    // 两次输入密码一致性
    if (formData.password !== formData.passwordConfirm) {
      result.msg = '两次密码输入不一致';
      return result;
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