<template>
  <div
    class="allStem"
    :class="{ paper: paperState == 1, preview: paperState != 1 }"
  >
    <div
      class="swiper-container small answerpaperList"
      style="touch-action: none;"
      v-if="paperDetails.bigQuestions"
    >
      <div class="swiper-wrapper">
        <template v-for="(item, inx) in paperDetails.bigQuestions">
          <div
            class="swiper-slide"
            v-for="(item2, index2) in item.smallQuestions"
            :key="index2"
          >
            <div class="swiper-slideAnswer">
              <div class="big-name" v-if="!index2 || paperState == 1">
                {{ ArabelToCN(inx + 1) }}、{{ item.bigTitle }}（共{{
                  item.smallQuestions.length
                }}题；共{{ item.bigScore }}分）
              </div>
              <div
                :key="index2"
                class="swiper-slide_content"
                :class="item.type != 6 ? 'slide_content_slide' : ''"
              >
                <base-type-stem
                  v-if="item.bigType != 6"
                  @onceChoice="onceChoice"
                  :questionDetails="paperDataHandler(item2)"
                  :paperState="paperState"
                  :orderNum="index2 + 1"
                ></base-type-stem>

                <compound-type-stem
                  @getnowIndex="getnowIndex"
                  @beginGestalt="beginGestalt"
                  v-if="item.bigType == 6"
                  @twoChoice="twoChoice"
                  :compoundDetails="paperDataHandler(item2)"
                  :paperState="paperState"
                  :orderNum="index2 + 1"
                >
                </compound-type-stem>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import baseTypeStem from "./baseTypeStem"; // 基础题型组件
