/*
１.引入相关插件和配置
2.生成处理各种样式的规则
3.配置开发环境，如热更新、监听端口号，是否自动打开浏览器等都在webpack中的devServer中配置完成
4.寻找可利用的端口和添加显示程序编译运行时的错误信息。*/
var utils = require('./utils.js')
const path = require('path');
//处理css的工具包
const webpack = require('webpack');
// 引入webpack模块
const merge = require('webpack-merge');
// 将基础配置和开发环境配置或者生产环境配置合并在一起的包管理
const baseWebpackConfig = require('./webpack.base.config');
// 引入基本webpack基本配置
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 文件名及时更改，自动打包并且生成响应的文件在index.html里面
const VueLoaderPlugin = require('vue-loader/lib/plugin');
//当前环境的host
const HOST = process.env.HOST;// processs为node的一个全局对象获取当前程序的环境变量，即host
//当前环境的port
const PORT = process.env.PORT && Number(process.env.PORT);
const baseconfig = require('../config');

const HappyPack = require('happypack');
// 多线程构建
const happyThreadPool = HappyPack.ThreadPool({ size: 10 }); // 构造出共享进程池，进程池中包含10个子进程
const devServer = {
  port: PORT || baseconfig.dev.port, //启动监听端口
  disableHostCheck: true,
  host: HOST || baseconfig.dev.host,
  // 如果编译过程中有错误，将错误显示到网页上
  overlay: baseconfig.dev.errorOverlay
    ? { warnings: false, errors: true }
    : false,// warning 和 error 都要显示
  compress: true,// 一切服务都启动用gzip方式进行压缩代码
  hot: true, // 只重新渲染页面当前组件的效果，而不会刷新这个页面，每次渲染时数据依然存在
  //将没有做映射的url路由地址，都映射到index.html中,即当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
  historyApiFallback: {
    rewrites: [
      { from: /.*/, to: path.posix.join(baseconfig.dev.assetsPublicPath, 'index.html') },
    ],
  },
  open: baseconfig.dev.autoOpenBrowser, // 启动webpack-dev-server时，自动打开网页
  proxy: baseconfig.dev.proxyTable,//接口代理
  // 如果你有单独的后端开发服务器API，并且希望在同域名下发送API请求，那么代理某些URL将很有用.简称就是API代理,中间件  需引入 http-proxy-middleware
  quiet: false, // necessary for FriendlyErrorsPlugin
  // 启用quiet后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自的WebPack的错误或警告在控制台不可见。
};

const devWebpackConfig = merge(baseWebpackConfig,{
  mode: 'development',
  devtool:'#cheap-module-eval-source-map', //帮助页面上调试代码
  module: {

    //
    rules: [
      {
        test: /\.js$/,
        use:['happypack/loader?id=babeljs'],
        include: [
            path.resolve('src'),
        ],
      },
    ]
    
    
  },
  devServer:devServer,
  plugins: [
    //启动hot加载的功能的plugin
    new webpack.HotModuleReplacementPlugin(),// 永远不能用在生产模式，模块热更新,修改文件的内容，允许在运行时更新各种模块，而无需进行完全刷新。
    new webpack.NamedModulesPlugin(), // 当进行热更新时，相关文件名会被展示出来
    new webpack.NoEmitOnErrorsPlugin(), // 跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误。
    
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: true,
    }),
    new HappyPack({
        id: 'babeljs',
        loaders: ['babel-loader'],
        threadPool: happyThreadPool, // 使用共享进程池中的子进程去处理任务
        verbose: true,
        debug: true,
    }),
  ],
});

module.exports = devWebpackConfig;