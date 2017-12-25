var path = require('path')
var utils = require('./utils')

var projectRoot = path.resolve(__dirname, '../')
const vuxLoader = require('vux-loader')

var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

let webpackConfig = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    chunkFilename: 'chunk[id].js?[chunkhash]',
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'src':  resolve('src'),
      'router': resolve('src/router'),
      'assets': resolve('src/assets'),
      'components': resolve('src/components'),
      'api': resolve('src/Api'),
      'views': resolve('src/views'),
      'configs': resolve('src/configs'),
      'utils': resolve('src/utils'), 
      'base': resolve('src/base'),
      '_vuex': resolve('src/vuex'),
      'mixins': resolve('src/mixins'),
      'libs': resolve('src/libs'),
      'tools': resolve('src/tools'),
      'style': resolve('src/style'),
      'jquery': 'jquery'
    }
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    new webpack.ProvidePlugin({
      jQuery: "jquery",
      $: "jquery"
    })
  ],
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
      options: vueLoaderConfig
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      include: [resolve('src'), resolve('test')]
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: utils.assetsPath('img/[name].[hash:7].[ext]')
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
      }
    }]
  }
}


module.exports = vuxLoader.merge(webpackConfig, {
  plugins: ['vux-ui', 'progress-bar', 'duplicate-style', {
    name: 'after-less-parser',
    fn: function(source) {
      if (this.resourcePath.replace(/\\/g, '/').indexOf('vux/src/components') > -1) {
        source = source.replace(/px/g, 'PX')
      }
      // 自定义的全局样式大部分不需要转换
      // if (this.resourcePath.replace(/\\/g, '/').indexOf('App.vue') > -1) {
      //   source = source.replace(/px/g, 'PX').replace(/-1PX/g, '-1px')
      // }
      return source
    }
  }, {
    name: 'style-parser',
    fn: function(source) {
      if (this.resourcePath.replace(/\\/g, '/').indexOf('vux/src/components') > -1) {
        source = source.replace(/px/g, 'PX')
      }
      // 避免转换1PX.less文件路径
      if (source.indexOf('1PX.less') > -1) {
        source = source.replace(/1PX.less/g, '1px.less')
      }
      return source
    }
  },{
    name: 'less-theme',
    path: 'src/theme.less'
  }]
})
