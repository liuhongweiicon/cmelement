<template>
    <div class="cm-live-room">

        <zego-live-room v-if="isLogin">
            <page-layout-room v-if="liveRoomParams.classScene == 1"/>
            <large-class-layout-room v-else/>
        </zego-live-room>

        

        <!-- 进入直播间提示 -->
        <div v-else class="cm-live-enter" v-html="enterHtml"></div>
    </div>
</template>

<script>
import PageLayoutRoom from './components/base/page-layout-room.vue';
import LargeClassLayoutRoom from './components/base/largeClass-layout-room';
import ZegoLiveRoom from './components/zego/zego-live-room';

import $HTTP from '../js/room/service/index'; // 请求实例

import defaultParams from '../js/room/utils/constants'; // 直播间默认配置参数
export default {
    /**
     * request => 请求库
     * constants => 直播间配置参数
     */
    props: ['request', 'constants', 'endLiveTime'],
    name: 'cm-live-room',
    components: {
        ZegoLiveRoom,
        PageLayoutRoom,
        LargeClassLayoutRoom
    },
    data() {
        return {
            liveRoomParams: this.constants ? {...defaultParams, ...this.constants} : defaultParams, // 直播间参数
            isLogin: false, // 登陆状态
            enterHtml: '正在进入直播间...', // 等待进入文案
            
            $http: null, // 请求实例

        }
    },
    provide() {
        return {
            thisParent: this
        }
    },
    created() {
        this.$http = new $HTTP(this.request, this.liveRoomParams);
        this.loginRoomBiz()
        // if (window.performance.navigation.type === 0) { // 首次被加载
        //     this.loginRoomBiz()
        // } else { // 刷新进入
        //     this.isLogin = true;
        // }
        
    },
    mounted() {
        // debugger
    },
    methods: {

        /**
         * @desc: 后台业务 - 登录房间
         */
        async loginRoomBiz() {
            const { roomId, userID, userName, role, classScene } = this.liveRoomParams.USER_INFO;
            this.roomId = roomId
            this.userName = userName

            const loginParams = {
                // uid: Number(userID),
                uid: userID,
                room_id: roomId,
                nick_name: userName,
                role: role || 2,
                room_type: classScene || 1
            }
            const login = await this.$http.loginRoom(loginParams);
            if (login.ret.code === 0) {
                this.isLogin = true;
            } else {
                this.enterHtml = login.ret.message;
            }
        },
    }

}
</script>

<style lang="scss" scoped>

@import '../static/css/room/_mixin.scss';


.cm-live-room {
    user-select: none;
    height: 100%;
    width: 100%;
    .cm-live-enter {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}


</style>