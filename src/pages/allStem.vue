<template>
    <div id="allStem">
        
        <cm-all-stem ref="allStem" :userInfo="userInfo" :paperDetails="paperDetails" :showKnowledgePoint="true" :paperState.sync="paperState"  @slideChangeEnd="slideChangeEndHnadler" @submit="submitHandler" @goBack="goBackHandler" @start="startHandler"></cm-all-stem>

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
            paperState: 0,
            paperDetails: {}, // 试题信息
            userInfo: {"code":"000000","message":"成功","runTime":null,"userId":"1ec585c1-8748-4d04-9fff-cc32bc20dfca","realname":"","mobile":"15313178813","createDate":1582173196000,"loginDate":1626072007000,"relationType":"1","source":null,"portrait":null,"tutorialCode":null,"tutorialName":null,"inviteCode":"s23l74","referrer":"单楠002","referrerMobile":"13581808901","student":{"userId":"9f9a274e726f408288edd030bad24474","realname":"刘哈哈","sex":1,"provinceId":"110000","cityId":null,"countyId":null,"schoolCode":null,"schoolName":null,"gradeCode":"33","isSingle":0,"artType":"0","createDate":1582173196000,"loginDate":1582173196000,"parentId":"1ec585c1-8748-4d04-9fff-cc32bc20dfca","parentMobile":"15313178813"},"academyId":"001","academyCode":100,"academyName":"新国人书院全国总院","agencyAccount":null,"project":"3","oauth2Relations":[],"assessToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwIiwiYXVkIjoiMWVjNTg1YzEtODc0OC00ZDA0LTlmZmYtY2MzMmJjMjBkZmNhIiwibmJmIjoxNjI2MDc4NTcwLCJwcm9maWxlIjoidGVzdCIsImlzcyI6IjNiODgxZjQ4Nzg2OTRlOGI4MWEwMzk5ZGI3OTRjZjVlIiwiZXhwIjoxNjI2MDg1NzcwLCJpYXQiOjE2MjYwNzg1NzB9.-lN7yIYv5mF7s50WZlArsl_fF-MZKEyK_08pKs6GTvY","nickname":null,"thirdOpenId":"owz0t1dqqCAaCaL7RXgYx23L-sYs","headImgUrl":"http://thirdwx.qlogo.cn/mmopen/Mjzdia7evAzxDEicsnThqmQJXKW3iaaUEsQFoLQXC62SouXTTspiawmeETEhbcgiawUf7pXicYwlBr7rWIvmTZXUACyg/132","sessionKey":null}
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
                // appKey: "string",
                // paperId: "62e8a8303add4555b401ac2c1af9dfcb",
                
                // evaluationRecordCode : "d6c5d6351a284e08b1e02d03165d73b3",

                paperId: "d28a0d1daa684302812fe6404fa0a835",
                // token: "string",
            };
            const paperInfo = await $http.getPaper(params);
            if (paperInfo.code == '000000') {
                
                this.paperDetails = paperInfo;
            }
        },
        
        /**
         * 点击开始作答
         */
        startHandler() {
            this.paperState = 1;;
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