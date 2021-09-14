

import './static/css/reset.css';
import './js/swiper/index.css'; // swiper样式
import './js/swiper/swiper'; // swiperJS





import  * as vuePrototype   from './js/index'; // 工具库

import cmAnswerPanel from './answerPanel/index.vue'; // 作答面板组件
import cmBaseTypeStem from './questionStem/baseTypeStem'; // 基础题型组件
import cmCompoundTypeStem from './questionStem/compoundTypeStem'; // 复合题型组件
import cmAllStem from './questionStem/allStem'; // 试卷组件

import allDoubleStem from './questionStem/allDoubleStem'; // 单试题试卷组件
import allSingleStem from './questionStem/allSingleStem.vue'; // 试卷组件
import cmTipspage from './tipsPage/index.vue'; // 无数据提示页
import cmTopicDrt from './topicDrt/index.vue'; // 题干
import cmAnswerCard from './answerCard/index.vue'; // 答题卡

import cmSingleQuestion from './questionStem/singleQuestion.vue'; // 移动端单题试卷作答组件

// import cmLiveRoom from './liveRoom/index.vue'; // 直播间

// import screenCap from './js/room/screencap/index' // 直播间方法

let cmelement = {};



cmelement.install = (Vue, options) => {

    // 注册全局方法
    for (let key in vuePrototype) {
        Vue.prototype[key] = vuePrototype[key];
    }
    window.BUS = new Vue();
    
    // window.screenCap = screenCap;
    window.Message = Vue.prototype.$message;
    Vue.prototype.showToast = function(msg = '', duration = 3000) {
      this.$message.closeAll()
      this.$message({
        dangerouslyUseHTMLString: true,
        message: msg,
        customClass: 'common-toast',
        duration
      })
    }

   
    Vue.component(cmAnswerPanel.name, cmAnswerPanel);
    Vue.component(cmBaseTypeStem.name, cmBaseTypeStem);
    Vue.component(cmCompoundTypeStem.name, cmCompoundTypeStem);
    Vue.component(cmAllStem.name, cmAllStem);
    Vue.component(allSingleStem.name, allSingleStem);
    Vue.component(cmTipspage.name, cmTipspage);
    Vue.component(cmTopicDrt.name, cmTopicDrt);
    Vue.component(cmAnswerCard.name, cmAnswerCard);
    Vue.component(allDoubleStem.name, allDoubleStem);
    Vue.component(cmSingleQuestion.name, cmSingleQuestion);
    // Vue.component(cmLiveRoom.name, cmLiveRoom);
};

export default cmelement;