/*
1.合并基础的webpack配置
2.配置样式文件的处理规则，styleLoaders
3.配置webpack的输出
4.配置webpack插件
5.gzip模式下的webpack插件配置
6.webpack-bundle分析 */

'use strict';
const path = require('path');
// node.js的文件路径，用来处理文件当中的路径问题
const webpack = require('webpack');
// 引入webpack模块
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 在webpack中拷贝文件和文件夹
const merge = require('webpack-merge');
// 将基础配置和开发环境配置或者生产环境配置合并在一起的包管理
const baseWebpackConfig = require('./webpack.base.config');
// 引入基本webpack基本配置
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 文件名即使更改，自动打包并且生成响应的文件在index.html里面
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');// 压缩css代码
const miniCssExtractPlugin=require("mini-css-extract-plugin"); // css单独提取打包
//一个用来压缩优化CSS大小的东西
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// 一个用来压缩优化JS大小的东西
const VueLoaderPlugin = require('vue-loader/lib/plugin');


const utils = require('./utils');
const baseconfig = require('../config');//导入基础配置

const HappyPack = require('happypack');
// 多线程构建
const happyThreadPool = HappyPack.ThreadPool({ size: 10 }); // 构造出共享进程池，进程池中包含10个子进程



// 引入生产环境
const webpackConfig = merge(baseWebpackConfig,{
  mode: 'production',
  // 这一部分会单独打包成类库文件，方便浏览器缓存 会生成一个vendor.js代码,包含类库代码
  output: {
    filename: utils.assetsPath('js/[name].[chunkHash:8].js'),
    path: baseconfig.build.assetsRoot,
    chunkFilename: utils.assetsPath('js/[id].[chunkHash].js')
    
  },
  module: {
    rules: [
      {
        test: /\.scss | \.less/, //css预处理器 后缀名.scss
        use: [
          {
            loader: miniCssExtractPlugin.loader,
            options:{
              publicPath: '../'
            }
          },
          'css-loader', //专门处理css文件
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true, //直接使用前面生成的sourceMap，编译的效率会快点
            }
          },
          'sass-loader', //专门处理sass文件，转为css文件，不处理css
          'less-loader', //专门处理less文件，转为css文件，不处理css
        ]
      },
      {
        test: /\.js$/,
        use:['happypack/loader?id=babeljs'],
        include: [
            path.resolve('src'),
        ],
      },
    ]
  },
  optimization: {
    sideEffects: false,
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
    ],
    splitChunks: {
      minChunks: 1,
      chunks: 'all',
      cacheGroups: {
        utilities: {
              minSize: 0,
          }
      }
    },
    runtimeChunk: true // webpack相关代码打包到一个文件中，好处：可以规避新的模块加入的时候，webpack给新的模块加id后，插入的顺序可能在中间，使后面模块id变化，会导致打包出的hash产生变化，这样hash就不能进行常缓存
  },
  plugins: [
    new miniCssExtractPlugin({filename: 'css/main.[contentHash:8].css'}),
    new VueLoaderPlugin(),
    //HTMLPlugin：添加HTML入口，可以设置基础参数
    new HtmlWebpackPlugin({
      template: path.join(__dirname,'../index.html'),
      inject: true,
      minify: {//压缩
        removeComments: true,//删除注释
        collapseWhitespace: true,//删除空格
        removeAttributeQuotes: true//删除属性的引号
      },
  
      chunksSortMode: 'dependency'//模块排序，按照我们需要的顺序排序
    }),
    
    new HappyPack({
      id: 'babeljs',
      loaders: ['babel-loader?cacheDirectory=true'],
      threadPool: happyThreadPool, // 使用共享进程池中的子进程去处理任务
      verbose: true,
      debug: true
    }),

    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: path.join(__dirname, '../dist/static'),
        ignore: ['.*']
      },
    ]),
  ]
});
if (baseconfig.build.productionGzip) {
  var CompressionPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionPlugin()
  )
}
module.exports = webpackConfig;