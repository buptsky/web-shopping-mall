var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var path = require('path');
// 获取html-webpack-plugin参数的方法
var getHtmlConfig = function (name, title) {
  return {
    template: './src/view/' + name + '.html',
    filename: 'view/' + name +  '.html',
    favicon: './favicon.ico',
    title: title,
    inject: true,
    hash: true,
    chunks: ['common', name]
  };
};

var config = {
  entry: {
    common: './src/page/common/index.js',
    index: './src/page/index/index.js',
    list: './src/page/list/index.js',
    detail: './src/page/detail/index.js',
    cart: './src/page/cart/index.js',
    payment: './src/page/payment/index.js',
    'order-confirm': './src/page/order-confirm/index.js',
    'order-list': './src/page/order-list/index.js',
    'order-detail': './src/page/order-detail/index.js',
    'user-login': './src/page/user-login/index.js',
    'user-register': './src/page/user-register/index.js',
    'user-pass-reset': './src/page/user-pass-reset/index.js',
    'user-center': './src/page/user-center/index.js',
    'user-center-update': './src/page/user-center-update/index.js',
    'user-pass-update': './src/page/user-pass-update/index.js',
    result: './src/page/result/index.js',
    about: './src/page/about/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    filename: 'js/[name].js'
  },
  externals: {
    jquery: 'jQuery'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,
        use: {
            loader: 'url-loader',
            options: {
              limit: 100,
              name: 'resource/[name].[ext]'
            }
          }
      },
      {
        test: /\.string$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: true,
            removeAttributeQuotes: false
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      util: __dirname + '/src/util',
      page: __dirname + '/src/page',
      service: __dirname + '/src/service',
      image: __dirname + '/src/image',
      node_modules: __dirname + '/node_modules'
    }
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'js/base.js'
    }),
    new ExtractTextPlugin("css/[name].css"),
    new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
    new HtmlWebpackPlugin(getHtmlConfig('list', '商品列表页')),
    new HtmlWebpackPlugin(getHtmlConfig('detail', '商品详情页')),
    new HtmlWebpackPlugin(getHtmlConfig('cart', '购物车')),
    new HtmlWebpackPlugin(getHtmlConfig('order-confirm', '订单确认页')),
    new HtmlWebpackPlugin(getHtmlConfig('order-list', '订单列表页')),
    new HtmlWebpackPlugin(getHtmlConfig('order-detail', '订单详情')),
    new HtmlWebpackPlugin(getHtmlConfig('payment', '用户支付')),
    new HtmlWebpackPlugin(getHtmlConfig('user-login', '用户登录')),
    new HtmlWebpackPlugin(getHtmlConfig('user-register', '用户注册')),
    new HtmlWebpackPlugin(getHtmlConfig('result', '操作结果')),
    new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset', '找回密码')),
    new HtmlWebpackPlugin(getHtmlConfig('user-center', '个人中心')),
    new HtmlWebpackPlugin(getHtmlConfig('user-center-update', '修改个人信息')),
    new HtmlWebpackPlugin(getHtmlConfig('user-pass-update', '修改密码')),
    new HtmlWebpackPlugin(getHtmlConfig('about', '关于MMALL'))
  ]
};

module.exports = config;