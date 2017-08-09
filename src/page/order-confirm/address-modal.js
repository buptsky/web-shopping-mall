var templateAddressModal = require('./address-modal.string');
var _mall = require('util/mall.js');
var _address = require('service/address-service.js');
var _cities = require('util/cities/index.js');

var addressModal = {
  show: function (option) {
    this.option = option;
    this.option.data = option.data || {};
    this.$modalWrap = $('.modal-wrap');
    // 渲染页面
    this.loadModal();
    // 绑定事件
    this.bindEvent();
  },
  hide: function () {
    this.$modalWrap.empty();
  },
  loadModal: function () {
    var addressModalHtml = _mall.renderHtml(templateAddressModal, {
      isUpdate: this.option.isUpdate,
      data: this.option.data
    });
    this.$modalWrap.html(addressModalHtml);
    // 加载省份和城市
    this.loadProvince();
  },
  loadProvince: function () {
    var provinces = _cities.getProvinces() || [];
    var $provinceSelect = this.$modalWrap.find('#receiver-province');
    $provinceSelect.html(this.getSelectOption(provinces));
    // 如果更新地址，并且有省份信息，做省份回填
    if (this.option.isUpdate && this.option.data.receiverProvince) {
      $provinceSelect.val(this.option.data.receiverProvince);
      this.loadCities(this.option.data.receiverProvince);
    }
  },
  loadCities: function (provinceName) {
    var cities = _cities.getCities(provinceName) || [];
    var $citySelect = this.$modalWrap.find('#receiver-city');
    $citySelect.html(this.getSelectOption(cities));
    // 如果更新地址，并且有城市信息，做城市回填
    if (this.option.isUpdate && this.option.data.receiverCity) {
      $citySelect.val(this.option.data.receiverCity);
    }
  },
  getSelectOption: function (optionArr) { // 获取选择框option,输入array,输出html
    var html = '<option value="">请选择</option>';
    for (var i = 0, length = optionArr.length; i < length; i++) {
      html += '<option value="'+ optionArr[i]+'">' + optionArr[i] + '</option>';
    }
    return html;
  },
  getReceiverInfo: function () { // 获取表单收件人信息并验证格式
    var receiverInfo = {};
    var result = {
      status: false
    };
    receiverInfo.receiverName = $.trim(this.$modalWrap.find('#receiver-name').val());
    receiverInfo.receiverProvince = this.$modalWrap.find('#receiver-province').val();
    receiverInfo.receiverCity = this.$modalWrap.find('#receiver-city').val();
    receiverInfo.receiverAddress = $.trim(this.$modalWrap.find('#receiver-address').val());
    receiverInfo.receiverPhone = $.trim(this.$modalWrap.find('#receiver-phone').val());
    receiverInfo.receiverZip = $.trim(this.$modalWrap.find('#receiver-zip').val());
    if (this.option.isUpdate) {
      receiverInfo.id = this.$modalWrap.find('#address-id').val();
    }
    // 表单验证
    if (!receiverInfo.receiverName) {
      result.errMsg = '请输入收件人姓名';
    } else if (!receiverInfo.receiverProvince) {
      result.errMsg = '请选择收件人所在省份';
    } else if (!receiverInfo.receiverCity) {
      result.errMsg = '请选择收件人所在城市';
    } else if (!receiverInfo.receiverAddress) {
      result.errMsg = '请输入收件人详细地址';
    } else if (!receiverInfo.receiverPhone) {
      result.errMsg = '请输入收件人手机号';
    } else {
      result.status = true;
      result.data = receiverInfo;
    }
    return result;
  },
  bindEvent: function () {
    var self = this;
    // 省份城市联动
    this.$modalWrap.find('#receiver-province').on('change', function () {
      var selectedProvince = $(this).val();
      self.loadCities(selectedProvince);
    });
    // 提交收货地址
    this.$modalWrap.find('.address-btn').on('click', function () {
      var receiverInfo = self.getReceiverInfo();
      var isUpdate = self.option.isUpdate;
      // 使用新地址且验证通过
      if (!isUpdate && receiverInfo.status) {
        _address.save(receiverInfo.data, function (res) {
          _mall.successTips('地址添加成功');
          self.hide();
          typeof self.option.onSuccess === 'function' && self.option.onSuccess(res);
        }, function (errMsg) {
          _mall.errorTips(errMsg);
        });
      } else if (isUpdate && receiverInfo.status) { // 更新地址且验证通过
        _address.update(receiverInfo.data, function (res) {
          _mall.successTips('地址修改成功');
          self.hide();
          typeof self.option.onSuccess === 'function' && self.option.onSuccess(res);
        }, function (errMsg) {
          _mall.errorTips(errMsg);
        });
      } else { // 验证失败
        _mall.errorTips(receiverInfo.errMsg || '未知错误');
      }
    });
    // 关闭弹窗，点击关闭按钮或蒙版区域
    this.$modalWrap.find('.close').on('click', function () {
      self.hide();
    });
    // 保证点击内容区域不关闭弹窗
    this.$modalWrap.find('.modal-container').on('click', function (e) {
      e.stopPropagation();
    });
  }
};
module.exports = addressModal;



