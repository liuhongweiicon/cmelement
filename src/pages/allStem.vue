<template>
    <div id="allStem">
        
        <cm-all-stem ref="allStem" :paperDetails="paperDetails" :paperState="1" timeHtml="0分0秒" @slideChangeEnd="slideChangeEndHnadler" @submit="submitHandler" @goBack="goBackHandler"></cm-all-stem>

        <!-- <div @click="getAnswer">作答卡</div> -->

        <!-- <cm-answer-card></cm-answer-card> -->
        <!-- <div @click="submit">提交</div> -->

    </div>
</template>

<script>
import $http from '@/servers/index';
export default {
    name: 'allStem',
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
                
                // evaluationRecordCode : "BDBF44BD0A674252AEA5615BD037EFA3",

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
           console.log(this.$refs.allStem.getAnswerSituation());
        },
        /**
         * 提交作答
         */
        submitHandler(item) {
        },

        /**
         * 提交作答
         */
        submit() {
            const jj = this.$refs.allStem.getSubmitCon();
        },
        /**
         * 点击回退
         */
        goBackHandler() {
            
        },
    }
}
</script>

<style lang="less" scoped>
#allStem {
    height: 100%;
}
:root {
  --color1: coral;
}
</style>