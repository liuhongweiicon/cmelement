<template>
  <div
    class="cm-allStem"
    @click.stop="answerCardOpen = false"
    :class="{ paper: paperState == 1, preview: paperState != 1 }"
  >
    <!-- 作答时head -->
    <slot name="head">
      <!-- PC端头部样式 -->
      <div class="cm-allStem-head">
        <div class="cm-allStem-head-title">{{paperDetails.paperName}}</div>
          <div class="cm-allStem-head-time">
            <i class="iconfont">&#xe618;</i>
            <span>{{timeHtml}}</span>
          </div>
          <div class="cm-allStem-head-card" @click.stop="answerCardHandler">
            {{`展开答题卡(${nowquesIndex}/${totalTopic})`}}
            
            <!-- 答题卡组件 -->
            <answer-card 
              v-if="answerCardOpen" 
              :paperDetails="paperDetails.bigQuestions" 
              @switch="switchHandler"
              @submit="getSubmitCon"></answer-card>
          </div>
      </div>

      <!-- 移动端头部样式 -->
      <div class="cm-allStem-mhead" :class="{'cm-allStem-mheadOpen': answerCardOpen}">
        <div class="allStem-mhead-top">
          
          <div class="head-time-icon" @click="goBack" v-if="!answerCardOpen">
            <i class="iconfont">&#xe605;</i>
          </div>
          <div class="mhead-top-name">{{paperDetails.paperName}}</div>
          <div class="mhead-top-btn" v-if="paperState == 1" @click.stop="answerCardHandler">{{answerCardOpen ? '答题卡[提交]' : '答题卡[返回]'}}</div>
        </div>

        <div class="allStem-mhead-bot">
          <div class="mhead-bot-time">{{`考试时间：${timeHtml}`}}</div>
          <div class="mhead-bot-order">{{paperState == 1 ? `${nowquesIndex}/${totalTopic}` : `总分：${paperDetails.totalScore}分`}}</div>
        </div>
        
          <!-- 答题卡组件 -->
          <answer-card 
            v-if="answerCardOpen" 
            :paperDetails="paperDetails.bigQuestions" 
            @switch="switchHandler"
            @submit="getSubmitCon"></answer-card>
      </div>
    </slot>

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
            :key="item2.smallId"
          >
            <div class="swiper-slideAnswer">
              <div class="big-name" v-if="!index2 || paperState == 1">
                {{ ArabelToCN(inx + 1) }}、{{ item.bigTitle }}（共{{
                  item.smallQuestions.length
                }}题；共{{ item.bigScore }}分）
              </div>
              <div
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

    <!-- 作答时footer -->
    <slot name="footer">
      <div class="cm-allStem-footer">
        <div class="cm-allStem-footer-item" v-if="nowquesIndex - 1" @click="slidePrevHandler">上一题</div>
        <div class="cm-allStem-footer-item"  @click="slideNextHandler">{{isEnd ? '提交' : '下一题'}}</div>
      </div>
    </slot>

  </div>
</template>

<script>
import baseTypeStem from "./baseTypeStem"; // 基础题型组件
import compoundTypeStem from "./compoundTypeStem"; // 复合题型组件
import tipsPage from "../tipsPage/index"; // 暂无数据提示页面
import answerSheet from "../answerPanel/index"; // 作答面板

