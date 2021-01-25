<template>
    <div class="liveRoom">
        <!-- <cm-live-room :constants="params" :request="request"></cm-live-room> -->

        <div @click="capHandler">{{!screenCap ? '捕获' : '停止'}}</div>
    </div>
</template>

<script>
import constants from './constants'; // 直播间常量参数
import $http from '../utils/http'; 
export default {
    data() {
        return {
            params: constants,
            request: $http,
            screenCap: null,
        }
    },
    created() {
        
    },

    methods: {
        // 采集屏幕
        capHandler() {
            if (!this.screenCap) {
                this.screenCap = new window.screenCap(this.request, this.params);
                this.screenCap.startCap();

            } else {
                this.screenCap.endCap();
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