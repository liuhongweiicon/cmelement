
import App from './App.vue';
import './utils/rem';
import '../static/css/reset.css';
import '../static/css/index.scss';
import plugin from './plugin/index';
import router from './router/index';
// import plugin from '../dist/cmelement'

Vue.use(plugin);

window.$vue = new Vue({
    router,
    render: h => h(App),
}).$mount('#app');