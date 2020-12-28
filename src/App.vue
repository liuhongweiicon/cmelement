<template>
    <div id="app">
        <cm-all-stem ref="allStem" :paperDetails="paperDetails" :paperState="1" @slideChangeEnd="slideChangeEndHnadler"></cm-all-stem>
        <!-- <div @click="getAnswer">作答卡</div>
        <div @click="submit">提交</div> -->
    </div>
</template>

<script>
import $http from './servers/index';
export default {
    name: 'app',
    data() {
        return {
            paperDetails: {}, // 试题信息
        }
    },
    mounted() {
        this.gerPaper();
    },
    methods: {
        /**
         * 获取试题
         */
        async gerPaper() {
            const params = {
                appKey: "string",
                paperId: "62e8a8303add4555b401ac2c1af9dfcb",

                // paperId: "ff91d49d23504ce7a8c44f33bc159a31",
                token: "string",
            };
            const paperInfo = await $http.getPaper(params);
            if (paperInfo.code == '000000') {
                
                this.paperDetails = paperInfo;
            }
        },
        /**
         * 滑动结束后返回swiper
         */
        slideChangeEndHnadler(item) {
        },
        
        /**
         * 获取作答情况
         */
        getAnswer() {
            this.paperDetails = this.$refs.allStem.getAnswerSituation();
        },
        /**
         * 提交作答
         */
        submit() {
            const jj = this.$refs.allStem.getSubmitCon();
        },
    }
}
</script>

<style lang="less" scoped>

:root {
  --color1: coral;
}
</style>