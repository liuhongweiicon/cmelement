<template>
    <div class="liveRoom">
        <cm-live-room :constants="params" :request="request" :endTime="endTime"></cm-live-room>

        <!-- <div @click="capHandler">{{!screenCap ? '捕获' : '停止'}}</div> -->
    </div>
</template>

<script>
import constants from './constants'; // 直播间常量参数
import $http from '../utils/http'; 
export default {
    data() {
        return {
            params: constants,
            request: window.$axios,
            screenCap: null,
            endTime: { // 延长上课时间配置
                endLiveTime: "1620545128000", // 课程预定截止时间
                spaceTipsTime: 30, // 延长上课时长
            }
        }
    },
    created() {
    },

    methods: {
        // 采集屏幕
        async capHandler() {
            const _this = this;
            if (!this.screenCap) {
                this.screenCap = new window.screenCap(this.request, this.params);
                await this.screenCap.startCap();
                this.screenCap.shareClient.on('screenSharingEnded', () => {
                    _this.screenCap.endCap()
                    _this.screenCap = null;
                });;

            } else {
                this.screenCap.endCap()
                this.screenCap = null;
            }
            
        }
    }
}
</script>

<style lang="less" scoped>
.liveRoom {
    height: 100%;
    width: 100%;
}
</style>