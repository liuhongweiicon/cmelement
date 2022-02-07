// import Vue from 'vue';
// import Router from 'vue-router';

const VueRouter = require('vue-router');


var router =  new VueRouter({
    // mode: 'history',
    routes: [
      {
         path: '/',
        redirect: '/allSingleStem',
        name: 'allSingleStem'
      },
      
      {
        path: '/allStem',
        name: 'allStem',
        component: () => import('@/pages/allStem.vue'),
        meta: { title: "全题型" }
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/pages/video/video.vue'),
        
        meta: { title: "视频播放" }
      },
      
      {
        path: '/allDoubleStem',
        name: 'allDoubleStem',
        component: () => import('@/pages/allDoubleStem.vue'),
        meta: { title: "全题型" }
      },
      {
        path: '/allSingleStem',
        name: 'allSingleStem',
        component: () => import('@/pages/allSingleStem.vue'),
        meta: { title: "单题组合" }
      },
      {
        path: '/singleQuestion',
        name: 'singleQuestion',
        component: () => import('@/pages/singleQuestion.vue'),
        meta: { title: "单题组合" }
      },
      // 进入直播间等待页面
      {
        path: '/livceRoom',
        component: resolve => require(['../pages/livceRoom.vue'], resolve),
        meta: { title: "进入直播间" }

      },
      // 学生端进入直播间等待页面
      {
        path: '/sliveRoom',
        component: resolve => require(['../pages/sliveRoom.vue'], resolve),
        meta: { title: "进入直播间" }

      },
      // 学生端进入直播间等待页面
      {
        path: '/sliveRoomtwo',
        component: resolve => require(['../pages/sliveRoomtwo.vue'], resolve),
        meta: { title: "进入直播间" }

      }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
      document.title = to.meta.title
    }
  next()
})
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    router.replace(targetPath);
  }
});
export default router ;