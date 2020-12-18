// import { Loading } from 'element-ui'; 
// const elementUI = require('element-ui');

// const Loading = window.ELEMENT.Loading
let needLoadingRequestCount = 0;
let loading;
function startLoading(config) {
    // loading = Loading.service({
    //     target: '.content',
    //     lock: true,
    //     spinner: 'el-icon-loading',
    //     text: config.text || '正在努力加载页面...',
    //     background: 'rgba(255, 255, 255, 0.8)',
    // });

    loading = vant.Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: config.text || '正在努力加载页面...',
      });
}
function endLoading() {
    loading.clear();
}

export function showFullScreenLoading(config) {
    if (needLoadingRequestCount === 0) {
        startLoading(config);
    }
    needLoadingRequestCount++;
}

export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return;
    needLoadingRequestCount--;
    if (needLoadingRequestCount === 0) {
        endLoading();
    }
}
