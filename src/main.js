
import App from './App.vue';
import './utils/rem';
import '../static/css/reset.css';
import '../static/css/index.scss';
import plugin from './plugin/index';
import router from './router/index';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import  '../static/iconfont/iconfont';
Vue.use(ElementUI);


// Vue.config.errorHandler = function (err, vm, info) {
//     console.error('error---', err)
//     console.info('vm---', vm)
//     console.info('info---', info)
//   }

// import plugin from '../dist/cmelement.js'
Vue.use(plugin);

window.$vue = new Vue({
    router,
    render: h => h(App),
}).$mount('#app');