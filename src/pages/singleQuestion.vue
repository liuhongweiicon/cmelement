<template>
    <div id="allStem">
            <cm-single-question
                ref="allStem" 
                :userInfo="userInfo" 
                :paperDetails="{questionList: paperDetails.questionList}" 
                :showKnowledgePoint="true" 
                :paperState.sync="paperState" 
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
            const params = {"booktypeCode":"b9a8320392c04661bfcee5117ba53260","knowledgeCodes":["88900001"],"subjectCode":"2","gradeCode":33,"pageNum":1,"pageSize":3};
            const paperInfo = await $http.getEvaluationAnswer(params);
            if (paperInfo.httpCode == '200') {

                
                // paperInfo.result.list.forEach(ele => {
          
                //     ele.stem = ele.baseName;
                //     ele.id = ele.resourceCode;
                //     ele.answer = ele.rightAnswer;
                //     ele.type = ele.questionType;
                //     ele.score = ele.questionScore;
                //     ele.stem = ele.questionStem;
                //     ele.quesOption = ele.questionOption;
                //     ele.quesAnalyze = ele.questionAnalyze;
                //     ele.componentQuestionModels = ele.complexQuestionList;
                //     ele.difficultStar = ele.difficultyCode;
                //     ele.bigTitle = '单选题';
                    
                //     if (ele.questionType > 5) {
                //         ele.componentQuestionModels.forEach(item => {
                //             item.stem = item.baseName;
                //             item.id = item.resourceCode;
                //             item.answer = item.rightAnswer;
                //             item.type = item.questionType;
                //             item.score = item.questionScore;
                //             item.stem = item.questionStem;
                //             item.quesOption = item.questionOption;
                //             item.quesAnalyze = item.questionAnalyze;
                //             item.difficultStar = item.difficultyCode;
                //         })
                //     }
                // });
                paperInfo.result.list[1].userAnswer = "[\"\",\"\"]"
                const ss = {
                    ability: "21",
                    answer: "[{\"answerValue\":\"16\",\"score\":\"2\",\"production\":[]},{\"answerValue\":\"29\",\"score\":\"3\",\"production\":[]}]",
                    answerKeys: "[{\"answerKeys\":[\"16\"],\"productionCodes\":[\"052100010012\",\"053400010007\"],\"score\":2.0},{\"answerKeys\":[\"29\"],\"productionCodes\":[\"052100010012\",\"053400010007\"],\"score\":3.0}]",
                    baseKnowledgeModels: paperInfo.result.list[1].baseKnowledgeModels,
                    bigTitle: "填空题",
                    componentQuestionModels: paperInfo.result.list[1].componentQuestionModels,
                    difficultyCode: 4,
                    enlargeId: "402881c553403dbd015340862a660001",
                    gradeCode: "33",
                    hasAnswer: false,
                    id: "402881605dbaba88015dbad5f05d000d",
                    quesAnalyze: "[{\"analyzeKey\":\"\",\"analyzeValue\":\"①由于前二天都售出的商品有http://iwrong-static.xinguoren.cn/resources_v3/20170807/1502077702436184.png种，因此第一天售出的有http://iwrong-static.xinguoren.cn/resources_v3/20170807/1502077702936776.png种商品第二天未售出；答案为http://iwrong-static.xinguoren.cn/resources_v3/20170807/1502077703071359.png．\\n②第一天售出http://iwrong-static.xinguoren.cn/resources_v3/20170807/1502077703245735.png种，第二天有http://iwrong-static.xinguoren.cn/resources_v3/20170807/150207770362570.png种第一天未售出，三天总商品种数最少时，是第三天中http://iwrong-static.xinguoren.cn/resources_v3/20170807/1502077703933394.png种第二天未售出的，商品都是第一天售出过的，此时商品总数为http://iwrong-static.xinguoren.cn/resources_v3/20170807/1502077704227743.png．\\n分别用http://iwrong-static.xinguoren.cn/resources_v3/20170807/1502077704605785.png表示第一、二、三天售出的商品，如图最少时的情形．故答案为http://iwrong-static.xinguoren.cn/resources_v3/20170807/1502077704780968.png．\\nhttp://iwrong-static.xinguoren.cn/resources_v3/20170807/1502077705018515.png\"}]",
                    quesOption: "",
                    questionAnalyzeType: 0,
                    score: 5,
                    stem: "某网店统计了连续三天售出商品的种类情况：第一天售出19种商品，第二天售出13http://iwrong-static.xinguoren.cn/resources_v3/20170807/1502077702104873.png种商品，第三天售出18种商品；前两天都售出的商品有3种，后两天都售出的商品有4种，则该网店①第一天售出但第二天未售出的商品有________种；②这三天售出的商品最少有________种．",
                  
                    subjectCode: "2",
                    subjectName: "数学",
                    type: "4",
                    userAnswer: "[\"\",\"\"]",
                    videoPath: null,
                }
                const info = {
                    paperName: '全题型试卷',
                    totalScore: '30',
                    questionList: paperInfo.result.list,
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
            
            this.$refs.allStem.answerCardOpen = false;

            this.$refs.allStem.mySwiper.slideTo(0, 500, false);

            
            // const info = {
            //         paperName: '全题型试卷',
            //         totalScore: '30',
            //         questionList: item,
            //     }
            // this.paperDetails = info;
            setTimeout(() => {
                this.paperState = 2;
            }, 1000);
            
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