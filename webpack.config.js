var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var path = require('path');
// 获取html-webpack-plugin参数的方法
var getHtmlConfig = function (name, title) {
  return {
    template: './src/view/' + name + '.html',
    filename: 'view/' + name +  '.html',
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
    login: './src/page/login/index.js',
    result: './src/page/result/index.js'
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
          loader: 'html-loader'
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
    new HtmlWebpackPlugin(getHtmlConfig('login', '用户登录')),
    new HtmlWebpackPlugin(getHtmlConfig('result', '操作结果'))
  ]
};

module.exports = config;