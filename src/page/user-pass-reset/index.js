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
  data: {
    username: '',
    question: '',
    answer: '',
    token: '',
  },
  init: function () {
    this.onLoad();
    this.bindEvent();
  },
  onLoad: function () {
    this.loadStepUsername();
  },
  bindEvent: function () {
    var self = this;
    // 输入用户名
    $('#submit-username').on('click', function () {
      var username = $.trim($('#username').val());
      if (username) { // 用户名存在
        _user.getQuestion(username, function (res) {
          self.data.username = username;
          self.data.question = res;
          self.loadStepQuestion(); // 进行下一步验证
        }, function (errMsg) {
          formError.show(errMsg);
        });
      } else {
        formError.show('请输入用户名');
      }
    });
    // 输入提示问题答案
    $('#submit-question').on('click', function () {
      var answer = $.trim($('#answer').val());
      if (answer) {
        _user.checkAnswer({
          username: self.data.username,
          question: self.data.question,
          answer: answer
        }, function (res) {
          self.data.answer = answer;
          self.data.token = res;
          self.loadStepPassword(); // 进行下一步验证
        }, function (errMsg) {
          formError.show(errMsg);
        });
      } else {
        formError.show('请输入问题答案');
      }
    });
    // 提交新密码
    $('#submit-password').on('click', function () {
      var password = $.trim($('#password').val());
      if (password && password.length >= 6) {
        _user.resetPassword({
          username: self.data.username,
          forgetToken: self.data.token,
          passwordNew: password
        }, function (res) {
          window.location.href = './result.html?type=pass-reset';
        }, function (errMsg) {
          formError.show(errMsg);
        });
      } else {
        formError.show('请输入不少于6位的新密码');
      }
    });
  },
  loadStepUsername: function () { // 加载输入用户名步骤
    $('.step-username').show();
  },
  loadStepQuestion: function () { // 加载提示问题
    formError.hide();
    $('.step-username').hide().siblings('.step-question').show().find('.question').text(this.data.question);
  },
  loadStepPassword: function () { // 加载重置密码
    formError.hide();
    $('.step-question').hide().siblings('.step-password').show();
  }
};
$(function () {
  page.init();
});