import compoundTypeStem from "./compoundTypeStem"; // 复合题型组件
import tipsPage from "../tipsPage/index"; // 暂无数据提示页面
import answerSheet from "../answerPanel/index"; // 作答面板
export default {
  name: "cm-all-stem",
  components: {
    baseTypeStem,
    compoundTypeStem,
    tipsPage,
    answerSheet,
  },
  props: {
    // 试卷状态，0 预览  1 做答中 2 作答完成
    paperState: {
      type: Number | String,
      default: 0,
    },
    // 试题信息
    paperDetails: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },
  watch: {
    /**
     * 监听试卷作答状态, 作答状态时设置sweiper对象
     */
    paperState(val) {
      if (val == 1 && !this.mySwiper) {
        // 设置sweiper对象
        this.setSweiper();
      } else if (val != 1 && this.mySwiper) {
        this.mySwiper.destroy(); //销毁Swiper对象。
        this.mySwiper = null;
      }
    },

    /**
     * 监听试卷信息变化, 处理试卷提交数据
     */
    paperDetails: {
      handler(val) {
        if (val.bigQuestions && !this.submitCon.paperId) {
          this.setsubmitCon(val);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      mySwiper: null, // swiper对象

      submitCon: {
        //提交内容
        appKey: "",
        gradeCode: "", //学年
        paperId: "", //试卷code ,
        paperName: "", //试卷name
        paperScore: 21, //试卷分数
        subjectCode: "3", //学科code
        userId: null, //用户id
        userName: null, //用户name
        mobile: "", //用户手机号
        questionList: [], //试题作答数组
        useTime: 0, //答题总时间
      },

      nextTime: null, // 离开作答题时间
      nowTime: null, // 进入作答题时间
      nowquesIndex: 1, // 当前题目下标
    };
  },
  created() {},
  mounted() {
    // 设置sweiper对象
    this.setSweiper();
  },
  methods: {
    // 设置sweiper对象
    setSweiper() {
      const _this = this;
      if (this.paperState == 1) {
        setTimeout(() => {
          this.mySwiper = new Swiper(".answerpaperList", {
            loop: false,
            observer: true, //修改swiper自己或子元素时，自动初始化swiper
            observeParents: true, //修改swiper的父元素时，自动初始化swiper
            onSlideChangeEnd: function(swiper) {
              let index = _this.nowquesIndex - 1;
              _this.nextTime = new Date().getTime();
              if (_this.submitCon.questionList[index].isComplexQuestion == 0) {
                _this.submitCon.questionList[
                  index
                ].answerQuestionsTime += parseInt(
                  (_this.nextTime - _this.nowTime) / 1000
                );
              }

              _this.nowTime = new Date().getTime();

              _this.nowquesIndex = swiper.activeIndex + 1;
              _this.$emit('slideChangeEnd', swiper)
            },
          });
        }, 500);
      }
    },

    /**
     * 基础题型,作答答案处理
     */
    onceChoice(item, question) {
      // this.paperDetails.bigQuestions.smallQuestions[nowquesIndex - 1].
      // debugger
      item.userAnswer = this.updataSetsubmitCon(item, question);
      // 更新提交内容值
      for (let i = 0; i < this.submitCon.questionList.length; i++) {
        let nowSubmitCon = this.submitCon.questionList[i];
        if (nowSubmitCon.questionCode == item.id) {
          this.submitCon.questionList[i].userAnswer = this.updataSetsubmitCon(item, question);
        };
      }
    },

    /**
     * 复合题型答案处理
     */
    twoChoice(item, question, index) {
      // 更新提交内容值
      for (let i = 0; i < this.submitCon.questionList.length; i++) {
        let nowSubmitCon = this.submitCon.questionList[i];
        if (nowSubmitCon.complexQuestionCode == item.id) {
          this.submitCon.questionList[i].userAnswer = this.updataSetsubmitCon(item, question);
        }
      }
    },

    /**
     * 更新提交作答内容信息
     */
    updataSetsubmitCon(item, question) {
      if (item.type == 1) {
        //单选
        return question.optionKey;
      } else if (item.type == 2) {
        //多选
        let answerArr = item.userAnswer;
        //第一次添加
        if (answerArr == null || answerArr == "") {
          answerArr = [];
          if (question.active == true) {
            answerArr.push(question.optionKey);
          }
        } else {
          answerArr = answerArr.split("");
          if (question.active == true) {
            answerArr.push(question.optionKey);
          } else {
            for (let c = 0; c < answerArr.length; c++) {
              if (answerArr[c] == question.optionKey) {
                answerArr.splice(c, 1);
              }
            }
          }
        }
        return answerArr.join("");
      } else if (item.type == 4) {
        //填空
        let blanks = [];
        for (let d = 0; d < question.length; d++) {
          blanks.push(question[d].userValue);
        }
        return JSON.stringify(blanks);
      } else if (item.type == 3) {
        //判断
        return question;
      }else if (item.smallType == 5) {
        //主观
        return question;
      }
    },

    /**
     * 复合题中点击下方小题获取答题时间
     */
    getnowIndex(item) {
      this.nextTime = new Date().getTime();
      for (let i = 0; i < this.submitCon.questionList.length; i++) {
        if (item.componentId == this.submitCon.questionList[i].questionCode) {
          this.submitCon.questionList[i].answerQuestionsTime += parseInt(
            (this.nextTime - this.nowTime) / 1000
          );
        }
      }
      this.nowTime = new Date().getTime();
    },

    /**
     * 复合题中点击获取试题取阅读题干时间
     */
    beginGestalt(componentQuestion) {
      //复合题中阅读题干时间
      this.nextTime = new Date().getTime();
      for (let e = 0; e < this.submitCon.questionList.length; e++) {
        for (let j = 0; j < componentQuestion.length; j++) {
          if (
            componentQuestion[j].componentId ==
            this.submitCon.questionList[e].questionCode
          ) {
            this.submitCon.questionList[e].readingQuestionsTime = parseInt(
              (this.nextTime - this.nowTime) / 1000
            );
          }
        }
      }
      this.nowTime = new Date().getTime();
    },

    /**
     * 预处理提交内容
     */
    setsubmitCon(data) {
      const _this = this;
      //学年
      _this.submitCon.gradeCode = data.gradecode;
      //试卷code
      _this.submitCon.paperId = data.paperId;
      //试卷name
      _this.submitCon.paperName = data.paperName;
      //试卷分数
      _this.submitCon.paperScore = data.totalScore;
      //学科code
      _this.submitCon.subjectCode = data.subjectCode;

      for (let i = 0; i < data.bigQuestions.length; i++) {
        for (let j = 0; j < data.bigQuestions[i].smallQuestions.length; j++) {
          let nowSmallQuestion = data.bigQuestions[i].smallQuestions[j];
          //复合题
          if (nowSmallQuestion.smallType == "6") {
            for (
              let y = 0;
              y < nowSmallQuestion.componentQuestionModels.length;
              y++
            ) {
              let obj = {
                answerQuestionsTime: 0, //答题时间
                complexQuestionCode: "", //所属复合题code ,
                isComplexQuestion: 0, //是否是复合题
                questionCode: "", //试题code
                questionScore: 0, //试题分值
                questionSn: 0, //试题题号
                questionType: "", //试题类型
                readingQuestionsTime: 0, //阅读题干时间
                rightAnswer: null, //正确答案
                userAnswer: "", //用户答案
              };
              obj.isComplexQuestion = "1";
              let nowComponentQuestion =
                nowSmallQuestion.componentQuestionModels[y];
              obj.complexQuestionCode = nowComponentQuestion.id;
              obj.questionType = nowComponentQuestion.type;
              obj.questionCode = nowSmallQuestion.id;
              obj.questionScore = nowComponentQuestion.score;
              obj.questionSn = nowComponentQuestion.questionNo;
              obj.rightAnswer = nowComponentQuestion.answer;

              if (nowComponentQuestion.type == "4") {
                let componentAnswer = JSON.parse(
                  nowComponentQuestion.answerKeys
                );
                for (let g = 0; g < componentAnswer.length; g++) {
                  componentAnswer[g].answerValue = "";
                }
                let blankArrr = [];
                componentAnswer.forEach((val) => {
                  blankArrr.push(val.answerValue);
                });
                // obj.userAnswer = JSON.stringify(componentAnswer);
                obj.userAnswer = JSON.stringify(blankArrr);
              } else {
                obj.userAnswer = "";
              }
              _this.submitCon.questionList.push(obj);
            }
          } else {
            //非复合题
            let obj = {
              answerQuestionsTime: 0, //答题时间
              isComplexQuestion: 0, //是否是复合题
              questionCode: "", //试题code
              questionScore: 0, //试题分值
              questionSn: 0, //试题题号
              questionType: "", //试题类型
              readingQuestionsTime: 0, //阅读题干时间
              rightAnswer: null, //正确答案
              userAnswer: "", //用户答案
            };
            obj.isComplexQuestion = "0";
            obj.questionType = nowSmallQuestion.smallType;
            obj.questionCode = nowSmallQuestion.id;
            obj.questionScore = nowSmallQuestion.score;
            obj.questionSn = nowSmallQuestion.questionNo;
            obj.rightAnswer = nowSmallQuestion.answer;

            if (nowSmallQuestion.smallType == "4") {
              //
              if (nowSmallQuestion.answerKeys != null) {
                let smallAnswer = JSON.parse(nowSmallQuestion.answerKeys);
                for (let f = 0; f < smallAnswer.length; f++) {
                  smallAnswer[f].answerValue = "";
                }
                let blankArr = [];
                smallAnswer.forEach((val) => {
                  blankArr.push(val.answerValue);
                });
                // obj.userAnswer = JSON.stringify(smallAnswer);
                obj.userAnswer = JSON.stringify(blankArr);
              }
            } else {
              obj.userAnswer = "";
            }
            _this.submitCon.questionList.push(obj);
          }
        }
      }
    },

    
    /**
     * 答题卡做题情况
     */
    getAnswerSituation() {
      var _this = this;
      for (var i = 0; i < _this.paperDetails.bigQuestions.length; i++) {
        for (
          var j = 0;
          j < _this.paperDetails.bigQuestions[i].smallQuestions.length;
          j++
        ) {
          var nowSmallQuestion = _this.paperDetails.bigQuestions[i].smallQuestions[j];

          if (nowSmallQuestion.smallType != "6") {
            if (nowSmallQuestion.smallType == "4") {
              for (var x = 0; x < _this.submitCon.questionList.length; x++) {
                if (
                  nowSmallQuestion.id ==
                  _this.submitCon.questionList[x].questionCode
                ) {
                  let isFour = _this.submitCon.questionList[x].userAnswer;
                  let t = JSON.parse(isFour).every(val => {
                    //判断填空题是否一道没做
                    return !!val;
                  });

                  if (t == "" || !t) {
                    _this.paperDetails.bigQuestions[i].smallQuestions[
                      j
                    ].hasAnswer = false;
                  } else {
                    var fourAnswer = true;
                    for (
                      var b = 0;
                      b <
                      JSON.parse(_this.submitCon.questionList[x].userAnswer)
                        .length;
                      b++
                    ) {
                      if (
                        JSON.parse(_this.submitCon.questionList[x].userAnswer)[
                          b
                        ].answerValue == ""
                      ) {
                        fourAnswer = false;
                      }
                    }
                    _this.paperDetails.bigQuestions[i].smallQuestions[
                      j
                    ].hasAnswer = fourAnswer;
                  }
                }
              }
            } else {
              for (var x = 0; x < _this.submitCon.questionList.length; x++) {
                if (
                  nowSmallQuestion.id ==
                  _this.submitCon.questionList[x].questionCode
                ) {
                  if (_this.submitCon.questionList[x].userAnswer != "") {
                    _this.paperDetails.bigQuestions[i].smallQuestions[
                      j
                    ].hasAnswer = true;
                  } else {
                    _this.paperDetails.bigQuestions[i].smallQuestions[
                      j
                    ].hasAnswer = false;
                  }
                }
              }
            }
          } else {
            for (
              var c = 0;
              c < nowSmallQuestion.componentQuestionModels.length;
              c++
            ) {
              if (
                nowSmallQuestion.componentQuestionModels[c].type == "4"
              ) {
                var hasAnswer = true;
                for (var y = 0; y < _this.submitCon.questionList.length; y++) {
                  if (
                    nowSmallQuestion.componentQuestionModels[c].componentId ==
                    _this.submitCon.questionList[y].questionCode
                  ) {
                    let isFour = _this.submitCon.questionList[y].userAnswer;
                    let t = JSON.parse(isFour).some(val => {
                      //判断填空题是否一道没做
                      return !!val;
                    });
                    if (t == "" || !t) {
                      _this.paperDetails.bigQuestions[i].smallQuestions[
                        j
                      ].hasAnswer = false;
                    } else {
                      var fourAnswer = true;
                      for (
                        var b = 0;
                        b <
                        JSON.parse(_this.submitCon.questionList[y].userAnswer)
                          .length;
                        b++
                      ) {
                        if (
                          JSON.parse(
                            _this.submitCon.questionList[y].userAnswer
                          )[b].answerValue == ""
                        ) {
                          fourAnswer = false;
                        }
                      }
                      _this.paperDetails.bigQuestions[i].smallQuestions[
                        j
                      ].hasAnswer = fourAnswer;
                    }
                  }
                }
              } else {
                var hasAnswer = true;
                for (var y = 0; y < _this.submitCon.questionList.length; y++) {
                  if (
                    nowSmallQuestion.componentQuestionModels[c].id ==
                    _this.submitCon.questionList[y].complexQuestionCode
                  ) {
                    if (_this.submitCon.questionList[y].userAnswer == "") {
                      hasAnswer = false;
                    }
                    _this.paperDetails.bigQuestions[i].smallQuestions[
                      j
                    ].hasAnswer = !_this.submitCon.questionList[y].userAnswer ? false : true;
                    // return
                    // debugger
                  }
                }
              }
            }
          }
        }
      }
      return _this.paperDetails;
    },

    /**
     * 获取提交内容
     */
    getSubmitCon() {
      return this.submitCon;
    },
  },
};
</script>

<style lang="scss" scoped>
.allStem {
  .swiper-container {
    .swiper-slide {
      .swiper-slideAnswer {
        .big-name {
          padding: 0.24rem;
        }
      }
    }
  }
}
/*作答试题样式*/
.paper {
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  z-index: 1;
  touch-action: none;
  .swiper-container {
    width: 100%;
    height: 100%;
    .swiper-wrapper {
      width: 100%;
    }
    .swiper-slide {
      touch-action: none !important;
      .swiper-slideAnswer {
        display: flex;
        flex-direction: column;
        height: 100%;
        .swiper-slide_content {
          flex: 1;
          height: 1px;
        }
        .slide_content_slide {
          // overflow-y: auto;
          // -webkit-overflow-scrolling: touch;
          // padding-bottom: .2rem;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        .big-name {
          font-size: .24rem;
          color: #999999;
        }
      }
    }
    .cony {
      padding: 0 0.5rem;
    }
  }
}

/** 预览样式 */
.preview {
  .answerpaperList {
    .swiper-wrapper {
      flex-direction: column;
    }
  }
}

@media screen and (min-width: 1024px) {

  .allStem {
    .swiper-container {
      .swiper-slide {
        .swiper-slideAnswer {
          .big-name {
            padding: 14px;
            font-size: 16px;
            color: #3C3C3C;
            font-weight: bold;
          }
        }
      }
    }

  }
  /*作答试题样式*/
  .paper {

  }
  
  /** 预览样式 */
  .preview {

  }
}
</style>