import answerCard from "../answerCard/index"; // 作答卡组件
export default {
  name: "cm-all-stem",
  components: {
    baseTypeStem,
    compoundTypeStem,
    tipsPage,
    answerSheet,
    answerCard
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
    // 试卷作答或预览倒计时
    timeHtml: {
      type: String,
      default: '0分0秒',
    }
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
      totalTopic: 0, // 题总数

      answerCardOpen: false, //是否打开答题卡， => true 打开
      isEnd: false, // 是否是最后一题， => true 最后一题
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
              _this.isEnd = swiper.isEnd; // 是否是最后一题
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
     * 点击返回
     */
    goBack() {
      this.$emit('goBack');
    },

    /**
     * 基础题型,作答答案处理
     */
    onceChoice(item, question) {
      item.userAnswer = this.updataSetsubmitCon(item, question);
      // 更新提交内容值
      for (let i = 0; i < this.submitCon.questionList.length; i++) {
        let nowSubmitCon = this.submitCon.questionList[i];
        if (nowSubmitCon.questionCode == item.smallId) {
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
        if (nowSubmitCon.questionCode == item.componentId) {
          this.submitCon.questionList[i].userAnswer = this.updataSetsubmitCon(item, question);
        }
      }

      console.log(this.submitCon.questionList);
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
      data.bigQuestions.forEach(item => {
        this.totalTopic += item.smallQuestions.length;
      });
      //学年
      _this.submitCon.gradeCode = data.gradeCode;
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
              let nowComponentQuestion = nowSmallQuestion.componentQuestionModels[y];
              obj.complexQuestionCode = nowComponentQuestion.smallId;
              obj.questionType = nowComponentQuestion.componentType;
              obj.questionCode = nowComponentQuestion.componentId;
              obj.questionScore = nowComponentQuestion.componentScore;
              obj.questionSn = nowComponentQuestion.componentSort;
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
            obj.questionCode = nowSmallQuestion.smallId;
            obj.questionScore = nowSmallQuestion.smallScore;
            obj.questionSn = nowSmallQuestion.smallSort;
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
     * 点击上一题
     */
    slidePrevHandler() {
      this.mySwiper.slidePrev(true, 300);
    },

    /**
     * 点击下一题或提交
     */
    slideNextHandler() {
      this.mySwiper.slideNext(true, 300);
      if (this.isEnd) {
        this.getSubmitCon();
      }
    },
    
    /**
     * 答题卡做题情况
     */
    answerCardHandler() {
      if (this.answerCardOpen) {
        this.answerCardOpen = false;
        return;
      }
      this.paperDetails.bigQuestions.forEach(item => {
          // 记录没道大题下小题的作答题数量
          item.anserNum = 0;
          if (item.bigType != 6) { // 非复合题
              item.smallQuestions.forEach(ele => {
                this.handlerPaper(ele, item);
                if (ele.hasAnswer) {
                  item.anserNum++;
                }
              });
          } else { // 复合题
            item.smallQuestions.forEach(ele => {
              ele.hasAnswer = false;
              let hasAnswer = true;
              ele.componentQuestionModels.forEach((nape) => {
                const ii = this.handlerPaper(nape, item, ele);
                if (!ii) {
                  hasAnswer = false;
                }
              });
              if (hasAnswer) {
                ele.hasAnswer = true;
                item.anserNum++;
              }
            });
          }
      });


      this.answerCardOpen = true;
      return this.paperDetails;
    },

    /**
     * 处理答题卡做题情况数据
     */
    handlerPaper(ele,item, parent) {
      let parentHasAnswer = true; // 复合题下分支题是否全部作答标识
      this.submitCon.questionList.forEach(ele2 => {
        const type = ele.componentType || ele.smallType;
        const smallId = ele.componentId || ele.smallId;

        if (ele2.questionCode == smallId && type != 4) { // 非填空题
          ele.hasAnswer = parentHasAnswer = ele2.userAnswer != '' ? true : false; // 记录该题是否作答
        }

        if (ele2.questionCode == smallId && type == 4) { // 填空题

          let isFour = ele2.userAnswer;
          let t = JSON.parse(isFour).every(val => {return !!val;});  //判断填空题是否一道没做

          // 记录该题是否作答
          if (t == "" || !t) { 
            ele.hasAnswer = parentHasAnswer = false; 
          } else {
            let fourAnswer = true;
            JSON.parse(ele2.userAnswer).forEach(ele3 => {
              if (ele3.answerValue == '') {
                fourAnswer = parentHasAnswer = false;
              }
            });
            ele.hasAnswer = fourAnswer;
          }
        }
      });

      return parentHasAnswer;
    },

    /**
     * 根据题号切换到该题
     */
    switchHandler(index) {
      if (document.body.offsetWidth < 1024) {
        this.answerCardOpen = false;
      }
      this.mySwiper.slideTo(index, 300, true);
    },

    /**
     * 获取提交内容
     */
    getSubmitCon() {
      this.$emit('submit', this.submitCon);
      return this.submitCon;
    },
  },
};
</script>

<style lang="scss" scoped>
.cm-allStem {
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  z-index: 1;
  touch-action: none;
  display: flex;
  flex-direction: column;
  .swiper-container {
    flex: 1;
    .swiper-slide {
      .swiper-slideAnswer {
        .big-name {
          padding: 0.24rem 0;
        }
      }
    }
  }
  .cm-allStem-footer {
    display: none;
  }
  .cm-allStem-head {
    display: none;
  }
  .cm-allStem-mhead {
    display: none;
  }
  
}
/*作答试题样式*/
.paper {
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
          font-size: .24rem 0;
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
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .swiper-slide {
        height: initial;
        &:last-child {
          padding-bottom: 20px;
        }
      }
    }
  }
}

