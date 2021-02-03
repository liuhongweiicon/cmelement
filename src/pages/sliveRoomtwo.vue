<template>
    <div class="liveRoom">
        <cm-live-room :constants="params" :request="request"></cm-live-room>
    </div>
</template>

<script>
import constants from './constants2'; // 直播间常量参数
import $http from '../utils/http'; 
export default {
    data() {
        return {
            params: constants,
            request: $http,
        }
    },
    created() {
    }
}
</script>

<style lang="less" scoped>
.liveRoom {
    height: 100%;
    width: 100%;
}
</style>