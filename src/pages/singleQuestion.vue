<template>
    <div id="allStem">
        
        <cm-single-question
            ref="allStem" 
            :userInfo="userInfo" 
            :paperDetails="paperDetails" 
            :showKnowledgePoint="true" 
            :paperState.sync="paperState"  
            :showNum="true"
            @slideChangeEnd="slideChangeEndHnadler" 
            @submit="submitHandler" 
            @goBack="goBackHandler">
            <!-- <template v-slot:optionScope="{optionScope:{questionDetailsInfo,index}}">
                
                    <span>============={{questionDetailsInfo}}</span>
                    <span>-----------{{index}}</span>
            </template> -->

            <!-- <template slot="bigName">
                <span>90909</span>
            </template> -->
        </cm-single-question>


    </div>
</template>

<script>
import $http from '@/servers/index';
export default {
    name: 'allStem',
    data() {
        return {
            paperState: 1,
            paperDetails: {}, // 试题信息
            userInfo: {"code":"000000","message":"成功","runTime":null,"userId":"1ec585c1-8748-4d04-9fff-cc32bc20dfca","realname":"","mobile":"15313178813","createDate":1582173196000,"loginDate":1626072007000,"relationType":"1","source":null,"portrait":null,"tutorialCode":null,"tutorialName":null,"inviteCode":"s23l74","referrer":"单楠002","referrerMobile":"13581808901","student":{"userId":"9f9a274e726f408288edd030bad24474","realname":"刘哈哈","sex":1,"provinceId":"110000","cityId":null,"countyId":null,"schoolCode":null,"schoolName":null,"gradeCode":"33","isSingle":0,"artType":"0","createDate":1582173196000,"loginDate":1582173196000,"parentId":"1ec585c1-8748-4d04-9fff-cc32bc20dfca","parentMobile":"15313178813"},"academyId":"001","academyCode":100,"academyName":"新国人书院全国总院","agencyAccount":null,"project":"3","oauth2Relations":[],"assessToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwIiwiYXVkIjoiMWVjNTg1YzEtODc0OC00ZDA0LTlmZmYtY2MzMmJjMjBkZmNhIiwibmJmIjoxNjI2MDc4NTcwLCJwcm9maWxlIjoidGVzdCIsImlzcyI6IjNiODgxZjQ4Nzg2OTRlOGI4MWEwMzk5ZGI3OTRjZjVlIiwiZXhwIjoxNjI2MDg1NzcwLCJpYXQiOjE2MjYwNzg1NzB9.-lN7yIYv5mF7s50WZlArsl_fF-MZKEyK_08pKs6GTvY","nickname":null,"thirdOpenId":"owz0t1dqqCAaCaL7RXgYx23L-sYs","headImgUrl":"http://thirdwx.qlogo.cn/mmopen/Mjzdia7evAzxDEicsnThqmQJXKW3iaaUEsQFoLQXC62SouXTTspiawmeETEhbcgiawUf7pXicYwlBr7rWIvmTZXUACyg/132","sessionKey":null}
        }
    },
    mounted() {
        this.getTaskQuestionsByTaskCode();
    },
    methods: {
        /**
         * 获取试题
         */
        async getTaskQuestionsByTaskCode() {
            const params = {"classCode":4377,"studentCode":19872,"taskCode":"ff579dcd5b1240acbd5e66ec9b4a1d20"};
            const paperInfo = await $http.getTaskQuestionsByTaskCode(params);
            if (paperInfo.httpCode == '200') {

                
                paperInfo.result.forEach(ele => {
          
                    ele.stem = ele.baseName;
                    ele.id = ele.resourceCode;
                    ele.answer = ele.rightAnswer;
                    ele.type = ele.questionType;
                    ele.score = ele.questionScore;
                    ele.stem = ele.questionStem;
                    ele.quesOption = ele.questionOption;
                    ele.quesAnalyze = ele.questionAnalyze;
                    ele.componentQuestionModels = ele.complexQuestionList;
                    ele.difficultStar = ele.difficultyCode;
                    ele.bigTitle = '单选题';
                    
                    // if (ele.type == 4) {
                    //     ele.userAnswer = JSON.parse(ele.studentAnswer);
                    // } else {
                    //     ele.userAnswer = ele.studentAnswer;
                    // }
                    // delete ele.rightAnswer;
                    if (ele.questionType > 5) {
                        ele.componentQuestionModels.forEach(item => {
                            item.stem = item.baseName;
                            item.id = item.resourceCode;
                            item.answer = item.rightAnswer;
                            item.type = item.questionType;
                            item.score = item.questionScore;
                            item.stem = item.questionStem;
                            item.quesOption = item.questionOption;
                            item.quesAnalyze = item.questionAnalyze;
                            item.difficultStar = item.difficultyCode;
                            // if (item.type == 4) {
                            //     item.userAnswer = JSON.parse(item.studentAnswer);
                            // } else {
                            //     item.userAnswer = item.studentAnswer;
                            // }
                            // delete item.rightAnswer;
                        })
                    }
                });
                
                const info = {
                    paperName: '全题型试卷',
                    totalScore: '30',
                    questionList: paperInfo.result,
                }
                this.paperDetails = info;
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