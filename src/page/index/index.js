require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
require('util/slider/index.js');
var templateBanner = require('./index.string');
var _mall = require('util/mall.js');

$(function() {
  // 渲染banner html
  var bannnerHtml = _mall.renderHtml(templateBanner);
  $('.banner-con').html(bannnerHtml);
  // 初始化banner
  var $slider = $('.banner').unslider({
    speed: 500,               //  The speed to animate each slide (in milliseconds)
    delay: 3000,              //  The delay between slide animations (in milliseconds)
    complete: function() {},  //  A function that gets called after every slide animation
    keys: true,               //  Enable keyboard (left, right) arrow shortcuts
    dots: true,               //  Display dot navigation
    fluid: false              //  Support responsive design. May break non-responsive designs
  });
  // 轮播图前进后退
  $('.banner-con .banner-arrow').on('click', function () {
    // 判断方向
    var forword = $(this).hasClass('prev') ? 'prev' : 'next';
    $slider.data('unslider')[forword]();
  });
});