@media screen and (min-width: 1024px) {

  .cm-allStem {
    .swiper-container {
      .swiper-slide {
        .swiper-slideAnswer {
          .big-name {
            padding: 14px 0;
            font-size: 16px;
            color: #3C3C3C;
            font-weight: bold;
          }
        }
      }
    }
    
    .cm-allStem-footer {
      height: 56px;
      margin: auto;
      border-top: 1px solid #E8E8E8;
      display: flex;    
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      .cm-allStem-footer-item {
        width: 100px;
        height: 28px;
        line-height: 28px;
        background: #FFFFFF;
        border: 1px solid #E8E8E8;
        border-radius: 14px;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: #5E5E5E;
        user-select: none;
        &:last-child {
          margin-left: 30px;
        }
        &:hover {
          cursor: pointer;
          background: #F2F8FF;
          border: 1px solid #237DEC;
          color: #237DEC;
        }
      }
    }
    .cm-allStem-head {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      border-bottom: 1px solid #E8E8E8;
      height: 56px;
      margin: auto;
      position: relative;
      width: 100%;
      .cm-allStem-head-title {
        width: 610px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 16px;
        font-weight: 400;
        color: #3C3C3C;
      }
      .cm-allStem-head-time {
        
        font-size: 14px;
        font-weight: 400;
        color: #5E5E5E;
        display: flex;
        justify-content: center;
        align-items: center;
        .iconfont {
          height: 14px;
          width: 14px;
          margin-right: 5px;
        }
      }
      .cm-allStem-head-card {
        height: 36px;
        padding: 0 20px;
        line-height: 36px;
        text-align: center;
        background: #F2F8FF;
        border-radius: 18px;
        font-size: 14px;
        font-weight: 400;
        color: #237DEC;
        margin-left: 30px;
        user-select: none;
        position: relative;
        &:hover {
          cursor: pointer;

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

@media screen and (max-width: 1024px) {
  .cm-allStem {
    .cm-allStem-mhead {
      display: block;
      position: relative;
      .allStem-mhead-top {
        display: flex;
        align-items: center;
        height: 50px;
        .head-time-icon {
          position: absolute;
          left: 0;
          width: 50px;
          height: 100%;
          display: flex;
          align-items: center;
        }
        .mhead-top-name {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 45%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #3C3C3C;
            font-size: 16px;
        }
        .mhead-top-btn {
          position: absolute;
          right: 0;
          padding: 4px;
          border-radius: 50px;
          border: 1px solid var(--color1);
          background: var(--color2);
          color: var(--color1);
          font-size: 14px;
        }
      }
      .allStem-mhead-bot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          color: #5E5E5E;
          height: 40px;
          background: #f7f7f7f7;
      }
      .cm-answerCard {
        height: calc(100% - 90px);
      }
    }
    .cm-allStem-mheadOpen {
      height: 100%;
    }
  }
}
</style>
