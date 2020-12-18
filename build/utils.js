/*utils是工具的意思，是一个用来处理css的文件*/
'use strict';
const path = require('path');
const baseconfig = require('../config');

// 它会将所有 required 的 *.css 模块抽取到分离的 CSS 文件。 所以你的样式将不会内联到 JS bundle，而是在一个单独的 CSS 文件。如果你的样式文件很大，这样会提速，因为 CSS bundle 和 JS bundle 是平行加载的
// var ExtractTextPlugin = require('extract-text-webpack-plugin')

//导出文件的位置，根据环境判断开发环境和生产环境，为config文件中index.js文件中定义的build.assetsSubDirectory或dev.assetsSubDirectory
exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? baseconfig.build.assetsSubDirectory
    : baseconfig.dev.assetsSubDirectory
//Node.js path 模块提供了一些用于处理文件路径的小工具①
  return path.posix.join(assetsSubDirectory, _path)
}

