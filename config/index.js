'use strict';//严格模式
const path = require('path');

module.exports = {
  dev:{
    // 开发环境下面的配置
    assetsSubDirectory: 'static',//子目录，一般存放css,js,image等文件
    assetsPublicPath: '/',//根目录
    proxyTable: {
      '/api': {
        target: 'http://127.0.0.1:3001', // 设置你调用的接口域名和端口号
        changeOrigin: true,     // 跨域
        pathRewrite: {
          '^/api': '/api/'          
        }
      }
    },//可利用该属性解决跨域的问题
    host: '0.0.0.0', // 地址
    // port: 8083, //端口号设置，端口号占用出现问题可在此处修改
    autoOpenBrowser: true,//是否在编译（输入命令行npm run dev）后打开http://localhost:8080/页面，以前配置为true，近些版本改为false，个人偏向习惯自动打开页面
    errorOverlay: true,//浏览器错误提示
    notifyOnErrors: true,//跨平台错误提示
    poll: false, //使用文件系统(file system)获取文件改动的通知devServer.watchOptions
    devtool: 'cheap-module-eval-source-map',//增加调试，该属性为原始源代码（仅限行）不可在生产环境中使用
    cacheBusting: true,//使缓存失效
    cssSourceMap: true //代码压缩后进行调bug定位将非常困难，于是引入sourcemap记录压缩前后的位置信息记录，当产生错误时直接定位到未压缩前的位置，将大大的方便我们调试
  },
  build: {
    // 生产环境下面的配置
    index: path.resolve(__dirname, '../dist/index.html'),//index编译后生成的位置和名字，根据需要改变后缀，比如index.php
    assetsRoot: path.resolve(__dirname, '../dist'),//编译后存放生成环境代码的位置
    assetsSubDirectory: './static',//js,css,images存放文件夹名
    assetsPublicPath: './',//发布的根目录，通常本地打包dist后打开文件会报错，此处修改为./。如果是上线的文件，可根据文件存放位置进行更改路径
    productionSourceMap: false,  //代码压缩后进行调bug定位将非常困难，于是引入sourcemap记录压缩前后的位置信息记录，当产生错误时直接定位到未压缩前的位置，将大大的方便我们调试
    devtool: '#source-map',//①
    //unit的gzip命令用来压缩文件，gzip模式下需要压缩的文件的扩展名有js和css
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report,
    configureWebpack : {  //警告 webpack 的性能提示
      performance: {
          hints:'warning',
          //入口起点的最大体积 整数类型（以字节为单位）
          maxEntrypointSize: 50000000,
          //生成文件的最大体积 整数类型（以字节为单位 300k）
          maxAssetSize: 50000000,
          //只给出 js 文件的性能提示
          assetFilter: function(assetFilename) {
              return assetFilename.endsWith('.js');
          }
      }
    }
  }
}