<template>
  <div
    class="cm-singleQuestion"
    :class="{ paper: paperState == 1, preview: paperState != 1 }"
  >
    <!-- 作答时head -->
    <slot name="head" v-if="headerShow">
      <!-- 移动端头部样式 -->
      <div
        class="cm-singleQuestion-mhead"
        :class="{ 'cm-singleQuestion-mheadOpen': answerCardOpen }"
      >
        <div class="allStem-mhead-top">
          <div class="head-time-icon" @click="goBack" v-if="!answerCardOpen && isGoBack">
            <img class="iconfont" src="../static/img/back.png" alt="">
          </div>
          <div class="mhead-top-name">{{ paperDetails.paperName }}</div>
          <div
            class="mhead-top-btn"
            v-if="paperState == 1 && showCard"
            @click.stop="answerCardHandler"
          >
            {{ answerCardOpen ? "答题卡[返回]" : "答题卡[提交]" }}
          </div>

        </div>


        <!-- 答题卡组件 -->
        <slot name="answer-card">
            <!-- <answer-card
            
            :paperDetails="answerPaperDetails.bigQuestions"
            @switch="switchHandler"
            @submit="submitConHandler"
            ></answer-card> -->
            <div class="mhead-answerCard-cell" v-if="answerCardOpen">
              <div class="answerCard-cell-wrap">
                <div
                  class="cell-title"
                  v-for="(item, index) in submitCon"
                  :key="index" >
                  <p class="cell-title-text">
                    {{ ArabelToCN(index + 1) }}、{{ item.bigTitle }}
                  </p>
                  <span 
                      class="cell-title-order-item" 
                      :class="{'order-item-active': item.hasAnswer}"
                      @click="switchHandler(index)">
                      {{index +1}}
                  </span>

                </div>

              </div>

              <div class="cell-btn" @click="submitConHandler">
                提交
              </div>
            </div>
        </slot>
      </div>
    </slot>
    <div
	  @click.stop="answerCardOpen = false"
      class="swiper-container small singleAnswerpaperList "
      :class="{'swiper-no-swiping': paperState != 1}"
      style="touch-action: none;"
      v-if="paperDetails.questionList"
    >
      <div class="swiper-wrapper">
          <div
            class="swiper-slide"
            v-for="(item, index) in paperDetails.questionList"
            :key="item.smallId"
          >
            <div class="swiper-slideAnswer">
              <slot name="bigName" >
                <div class="big-name">
                    {{ ArabelToCN(index + 1) }}、{{ item.bigTitle }}
                </div>
              </slot>
              
              <div
                class="swiper-slide_content"
                :class="item.type < 6 ? 'slide_content_slide' : ''"
              >
                <base-type-stem
                  v-if="item.type < 6"
                  @onceChoice="answerHandler"
                  :questionDetails="paperDataHandler(item)"
                  :paperState="paperState"
                  :orderNum="showNum ? index + 1 : ''"
                  :knowledgeString="knowledgeString"
                  :showBlock="showBlock"
                  :showType="showType"
                  :showKnowledgePoint="showKnowledgePoint"
                >
                
                <template v-slot:optionitem="{optionitem}">
                  <slot name="optionScope" v-bind:optionScope="optionitem">
                  </slot>
                </template>
              </base-type-stem>

                <compound-type-stem
                  v-else
                  :gainBtnShow="gainBtnShow"
                  @twoChoice="answerHandler"
				          :getSmallBtn="getSmallBtn"
                  :compoundDetails="paperDataHandler(item)"
                  :paperState="paperState"
                  :orderNum="showNum ? index + 1 : ''"
                  :showBlock="showBlock"
                   :knowledgeString="knowledgeString"
                  :showType="showType"
                  :showLowerType="showLowerType"
                  :showKnowledgePoint="showKnowledgePoint"
                >
                
                  <template v-slot:bases="{bases}">
                    <slot name="optionScope" v-bind:optionScope="bases">

                    </slot>
                  </template>
                </compound-type-stem>
              </div>
            </div>
          </div>
      </div>
    </div>


	<slot name="popup">
		<el-dialog
			title="提示"
      :modal-append-to-body="false"
			:close-on-press-escape="false"
			:show-close="false"
			:close-on-click-modal="false"
			class="allStem-dialog"
			:visible.sync="isPopupTips"
			width="30%">
			<span>{{tipsText}}</span>
			<div slot="footer" class="dialog-footer">
				<div class="footer-cell" @click.stop="isPopupTips = false">取 消</div>
				<div class="footer-cell" @click.stop="tipsDefine">确 定</div>
			</div>
		</el-dialog>
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
  name: "cm-single-question",
  components: {
    baseTypeStem,
    compoundTypeStem,
    tipsPage,
    answerSheet,
    answerCard,
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
    // 知识点文案
    knowledgeString: {
        type: String,
        default: '',
    },
    // 是否隐藏head, ,默认显示
    headerShow: {
      type: Boolean,
      default: true,
    },
    /**
     * 区分展示题干/作答/答案/解析
     * 为空 => 全部展示
     * 1 => 只展示题干
     * 2 => 只展示题干及作答
     * 3 => 只展示答案
     * 4 => 只展示解析
     * 5 => 只展示知识点
     * 6 => 只隐藏我的作答
     * 7 => 只展示答案和解析
     */
    showBlock: {
      type: String | Number,
      default: "",
    },
    // 是否展示知识点
    showKnowledgePoint: {
      type: Boolean,
      default: false,
    },
    // 自判题预览默认是否展示小题 true => 不展示
    showSmallJudgeSelf: {
      type: Boolean,
      default: false,
    },
    // 开始作答按钮是都展示，默认展示
    showStart: {
      type: Boolean,
      default: true,
    },
            
    /**
     * 获取试题按钮是否展示 true = 不展示
     */
    gainBtnShow: {
        type: Boolean,
        default: false
    },

    /**
     * 是否展示题号
     */
    showNum: {
        type: Boolean,
        default: false
    },

    /**
     * 是否展示答题卡按钮
     */
    showCard: {
        type: Boolean,
        default: true
    },
    /**
     * 是否展示返回按钮 true = 展示
     */
    isGoBack: {
      type: Boolean,
      default: true,

    },
    /**
     * 是否展示题型
     */
    showType: {
        type: Boolean,
        default: false
    },
    /**
     * 是否展示复合小题题型
     */
    showLowerType: {
        type: Boolean,
        default: false
    },
    
  },
  watch: {
    /**
     * 监听试卷作答状态, 作答状态时设置sweiper对象
     */
	paperState: {
		handler(val) {
			
			if (val == 1 && !this.mySwiper) {
        // 设置sweiper对象
        this.setSweiper();
			} else if (val != 1 && this.mySwiper) {
				
				this.mySwiper.destroy(); //销毁Swiper对象。
				this.mySwiper = null;
			}
		},
		immediate: true,
		deep: true,

	},

    /**
     * 监听试卷信息变化, 处理试卷提交数据
     */
    paperDetails: {
      handler(val) {
          if (val.questionList) {
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
      isPopupTips: false, // 提示框
      tipsText: '', // 提示文案
      getSmallBtn: this.showSmallJudgeSelf, // 自判题是否展示获取小题按钮 false == 展示，true == 不展示
      answerPaperDetails: null, // 答题卡组件数据
      submitCon: [], // 提交作答数据

      nowquesIndex: 1, // 当前题目下标
      totalTopic: 0, // 题总数
      judgeSelf: false, // 自判题作答， true => 自判题作答

      answerCardOpen: false, //是否打开答题卡， => true 打开
      isEnd: false, // 是否是最后一题， => true 最后一题
    };
  },
  created() {
  },
  beforeDestroy() {
	clearInterval(this.timeInfo);
  },
  mounted() {
  },
  methods: {
    // 设置sweiper对象
    setSweiper() {
      const _this = this;
      if (this.paperState == 1) {
        setTimeout(() => {
          this.mySwiper = new Swiper(".singleAnswerpaperList", {
            speed: 100,
            // touchRatio : 0.2,
            loop: false,
            observer: true, //修改swiper自己或子元素时，自动初始化swiper
            observeParents: true, //修改swiper的父元素时，自动初始化swiper
            onSlideChangeEnd: function(swiper) {
              let index = _this.nowquesIndex - 1;
              _this.isEnd = swiper.isEnd; // 是否是最后一题

              _this.nowquesIndex = swiper.activeIndex + 1;
              _this.$emit("slideChangeEnd", swiper);
            },
          });
        }, 500);
      }
    },
	
    /**
     * 点击返回
     */
    goBack() {
      this.$emit("goBack");
    },

    /**
     * 作答答案处理
     */
    answerHandler(item, question) {
      // 更新提交内容值
      this.submitCon.forEach(ele => {
          if (ele.type < 6) {
            if (ele.id == item.id) {
                ele.userAnswer = this.updataSetsubmitCon(item, question);
            }
          } else {
              ele.componentQuestionModels.forEach(small => {
                  if (small.id == item.id) {
                        small.userAnswer = this.updataSetsubmitCon(small, question);
                  }
              })
          }
      })
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
        let answerArr = [];
        question.forEach(ele => {
          if (ele.active) {
            answerArr.push(ele.optionKey)
          }
        });
        return answerArr.join('');
      } else if (item.type == 4) {
        //填空
        let blanks = [];
        for (let d = 0; d < question.length; d++) {
          blanks.push(question[d].userValue || '');
        }
        return JSON.stringify(blanks);
      } else if (item.type == 3) {
        //判断
        return question;
      } else if (item.type == 5) {
        //主观
        return question;
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
      // this.answerPaperDetails = JSON.parse(JSON.stringify(this.submitCon))
      this.submitCon.forEach(item => {
        // 记录每道大题下小题的作答题数量
        
        if (item.type < 6) {
            // 非复合题
            this.handlerPaper(item);
        } else if (item.type > 5) {
          // 复合题
            item.hasAnswer = false;
            let hasAnswer = true;
            item.componentQuestionModels.forEach(nape => {
              const ii = this.handlerPaper(nape);
             console.log(nape, 'nape')
              if (!ii) {
                hasAnswer = false;
              }
            });
            if (hasAnswer) {
              item.hasAnswer = true;
            }
        }
      });
      console.log(this.answerPaperDetails, 'this.answerPaperDetails')
      this.answerCardOpen = true;
    },

    /**
     * 处理答题卡做题情况数据
     */
    handlerPaper(ele) {
      let parentHasAnswer = true; // 复合题下分支题是否全部作答标识
      if (ele.type != 4) {
          // 非填空题
          ele.hasAnswer = parentHasAnswer =
            ele.userAnswer != "" ? true : false; // 记录该题是否作答
        }

        if (ele.type == 4) {
          // 填空题

          let isFour = ele.userAnswer;
          let t = JSON.parse(isFour).every((val) => {
            return !!val;
          }); //判断填空题是否一道没做

          // 记录该题是否作答
          if (t == "" || !t) {
            ele.hasAnswer = parentHasAnswer = false;
          } else {
            let fourAnswer = true;
            JSON.parse(ele.userAnswer).forEach((ele3) => {
              if (ele3.answerValue == "") {
                fourAnswer = parentHasAnswer = false;
              }
            });
            ele.hasAnswer = fourAnswer;
          }
        }
      
      return parentHasAnswer;
    },

    /**
     * 数据处理
     */
    setsubmitCon(val) {
      val = JSON.parse(JSON.stringify(val))
      val.questionList.forEach(item => {
        
          if (item.type < 6) {
              if (item.type == "4") {
                  const answer = item.answer || item.answerKeys
                  if (answer != null) {
                      let smallAnswer = JSON.parse(answer);
                      for (let f = 0; f < smallAnswer.length; f++) {
                          smallAnswer[f].answerValue = "";
                      }
                      let blankArr = [];
                      smallAnswer.forEach((ele2) => {
                          blankArr.push(ele2.answerValue);
                      });
                      // obj.userAnswer = JSON.stringify(smallAnswer);
                      // item.userAnswer = JSON.stringify(blankArr);
                      this.$set(item, 'userAnswer', JSON.stringify(blankArr))
                  }
              } else {
                  // item.userAnswer = "";
                  this.$set(item, 'userAnswer', "")
              }
          } else {
              item.componentQuestionModels.forEach(ele => {
                  if (ele.type == "4") {
                      const answer = ele.answer || ele.answerKeys
                      if (answer != null) {
                          let smallAnswer = JSON.parse(answer);
                          for (let f = 0; f < smallAnswer.length; f++) {
                              smallAnswer[f].answerValue = "";
                          }
                          let blankArr = [];
                          smallAnswer.forEach((val) => {
                              blankArr.push(val.answerValue);
                          });
                          // obj.userAnswer = JSON.stringify(smallAnswer);
                          // ele.userAnswer = JSON.stringify(blankArr);
                          this.$set(ele, 'userAnswer', JSON.stringify(blankArr))
                      }
                  } else {
                      // ele.userAnswer = "";
                      this.$set(ele, 'userAnswer', "")
                  }
              });
          }
      });
      this.submitCon = val.questionList;
      
      if (this.paperState == 1) {
        // 设置sweiper对象
        this.setSweiper();
      }
      
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
      this.$emit("submit", this.paperDetails);
      return this.paperDetails;
    },

    /**
     * 提交作答
     */
    submitConHandler() {
      console.log(this.submitCon, 'this.submitCon')
      // const isAnswer = this.submitCon.some((item) => item.userAnswer === "");

      // const blankArr = this.submitCon.filter((item) => item.type == 4 );

      let allAnswer = false;
      // blankArr.forEach(item => {
      //   if (!allBlankArr) {
      //     allBlankArr = JSON.parse(item.userAnswer).some((ele) => ele == "")
      //   }
      // })
      // debugger
      this.submitCon.forEach(item => {
        if (item.type < 6) {
          if (item.type == 4) {
            if (!allAnswer) {
              allAnswer = JSON.parse(item.userAnswer).some((ele) => ele == "")
            }
          } else if (item.userAnswer == "") {
            allAnswer = true
          }
        } else {
          item.componentQuestionModels.forEach(ele => {
            
            if (ele.type == 4) {
              if (!allAnswer) {
                allAnswer = JSON.parse(ele.userAnswer).some((ele) => ele == "")
              }
            } else if (ele.userAnswer == "") {
              allAnswer = true
            }
          });
        }
      });

	

      this.isPopupTips = true;
      if (allAnswer) {
        this.tipsText = "您有未做答的题目，提交后不可继续做题。确认交卷吗？";
      } else {
        this.tipsText = "题目已全部完成，确认提交吗？";
      }
    },

    /**
     * 确认提交
     */
    tipsDefine() {
      this.isPopupTips = false;
      this.$emit('submit', this.submitCon)
    }
  },
};
</script>

<style lang="scss" scoped>
.cm-singleQuestion {
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  z-index: 1;
  touch-action: none;
  display: flex;
  flex-direction: column;
  user-select: none;
  .swiper-container {
    flex: 1;
    .swiper-slide {
      .swiper-slideAnswer {
        .big-name {
          padding: 12px 0;
        }
      }
    }
  }
  .cm-singleQuestion-footer {
    display: none;
  }
  .cm-singleQuestion-head {
    display: none;
  }
  .cm-singleQuestion-mhead {
    display: none;
  }
  .allStem-dialog {
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      user-select: none;
      .footer-cell {
        height: 40px;
        width: 80px;
        line-height: 40px;
        text-align: center;
        border-radius: 10px;
        border: 1px solid var(--color1);
        background-color: #FFFFFF;
        box-sizing: border-box;
        color: var(--color1);
        &:last-child {
          margin-left: 20px;
          border: none;
          background-color: var(--color1);
          color: #FFFFFF;
        }
        &:hover {
          cursor: pointer;
        }
      }
    }
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
        padding-top: 20px;
        box-sizing: border-box;
        .swiper-slide_content {
          flex: 1;
          height: 0;
        }
        .slide_content_slide {
          // overflow-y: auto;
          // -webkit-overflow-scrolling: touch;
          // padding-bottom: 10px;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        .big-name {
          padding: 12px 0;
          color: #999999;
        }
      }
    }
    .cony {
      padding: 0 25px;
    }
  }
}

