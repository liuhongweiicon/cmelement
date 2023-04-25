/*
１.配置webpack编译入口
2.配置webpack输出路径和命名规则
3.配置模块resolve规则
4.配置不同类型模块的处理规则 */

const path = require('path');
// node.js的文件路径，用来处理文件当中的路径问题
const baseconfig = require('../config');
//基础环境变量的配置信息
const utils = require('./utils');
//处理css的工具包
const isDev = process.env.NODE_ENV === 'development';


const miniCssExtractPlugin=require("mini-css-extract-plugin"); // css单独提取打包


function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
// 此函数是用来返回当前目录的平行目录的路径，因为有个'..'

const config = {
    context: path.resolve(__dirname, '../'),
    //基础目录（绝对路径），用于从配置中解析入口点和加载程序 以应用程序为根目录 普通字符串代表子目录 /代表绝对路径根目录
    entry: {
        "babel-polyfill":"babel-polyfill",//用来解决的兼容性
        mian: './src/main.js'
    },
    externals: { // cdn 方式引入vue等插件
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'Vuex': 'Vuex',
        'axios': 'axios',
        // 'element-ui': 'ElementUI',
    },
    // 定义入口文件
    output: {
        path: baseconfig.build.assetsRoot,//路径
        // 打包生成的出口文件所放的位置
        // filename: '[name]_[hash:5].js',
        // 打包生成mian.js文件
        publicPath: process.env.NODE_ENV === 'production' ?
            baseconfig.build.assetsPublicPath : baseconfig.dev.assetsPublicPath
        // 项目上线地址，也就是真正的文件引用路径，如果是production环境，其实这里都是'/'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json', '.xlsx'],
        // 省略扩展名，比方说import index from '../js/index'会默认去找index文件，然后找index.js,index.vue,index.json文件
        alias: {
            '@': resolve('src'),
        }
        // 使用别名  使用上面的resolve函数，意思就是用@代替src的绝对路径
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src')]
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(png|jpe?g|gif)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,// 文件大小小于10000则编译成base64格式代码
                    name: utils.assetsPath('images/[name].[hash:8].[ext]') //指定输出文件的名字
                },
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,// 文件大小小于10000则编译成base64格式代码
                    name: utils.assetsPath('mp4/[name].[hash:8].[ext]')  //指定输出文件的名字
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf|ico)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,// 文件大小小于10000则编译成base64格式代码
                    name: utils.assetsPath('icon/[name].[hash:8].[ext]')
                }
            },
            {
                test: /\.css$/,
                use: [
                    miniCssExtractPlugin.loader,
                    // 'style-loader', //将css以js形式插入HTML中
                    'css-loader', //专门处理css文件
                ]
            },
            {
                test: /\.less$/,
                
                use: [
                    miniCssExtractPlugin.loader,
                    // 'style-loader',
                    'css-loader',
                    'less-loader',

                ]
                // loader: "style-loader!css-loader!less-loader",
            },
            {
                test: /\.scss$/,
                
                use: [
                    miniCssExtractPlugin.loader,
                    // 'style-loader',
                    'css-loader',
                    'sass-loader',

                ]
            },
            {
                test: /\.svg$/,
                loader: "raw-loader",
            },
        ]
    },
};
module.exports = config;