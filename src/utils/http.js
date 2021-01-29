// import axios from 'axios';

const axios = require('axios');

import { LocalStorage, isEmpty, encodeSearchParams } from './index';
import { tryHideFullScreenLoading, showFullScreenLoading } from './pageLoading';

const isDev = process.env.NODE_ENV === 'development' ? true : false;

let URL_PREFIX = 'http://tjtest.xinguoren.cn';



const lantianUrl = URL_PREFIX + '/diagnosis/manager/';
const protalUrl = URL_PREFIX + '/diagnosis/protal/';
const submitUrl = URL_PREFIX + '/evaluation/'
const payUrl = URL_PREFIX  + '/pay/'

URL_PREFIX = URL_PREFIX + '/assessment/'

const $ = axios.create({
    baseURL: URL_PREFIX,
    timeout: 15000,
});

window.$axios = $;

// 请求拦截器
$.interceptors.request.use((config) => {
    const token = LocalStorage.get('token');
    if (config.showLoading) {
        showFullScreenLoading(config);
    }
    config.headers = {
        'Content-Type': 'application/json',
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
$.interceptors.response.use((response) => {
    if (response.config.showLoading) {
        tryHideFullScreenLoading();
    }
    if (response.config.url.indexOf('liveroom') > -1) {
        return response.data;
    }
    if (response.data.httpCode) {
        if (response.data.httpCode !== '200' && response.data.httpCode !== '40007') { // 40007 手机号已绑定需要单独处理错误
            // Message.error(response.data.message ? response.data.message : '请求错误,请重试');
            vant.Toast(response.data.message ? response.data.message : '请求错误,请重试');
            // return
        }
        return response.data;
    } else {
        if (response.data.code !== '000000') {
            // Message.error(response.data.message ? response.data.message : '请求错误,请重试');
            vant.Toast(response.data.message ? response.data.message : '请求错误,请重试');
            // return
        }
        return response.data;
    }
}, (error) => {
    tryHideFullScreenLoading();
    vant.Toast('服务器响应错误');
    return Promise.reject(error);
});

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
    payUrl
};
