// import axios from 'axios';

const axios = require('axios');


import { LocalStorage, isEmpty, encodeSearchParams } from './index';
import { tryHideFullScreenLoading, showFullScreenLoading } from './pageLoading';

const isDev = process.env.NODE_ENV === 'development' ? true : false;

let URL_PREFIX = 'http://tjservicetest.xinguoren.cn';

let LAN_TIAN_URL = 'http://lantiantest.e-edusky.com/diagnosis/resource'
let LAN_TIAN_URL1 = 'http://lantiantest.e-edusky.com/diagnosis/manager'
let LAN_TIAN_URL2 = 'http://lantiantest.e-edusky.com/diagnosis/manager'

const lantianUrl = URL_PREFIX + '/diagnosis/manager/';
const lantianUrl1 = LAN_TIAN_URL2 ;
const protalUrl = URL_PREFIX + '/diagnosis/protal/';
const submitUrl = URL_PREFIX + '/evaluation/'
const payUrl = URL_PREFIX  + '/pay/'

URL_PREFIX = URL_PREFIX + '/assessment/'

const $ = axios.create({
    baseURL: URL_PREFIX,
    timeout: 15000,
    responseType: 'blob'
});

window.$axios = $;

// 请求拦截器
$.interceptors.request.use((config) => {
    const token = LocalStorage.get('token');
    if (config.showLoading) {
        showFullScreenLoading(config);
    }
    config.headers = {
        // 'Content-Type': 'application/json; charset=utf-8',
        // "user_token": '835f290e70ea419b8851acb4f62fcee4'
    };
    config.params = {
        requestId: Math.random()
    }
    if (token !== '' && token !== undefined && token) {
        config.headers.token = token;
    }
    return config;
}, error => Promise.reject(error));

// 响应拦截器
$.interceptors.response.use(async (response) => {
    if (response.config.showLoading) {
        tryHideFullScreenLoading();
    }

    // 将blob转未json类型并返回，
    if (response.data.type.indexOf('application/json') > -1) {
        const data = await setRespond(response);
        return data;
        
    } else { // 直播间上传文件直接放回blob数据类型
        return response.data;
    }
    
}, (error) => {
    tryHideFullScreenLoading();
    vant.Toast('服务器响应错误');
    return Promise.reject(error);
});

const setRespond = (response) => {
    let data = response.data
    let reader = new FileReader(); // 创建读取文件对象

    return new Promise((resolve, reject) => {
        reader.addEventListener("loadend", function () { // 
            data = JSON.parse(reader.result); // 返回的数据
            if (response.config.url.indexOf('liveroom') > -1) {
                resolve(data)
                return
            }
        
            if (data.httpCode) {
                if (data.httpCode !== '200' && data.httpCode !== '40007') { // 40007 手机号已绑定需要单独处理错误
                    vant.Toast(data.message ? data.message : '请求错误,请重试');
                }
                resolve(data)
                return
            } else {
                if (data.code !== '000000') {
                    vant.Toast(data.message ? data.message : '请求错误,请重试');
                    // return
                }
                resolve(data)
                return
            }
        });
        reader.readAsText(data, 'utf-8'); // 设置读取的数据以及返回的数据类型为utf-8
    });

}


export default {
    request: (interfaceConfig, data, config) => {
        if (config === undefined) {
            config = { showLoading: false };
        }
        /**
         * @todo 异常时需进一步提示
         */
        if (interfaceConfig.method === undefined || interfaceConfig.path === undefined) {
            return;
        }
        if (interfaceConfig.method === 'post') {
            return $.post(interfaceConfig.path, data, config);
        }
        let pathUrl = '';

        if (isEmpty(data)) {
            pathUrl = interfaceConfig.path;
        } else {
            // pathUrl = `${interfaceConfig.path}?${encodeSearchParams(data)}`;
            pathUrl = `${url}?${data}`;
        }
        return $.get(pathUrl, config);
    },
    post: (url, data, config) => {
        if (config === undefined) {
            config = { showLoading: false };
        }
        return $.post(url, data, config);
    },
    get: (url, data = {}, config) => {
        if (config === undefined) {
            config = { showLoading: false };
        }
        let pathUrl = '';
        if (isEmpty(data)) {
            pathUrl = url;
        } else {
            // pathUrl = `${url}?${encodeSearchParams(data)}`;
            pathUrl = `${url}?${data}`;
        }
        return $.get(pathUrl, config);
    },
    protalUrl,
    lantianUrl,
    submitUrl,
    payUrl,
    LAN_TIAN_URL,
    LAN_TIAN_URL1,
    lantianUrl1
};
