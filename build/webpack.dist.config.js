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

const merge = require('webpack-merge');
// 将基础配置和开发环境配置或者生产环境配置合并在一起的包管理

const baseWebpackConfig = require('./webpack.base.config');
// 引入基本webpack基本配置

const miniCssExtractPlugin=require("mini-css-extract-plugin"); // css单独提取打包

// 一个用来压缩优化JS大小的东西
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const os = require('os');
const HappyPack = require('happypack');
// 多线程构建
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length }); // 构造出共享进程池，进程池中包含os.cpus().length个子进程

// 引入生产环境
const webpackConfig = merge(baseWebpackConfig,{
  mode: 'production',
  // 这一部分会单独打包成类库文件，方便浏览器缓存 会生成一个vendor.js代码,包含类库代码
  entry: './src/plugin/index.js',
  output: {
    filename: 'cmelement.js',
    library: 'cmelement', // library指定的就是你使用require时的模块名，这里便是require("vueAjaxUpload")
    libraryTarget: 'umd', //libraryTarget会生成不同umd的代码,可以只是commonjs标准的，也可以是指amd标准的，也可以只是通过script标签引入的。
    umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define。
    
  },
  module: {
    rules: [
      // {
      //   test: /\.scss | \.less/, //css预处理器 后缀名.scss
      //   use: [
      //     {
      //       loader: miniCssExtractPlugin.loader,
      //       options:{
      //         publicPath: '../'
      //       }
      //     },
      //     'css-loader', //专门处理css文件
      //     {
      //       loader: "postcss-loader",
      //       options: {
      //         sourceMap: true, //直接使用前面生成的sourceMap，编译的效率会快点
      //       }
      //     },
      //     'sass-loader', //专门处理sass文件，转为css文件，不处理css
      //     'less-loader', //专门处理less文件，转为css文件，不处理css
      //   ]
      // },
    ]
  },

  plugins: [
    new miniCssExtractPlugin({filename: 'css/main.[contentHash:8].css'}),
    
    new VueLoaderPlugin(),
    
    new HappyPack({
      id: 'babeljs',
      loaders: ['babel-loader?cacheDirectory=true'],
      threadPool: happyThreadPool, // 使用共享进程池中的子进程去处理任务
      verbose: true,
      debug: true
    }),

  ]
});

module.exports = webpackConfig;