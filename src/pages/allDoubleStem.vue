<template>
    <div id="allStem">
        
            <all-double-stem class="testPaperDetails-paperquestion"
                       :questionData="questionList[4]"
                       :curAnswerNum="0"
                       :totalNum="questionList.length"
                       :showBlock="''"
                       :paperState="paperState"
                       :showKnowledgePoint="false"></all-double-stem>

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
            paperState: 1,
            paperDetails: {}, // 试题信息
            questionList: [],
            
            userInfo: {"code":"000000","message":"成功","runTime":null,"userId":"1ec585c1-8748-4d04-9fff-cc32bc20dfca","realname":"","mobile":"15313178813","createDate":1582173196000,"loginDate":1626072007000,"relationType":"1","source":null,"portrait":null,"tutorialCode":null,"tutorialName":null,"inviteCode":"s23l74","referrer":"单楠002","referrerMobile":"13581808901","student":{"userId":"9f9a274e726f408288edd030bad24474","realname":"刘哈哈","sex":1,"provinceId":"110000","cityId":null,"countyId":null,"schoolCode":null,"schoolName":null,"gradeCode":"33","isSingle":0,"artType":"0","createDate":1582173196000,"loginDate":1582173196000,"parentId":"1ec585c1-8748-4d04-9fff-cc32bc20dfca","parentMobile":"15313178813"},"academyId":"001","academyCode":100,"academyName":"新国人书院全国总院","agencyAccount":null,"project":"3","oauth2Relations":[],"assessToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwIiwiYXVkIjoiMWVjNTg1YzEtODc0OC00ZDA0LTlmZmYtY2MzMmJjMjBkZmNhIiwibmJmIjoxNjI2MDc4NTcwLCJwcm9maWxlIjoidGVzdCIsImlzcyI6IjNiODgxZjQ4Nzg2OTRlOGI4MWEwMzk5ZGI3OTRjZjVlIiwiZXhwIjoxNjI2MDg1NzcwLCJpYXQiOjE2MjYwNzg1NzB9.-lN7yIYv5mF7s50WZlArsl_fF-MZKEyK_08pKs6GTvY","nickname":null,"thirdOpenId":"owz0t1dqqCAaCaL7RXgYx23L-sYs","headImgUrl":"http://thirdwx.qlogo.cn/mmopen/Mjzdia7evAzxDEicsnThqmQJXKW3iaaUEsQFoLQXC62SouXTTspiawmeETEhbcgiawUf7pXicYwlBr7rWIvmTZXUACyg/132","sessionKey":null}
        }
    },
    mounted() {
        this.getPaper();
    },
    methods: {
        /**
         * 获取试题
         */
        async getPaper() {
            const params ={
              classCode: 4377,
              studentCode: 19872,
              taskCode: "16c6b509f3e441d7875ea8b8a7442b32",
            };
            const {httpCode, result} = await $http.getPaper(params);
           
            
      if (httpCode === "200") {
        if (result) {
          let question = [];

          let recursion = (res, times) => {
            res.forEach((ele) => {
              ele.id = ele.resourceCode
              ele.answer = ele.rightAnswer
              ele.answerKeys = ele.rightAnswer
              ele.quesOption = ele.questionOption
              ele.stem = ele.questionStem
              ele.quesAnalyze = ele.questionAnalyze
              ele.type = ele.questionType
              ele.userValue = ''
              ele.userAnswer = ele.studentAnswer
              ele.componentQuestionModels = ele.complexQuestionList
              if (!times) {
                question.push(ele);
              }
              if (ele.questionType == 4) {
                // ele.answer = JSON.parse(ele.rightAnswer)
                // ele.answerKeys = JSON.parse(ele.rightAnswer)
                // ele.userValue = JSON.parse(ele.studentAnswer)
              }
              if (ele.questionType > 5) {
                recursion(ele.complexQuestionList, 2)
                let temp = []
                for (let item of ele.complexQuestionList) {
                  temp.push(item.isRight)
                }
                if (temp.some(val => val == 0)) {
                  ele.isRight = 0
                } else {
                  ele.isRight = 1
                }
              }
            });
          }
          recursion(result)

          this.questionList = question;
          console.log('this.questionList', this.questionList);
          this.totalNum = question.length;
        } else {
          this.noQuestion = true;
        }
      } else {
        this.$message.error(message);
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