/** 预览样式 */
.preview {
  .singleAnswerpaperList {
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
// @media screen and (min-width: 768px) and (max-width: 1024px) {
//     .cm-allStem {
//     .swiper-container {
//       .swiper-slide {
//         .swiper-slideAnswer {
//           .big-name {
//             font-size: 20px !important;
//           }
//         }
//       }
//     }

//     .cm-allStem-footer {
//       .cm-allStem-footer-item {
//         font-size: 18px !important;
//       }
//     }
//     .cm-allStem-head {
//       font-size: 18px !important;
      
//       .cm-allStem-head-title {
//         font-size: 20px;
//       }
//       .cm-allStem-head-r {
//         .cm-allStem-head-card {
//           font-size: 18px !important;
//         }
//       }
//     }
//   }
// }
@media screen and (min-width: 1024px) {
  .cm-singleQuestion {
    .swiper-container {
      .swiper-slide {
        .swiper-slideAnswer {
          .big-name {
            padding: 0px 0px 20px 0;
            font-size: 16px;
            color: #3c3c3c;
            font-weight: bold;
          }
        }
      }
    }

    .cm-singleQuestion-footer {
      height: 56px;
      margin: auto;
      border-top: 1px solid #e8e8e8;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      .cm-singleQuestion-footer-item {
        width: 100px;
        height: 28px;
        line-height: 28px;
        background: #ffffff;
        border: 1px solid #e8e8e8;
        border-radius: 14px;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: #5e5e5e;
        user-select: none;
        &:last-child {
          margin-left: 30px;
        }
        &:hover {
          cursor: pointer;
          background: #f2f8ff;
          border: 1px solid var(--color1);
          color: var(--color1);
        }
      }
    }
    .cm-singleQuestion-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e8e8e8;
      height: 56px;
      margin: auto;
      position: relative;
      width: 100%;
      font-size: 14px;
      font-weight: 400;
      color: #5e5e5e;
      margin-bottom: 20px;
      .head-time-icon {
        height: 100%;
        display: flex;
        align-items: center;
        line-height: 14px;
        .iconfont {
          margin-right: 5px;
        }
        &:hover {
          cursor: pointer;
        }
      }
      .cm-singleQuestion-head-title {
        width: 430px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 16px;
        font-weight: 400;
        color: #3c3c3c;
        text-align: center;
      }
      .cm-singleQuestion-head-r {
        display: flex;
        .cm-singleQuestion-head-time {
          display: flex;
          justify-content: center;
          align-items: center;
          line-height: 14px;
          .iconfont {
            margin-right: 5px;
          }
        }
        .cm-singleQuestion-head-card {
          height: 36px;
          padding: 0 20px;
          line-height: 36px;
          text-align: center;
          background: #f2f8ff;
          border-radius: 18px;
          font-size: 14px;
          font-weight: 400;
          color: #237dec;
          margin-left: 30px;
          user-select: none;
          position: relative;
          &:hover {
            cursor: pointer;
          }
        }
        .cm-singleQuestion-head-start {
          background: linear-gradient(to left, var(--color5), var(--color7)) ;
          color: #ffffff;
          &:hover {
            cursor: pointer;
          }

        }
      }
    }
  }
  /*作答试题样式*/
  .paper {
  }

}
// @media screen and (min-width: 768px) and (max-width: 1024px) {
//     .cm-singleQuestion {
//         .cm-singleQuestion-mhead {
//             .allStem-mhead-top {
//                 .mhead-top-name {
//                     font-size: 20px !important;
//                 }
//                 .mhead-top-btn {
//                     font-size: 18px !important;
//                 }
//             }
//         }
//   }
// }
@media screen and (max-width: 1024px) {
  .cm-singleQuestion {
    .cm-singleQuestion-mhead {
      display: block;
      position: relative;
      .allStem-mhead-top {
        display: flex;
        align-items: center;
        height: 50px;
        position: relative;
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
          color: #3c3c3c;
          font-size: 16px;
          text-align: center;
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
      .cm-answerCard {
        height: calc(100% - 90px);
      }
        .mhead-answerCard-cell {
            display: flex;
            flex-direction: column;
            flex: 1;
            height: 1px;
            .answerCard-cell-wrap {
              flex: 1;
              overflow: auto;
              height: 1px;
              padding: 0 .5rem .2rem .5rem;
              .cell-title-order-item {
                  display: inline-block;
                  width: 34px;
                  height: 34px;
                  line-height: 34px;
                  border-radius: 10px;
                  font-size: 14px;
                  font-weight: 400;
                  background: #FFFFFF;
                  border: 1px solid #EBEBEB;
                  box-sizing: border-box;
                  margin-right: 10px;
                  text-align: center;
                  &:last-child {
                      margin-right: 0;
                  }
              }
              .order-item-active {
                  color: #FFFFFF;
                  background: var(--color1);
              }

            }
            .cell-btn {
              border-top: 1px solid #cecccc;
              height: 1rem;
              display: flex;
              justify-content: center;
              align-items: center;
            }
        }
    }
    .cm-singleQuestion-mheadOpen {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    /deep/ .allStem-dialog {
      .el-dialog {
        width: 90% !important;
        margin-top: 50% !important;
      }
    }
  }
}

@media screen and (min-width: 850px) and (max-width: 1280px) {
    .cm-singleQuestion {
    .cm-singleQuestion-mhead {
      .allStem-mhead-top {
        .head-time-icon {
          display: none !important;
        }
      }
    }
  }
}
</style>
