<template>
    <div class="cm-live-room">
        <div class="livce-room-enter" v-if="!true">
            正在进入直播间...
        </div>

        <room v-else></room>
    </div>
</template>

<script>
import room from './Room/index'; // 直播间组件
import HTTP from '../js/room/service/index'; // 请求地址

import zegoClient from '../js/room/zego/zegoClient'; // 实时音视频实例
export default {
    props: {

    },
    name: 'cm-live-room',
    components: {
        room,
    },
    data() {
        return {
            $HTTP: null, // 请求库实例
        }
    },
    created() {
        this.$HTTP = new HTTP();

        /**
         * 进入直播间,初始化实时音视频SDK
         */
        this.init();
    },
    mounted() {},
    methods: {

        /**
         * 进入直播间,初始化实时音视频SDK
         */
        async init() {
             await zegoClient.init('live')
        },

    }

}
</script>

<style lang="less" scoped>
.cm-live-room {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>