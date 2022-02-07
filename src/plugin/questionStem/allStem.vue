<template>
  <div
    class="cm-allStem"
    :class="{ paper: paperState == 1, preview: paperState != 1 }"
  >
    <!-- 作答时head -->
    <slot name="head" v-if="headerShow">
      <!-- PC端头部样式 -->
      <div class="cm-allStem-head">
        
        <div class="head-time-icon" @click="goBack" v-if="isGoBack">
          <img class="iconfont" src="../static/img/back.png" alt="">
          <span>{{paperState != 1 ? '返回' : '结束作答'}}</span>
        </div>
        <div class="cm-allStem-head-title">{{ paperDetails.productName || paperDetails.paperName }}</div>

        <div class="cm-allStem-head-r">
          <div class="cm-allStem-head-time" v-if="isTimeHtml && getSmallBtn">
            <img class="iconfont" src="../static/img/time.png" alt="">
            <span>{{`考试时间：${timeHtml}`}}</span>
          </div>
          <div
            class="cm-allStem-head-card"
            @click.stop="answerCardHandler"
            v-if="paperState == 1"
          >
            {{ `答题卡【${answerCardOpen ? '返回' : '提交'}】(${nowquesIndex}/${totalTopic})` }}

            <!-- 答题卡组件 -->
            <answer-card
              v-if="answerCardOpen"
              :paperDetails="answerPaperDetails.bigQuestions"
              @switch="switchHandler"
              @submit="submitConHandler"
            ></answer-card>
          </div>

          

          <div class="cm-allStem-head-start cm-allStem-head-card" v-if="paperState == 0 && showStart" @click="startHandler">
            开始作答
          </div>

        </div>
      </div>

      <!-- 移动端头部样式 -->
      <div
        class="cm-allStem-mhead"
        :class="{ 'cm-allStem-mheadOpen': answerCardOpen }"
      >
        <div class="allStem-mhead-top">
          <div class="head-time-icon" @click="goBack" v-if="!answerCardOpen && isGoBack">
            <img class="iconfont" src="../static/img/back.png" alt="">
          </div>
          <div class="mhead-top-name">{{ paperDetails.paperName }}</div>
          <div
            class="mhead-top-btn"
            v-if="paperState == 1"
            @click.stop="answerCardHandler"
          >
            {{ answerCardOpen ? "答题卡[返回]" : "答题卡[提交]" }}
          </div>
        </div>

        <div class="allStem-mhead-bot">
          <div class="mhead-bot-time" v-if="isTimeHtml && getSmallBtn ">
            {{ `考试时间：${timeHtml}`}}
          </div>
          <div class="mhead-bot-order">
            {{
              paperState == 1
                ? `${nowquesIndex}/${totalTopic}`
                : `总分：${paperDetails.totalScore}分`
            }}
          </div>
        </div>

        <!-- 答题卡组件 -->
        <answer-card
          v-if="answerCardOpen"
          :paperDetails="answerPaperDetails.bigQuestions"
          @switch="switchHandler"
          @submit="submitConHandler"
        ></answer-card>
      </div>
    </slot>

    <div
	  @click.stop="answerCardOpen = false"
      class="swiper-container small answerpaperList"
      style="touch-action: none;"
      v-if="paperDetails.bigQuestions"
    >
      <div class="swiper-wrapper">
        <template v-for="(item, inx) in paperDetails.bigQuestions">
          <div
            class="swiper-slide"
            v-for="(item2, index2) in item.smallQuestions"
            :class="`questionCode${item2.questionCode}`"
            :key="item2.questionCode"
          >
            <div class="swiper-slideAnswer">
              <div class="big-name" v-if="!index2 || paperState == 1">
                {{ ArabelToCN(inx + 1) }}、{{ item.bigTitle }}（共{{
                  item.smallQuestions.length
                }}题；共{{ item.bigScore }}分）
              </div>
              <div
                class="swiper-slide_content"
                :class="item.type < 6 ? 'slide_content_slide' : ''"
              >
                <base-type-stem
                  v-if="item.bigType < 6"
                  @onceChoice="onceChoice"
                  :questionDetails="paperDataHandler(item2)"
                  :paperState="paperState"
                  :orderNum="index2 + 1"
                  :knowledgeString="knowledgeString"
                  :showBlock="showBlock"
                  :showType="showType"
                  :showKnowledgePoint="showKnowledgePoint"
                ></base-type-stem>

                <compound-type-stem
                  @getnowIndex="getnowIndex"
                  @beginGestalt="beginGestalt"
                  v-else
                  :gainBtnShow="gainBtnShow"
                  @twoChoice="twoChoice"
				          :getSmallBtn="getSmallBtn"
                  :compoundDetails="paperDataHandler(item2)"
                  :knowledgeString="knowledgeString"
                  :paperState="paperState"
                  :orderNum="index2 + 1"
                  :showBlock="showBlock"
                  :showType="showType"
                  :showLowerType="showLowerType"
                  :showKnowledgePoint="showKnowledgePoint"
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
      <div class="cm-allStem-footer" v-if="paperState == 1" @click.stop="answerCardOpen = false">
        <div
          class="cm-allStem-footer-item"
          v-if="nowquesIndex - 1"
          @click="slidePrevHandler"
        >
          上一题
        </div>
        <div class="cm-allStem-footer-item" @click="slideNextHandler">
          {{ isEnd || totalTopic == 1 ? "提交" : "下一题" }}
        </div>
      </div>
    </slot>

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
				<div class="footer-cell" v-if="topicname > 0" @click.stop="isPopupTips = false">取 消</div>
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
  name: "cm-all-stem",
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
    // 试卷作答或预览倒计时
    isTimeHtml: {
      type: Boolean,
      default: true,
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
     * 
      * 7 => 只展示答案和解析
     */
    showBlock: {
      type: String | Number,
      default: "",
    },
    // 知识点文案
    knowledgeString: {
        type: String,
        default: '',
    },
    // 是否展示知识点
    showKnowledgePoint: {
      type: Boolean,
      default: false,
    },
    // 自判题预览默认是否展示小题 true => 不展示
    showSmallJudgeSelf: {
      type: Boolean,
      default: true,
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
				//开始做题 时间开始
				this.nowTime = new Date().getTime();
				this.countDown();

				// 设置sweiper对象
        this.setSweiper();

			} else if (val != 1 && this.mySwiper) {
				
				this.mySwiper.destroy(); //销毁Swiper对象。
				this.mySwiper = null;
			} else if (val == 0) {
				// 开始预览时间
				this.enterTime = new Date().getTime();
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
        if (val.bigQuestions) {
          
          if (!this.oldSubmitCon.paperId) {
            this.topicname = this.paperDetails.standardTime * 60;
          }
          
          //做题时间
          this.timeHtml = this.paperDetails.standardTime + "分钟";
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

      submitCon: {
        //提交内容
        paperId: "", //试卷code
        questionList: [], //试题作答数组
      },

      oldSubmitCon: {
        // 有自判题时，存储其他题型作答数据
        //提交内容
        paperId: "", //试卷code
        questionList: [], //试题作答数组
      },

      nextTime: null, // 离开作答题时间
      nowTime: null, // 进入作答题时间
      nowquesIndex: 1, // 当前题目下标
      totalTopic: 0, // 题总数
	  
      enterTime: 0, // 开始预览试卷时间
      timeHtml: '', // 作答倒计时
      topicname: 0, //做卷时间
      timeInfo: null, // 作答倒计时
      judgeSelf: false, // 子判题作答， true => 自判题作答

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
          this.mySwiper = new Swiper(".answerpaperList", {
            speed: 100,
            touchRatio : 0.8,
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
              _this.$emit("slideChangeEnd", swiper);
            },
          });
        }, 500);
      }
    },
	
    /**
     * 倒计时
     */
    countDown() {
      this.timeInfo = setInterval(() => {
        this.topicname -= 1;
        this.timeHtml = this.formatSeconds(this.topicname);
        
        if (this.topicname <= 0) {
          this.topicname = 0;
          this.timeHtml = this.formatSeconds(this.topicname);
          this.answerCardHandler();
          this.answerCardOpen = true;
          this.submitConHandler();
          clearInterval(this.timeInfo);
        }
      }, 1000);
    },

    /**
     * 点击开始作答
     */
    startHandler() {
      this.$emit('start');
    },
    

    /**
     * 点击返回
     */
    goBack() {
      this.$emit("goBack");
    },

    /**
     * 基础题型,作答答案处理
     */
    onceChoice(item, question) {
    //   item.userAnswer = this.updataSetsubmitCon(item, question);
      // 更新提交内容值
      for (let i = 0; i < this.submitCon.questionList.length; i++) {
        let nowSubmitCon = this.submitCon.questionList[i];
        if (nowSubmitCon.questionCode == item.smallId) {
          this.submitCon.questionList[i].userAnswer = this.updataSetsubmitCon(
            item,
            question
          );
        }
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
          this.submitCon.questionList[i].userAnswer = this.updataSetsubmitCon(
            item,
            question
          );
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
      } else if (item.smallType == 5) {
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
	  _this.submitCon = {
		  paperId: data.paperId, //试卷code 
		  questionList: [], //试题作答数组
		  gradeCode: data.gradeCode, //学年
		  paperName: data.paperName, //试卷name
		  paperScore: data.totalScore, //试卷分数
		  subjectCode: data.subjectCode, //学科code
		  useTime: null, //答题总时间
		  readTime: null, // 阅读时间
	  }
      data.bigQuestions.forEach((item) => {
		    item.type = item.type || item.bigType;

        this.totalTopic += item.smallQuestions.length;
      });
      //试卷code
      _this.submitCon.paperId = data.paperId;

      for (let i = 0; i < data.bigQuestions.length; i++) {
        for (let j = 0; j < data.bigQuestions[i].smallQuestions.length; j++) {
          let nowSmallQuestion = data.bigQuestions[i].smallQuestions[j];
          //复合题
          if (nowSmallQuestion.smallType > 5) {
            for (
              let y = 0;
              y < nowSmallQuestion.componentQuestionModels.length;
              y++
            ) {
              let obj = {
                answerQuestionsTime: 0, //答题时间
                complexQuestionCode: "", //所属复合题code ,
                isComplexQuestion: 0, //是否是复合题
				type: nowSmallQuestion.smallType, // 大题类型，下面处理自判题时使用 
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

      if (this.paperState == 1) {
        // 设置sweiper对象
        this.setSweiper();
      }

    },

    /**
     * 点击上一题
     */
    slidePrevHandler() {
      this.mySwiper.slidePrev(true, 100);
    },

    /**
     * 点击下一题或提交
     */
    slideNextHandler() {
      this.mySwiper.slideNext(true, 100);
      if (this.isEnd) {
        this.submitConHandler();
      }
    },

    /**
     * 答题卡做题情况
     */
    answerCardHandler() {
      if (this.answerCardOpen && this.topicname > 0) {
        this.answerCardOpen = false;
        return;
      }
      this.answerPaperDetails = JSON.parse(JSON.stringify(this.paperDetails))
      this.answerPaperDetails.bigQuestions.forEach((item) => {
        // 记录没道大题下小题的作答题数量
        item.anserNum = 0;
        if (item.bigType < 6) {
          // 非复合题
          item.smallQuestions.forEach((ele) => {
            this.handlerPaper(ele, item);
            if (ele.hasAnswer) {
              item.anserNum++;
            }
          });
        } else if (item.bigType == 6 || (item.bigType == 7 && !this.getSmallBtn)) {
          // 复合题
          item.smallQuestions.forEach((ele) => {
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
    },

    /**
     * 处理答题卡做题情况数据
     */
    handlerPaper(ele, item, parent) {
      let parentHasAnswer = true; // 复合题下分支题是否全部作答标识
      this.submitCon.questionList.forEach((ele2) => {
        const type = ele.componentType || ele.smallType;
        const smallId = ele.componentId || ele.smallId;

        if (ele2.questionCode == smallId && type != 4 && type != 7) {
          // 非填空题
          ele.hasAnswer = parentHasAnswer =
            ele2.userAnswer != "" ? true : false; // 记录该题是否作答
        }

        if (ele2.questionCode == smallId && type == 4) {
          // 填空题

          let isFour = ele2.userAnswer;
          let t = JSON.parse(isFour).every((val) => {
            return !!val;
          }); //判断填空题是否一道没做

          // 记录该题是否作答
          if (t == "" || !t) {
            ele.hasAnswer = parentHasAnswer = false;
          } else {
            let fourAnswer = true;
            JSON.parse(ele2.userAnswer).forEach((ele3) => {
              if (ele3.answerValue == "") {
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
      this.$emit("submit", this.submitCon);
      return this.submitCon;
    },

    /**
     * 提交作答
     */
    submitConHandler() {
      // 预览和作答试卷时间
      if (!this.submitCon.readTime) {
        this.submitCon.readTime = Math.ceil(
          (this.nowTime - this.enterTime) / 1000
        );
        this.submitCon.useTime =
          this.paperDetails.standardTime * 60 - this.topicname;
      }

      const list = this.oldSubmitCon.paperId ? this.submitCon.questionList : this.submitCon.questionList.filter((item) => !item.type || item.type != 7 );

      const isAnswer = list.some((item) => item.userAnswer === "");
      const blankArr = this.submitCon.questionList.filter((item) => item.questionType == 4 );
      let allBlankArr = false;
      blankArr.forEach(item => {
        if (!allBlankArr) {
          allBlankArr = JSON.parse(item.userAnswer).some((ele) => ele == "")
        }
      })
	
      const allAnswer = isAnswer || allBlankArr;
      const kk = this.oldSubmitCon.paperId
        ? false
        : this.paperDetails.bigQuestions.find((item) => item.type == 7);
      this.isPopupTips = true;
      if (!allAnswer && !kk) {
        this.tipsText =
          this.topicname <= 0 ? "考试时间已结束，请交卷！" : "题目已全部完成，确认交卷吗？";
        return;
      } else if (allAnswer && !kk) {
        this.tipsText =
          this.topicname <= 0
            ? "考试时间已结束，请交卷！"
            : "您有未做答的题目，提交后不可继续做题。确认交卷吗？";
        return;
      } else if (allAnswer && kk) {
        this.judgeSelf = true;
        this.tipsText =
          this.topicname <= 0
            ? "考试时间已结束，提交后请自行判断部分试题正误，请交卷！"
            : "您有未做答的题目，提交后不可继续做题，并在提交后自行判断部分试题正误，确认交卷吗？";
        return;
      } else if (!allAnswer && kk) {
        this.judgeSelf = true;
        this.tipsText =
          this.topicname <= 0
            ? "考试时间已结束，提交后需自行判断部分试题正误，请交卷！"
            : "题目已全部完成，提交后需自行判断部分试题正误，确认交卷吗？";
        return;
      }
    },
    /**
     * 提示框确认按钮触发
     */
    tipsDefine() {
      this.isPopupTips = false;

      if (this.judgeSelf) {
        
        this.judgeSelf = false;
        this.nextTime = null; // 离开作答题时间
        this.nowTime = null; // 进入作答题时间
        this.oldSubmitCon = this.submitCon;
        const paperInfo = JSON.parse(JSON.stringify(this.paperDetails));
        paperInfo.bigQuestions = [paperInfo.bigQuestions.find(item => item.type == 7)];
        this.submitCon =  {
          //提交内容
          paperId: "", //试卷code 
          questionList: [], //试题作答数组
        },
        this.totalTopic = 0;
        this.getSmallBtn = false;
        this.answerCardOpen = false;
        this.nowquesIndex = 1;
        this.paperDetails.bigQuestions = paperInfo.bigQuestions;
		// this.$emit('update:paperDetails', paperInfo);
      } else {
        let newSubmitCon;
        if (this.oldSubmitCon.paperId) {
          this.submitCon.questionList.forEach(item => {
            if (!item.userAnswer) {
              item.userAnswer = null;
            }
            delete item.type
            this.oldSubmitCon.questionList.forEach(ele => {
              if (!ele.userAnswer) {
                ele.userAnswer = null;
              }
              delete ele.type
              if (item.questionCode == ele.questionCode) {
                ele.userAnswer = item.userAnswer;
                
              }
            })
          });
          newSubmitCon = this.oldSubmitCon;
        } else {
          newSubmitCon = this.submitCon;
        }
        this.$emit("submit", newSubmitCon);
      }
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
  user-select: none;
  .swiper-container {
    width: 1200px;
    background: #ffffff;
    flex: 1;
    padding-top: 20px;
    .swiper-slide {
      .swiper-slideAnswer {
        .big-name {
          padding: 12px 0;
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
    // width: 100%;
    width: 1200px;
    height: 100%;
    margin: auto;
    background: #ffffff;
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
            padding: 0px 0px 20px 20px;
            font-size: 16px;
            color: #3c3c3c;
            font-weight: bold;
          }
        }
      }
    }

    .cm-allStem-footer {
      height: 56px;
      margin: auto;
      border-top: 1px solid #e8e8e8;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 1200px;
      .cm-allStem-footer-item {
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
    .cm-allStem-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
    //   border-bottom: 1px solid #e8e8e8;
      height: 56px;
      margin: auto;
      position: relative;
      width: 1200px;
      font-size: 14px;
      font-weight: 400;
      color: #5e5e5e;
    //   margin-bottom: 20px;
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
      .cm-allStem-head-title {
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
      .cm-allStem-head-r {
        display: flex;
        .cm-allStem-head-time {
          display: flex;
          justify-content: center;
          align-items: center;
          line-height: 14px;
          .iconfont {
            margin-right: 5px;
          }
        }
        .cm-allStem-head-card {
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
        .cm-allStem-head-start {
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
      .allStem-mhead-bot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: #5e5e5e;
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
    /deep/ .allStem-dialog {
      .el-dialog {
        width: 90% !important;
        margin-top: 50% !important;
      }
    }
  }
}
@media screen and (min-width: 760px) and (max-width: 850px) {
    .preview {
        .cm-allStem-head {
            background: #FFFBF8;
                height: 110px !important;
            .cm-allStem-head-title {
                padding-left: 30px !important;
                width: 400px !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                white-space: nowrap !important;
                font-size: 28px !important;
            }
            .cm-allStem-head-r {
                .cm-allStem-head-start {
                    margin-right: 30px !important;
                    width: 150px !important;
                    height: 48px !important;
                    line-height: 48px !important;
                    background: #2780D0 !important;
                    font-size: 24px !important;
                    border-radius: 24px;
                }
                .cm-allStem-head-time {
                    width: 280px !important;
                    margin-right: -25px !important;
                    font-size: 24px !important;
                    .iconfont{
                        width: 20px !important;
                        height: 20px !important;
                    }
                }
            } 
        }
        .answerpaperList {
            padding: 0 30px !important;
            .swiper-slideAnswer {
                .big-name {
                    font-size: 28px !important;
                    color: #222222 !important;
                }
                .swiper-slide_content {
                    font-size: 24px !important;
                    .topicDrt {
                        .topicDrt-content {
                            span {
                                font-size: 24px !important;
                                line-height: 40px  !important;
                            }
                            .content_body {
                                font-size: 24px !important;
                                line-height: 40px  !important;
                                p,div {
                                    font-size: 24px !important;
                                    line-height: 40px  !important;
                                }
                            }
                        }
                    }
                    .baseTypeStem {
                        .topicDrt-content {
                            .content_body {
                                p,div {
                                    font-size: 24px !important;
                                    line-height: 40px  !important;
                                }
                            }
                        }
                        .baseTypeStem_key {
                            .options {
                                .op-item .key {
                                    font-size: 24px !important;
                                }
                                .op-item .value_wrap .value {
                                    font-size: 24px !important;
                                    line-height: 40px !important;
                                }
                            }
                        }
                    }
                }
            }
        }
        .baseTypeStem_key {
            // padding-bottom: 100px;
            box-sizing: border-box;
        }  

        .head-time-icon {
            display: none;
        }
        .cm-allStem-head {
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
            .cm-allStem-head-r {
                display: flex;
                .cm-allStem-head-start {
                    margin-right: 30px !important;
                }
                .cm-allStem-head-time {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    line-height: 14px;
                    .iconfont {
                        margin-right: 5px;
                    }
                }
                .cm-allStem-head-card {
                    height: 36px;
                    padding: 0 20px;
                    line-height: 36px;
                    text-align: center;
                    border-radius: 18px;
                    font-size: 14px;
                    font-weight: 400;
                    margin-left: 30px;
                    user-select: none;
                    position: relative;
                    background: linear-gradient(to left, #eb3f35, #ff6158);
                    color: #ffffff;
                }
            }
        }
        .cm-allStem-mhead {
            display: none;
        }
        
        .allStem-mhead-bot {
            margin: 0 30px !important;
            .mhead-bot-time {
                font-size: 24px !important;

            }
            .mhead-bot-order {
                font-size: 24px !important;

            }
        }
    }
    .paper  {
        padding-bottom: 0.6rem;
        box-sizing: border-box;
        .cm-allStem-head {
                background: #FFFBF8;
                height: 65px !important;
                .cm-allStem-head-title {
                    padding-left: 30px !important;
                    font-size: 28px !important;
                }
                .cm-allStem-head-r {
                    .cm-allStem-head-start {
                        margin-right: 30px !important;
                        font-size: 24px !important;
                    }
                } 
            }
        .allStem-mhead-top {
            background: #FFFBF8 !important;
            // height: 60px !important;
            // line-height: 60px !important;
            height: 110px !important;
            .mhead-top-name {
                font-size: 24px !important;
            }
            .mhead-top-btn {
                font-size: 24px !important;
                margin-right: 30px !important;
                height: 40px !important;
                line-height: 40px !important;
            }
            .head-time-icon {
                .iconfont {
                    display: none;
                }
            }
        }
        .allStem-mhead-bot {
            margin: 0 30px !important;
            .mhead-bot-time {
                font-size: 24px !important;

            }
            .mhead-bot-order {
                font-size: 24px !important;

            }
        }
        .cm-answerCard {
            .answerCard-stem-cell {
                .stem-cell-title {
                    span {
                        font-size: 24px !important;
                    }
                    .cell-title-order {
                        .cell-title-order-item {
                            font-size: 24px !important;
                            width: 50px !important;
                            height: 50px !important;
                            line-height: 50px !important;
                            
                        }
                    }
                }
            }
            .cm-answerCard-footer {
                width: 525px !important;
                height: 70px !important;
                background: #2780D0 !important;
                border-radius: 15px !important;
                line-height: 70px !important;
                margin: 0 auto !important;
                position: relative !important;
                color: #FEFEFE !important;
                font-size: 24px !important;
            }
        }
        .answerpaperList {
                .swiper-slideAnswer {
                    padding: 0 15px !important;
                    .big-name {
                        padding: 15px 15px !important;
                        font-size: 28px !important;
                        color: #222222 !important;
                    }
                    .swiper-slide_content {
                        padding: 0 15px !important;
                        font-size: 24px !important;
                        .topicDrt {
                            .topicDrt-content {
                                span {
                                    font-size: 24px !important;
                                    line-height: 40px  !important;
                                }
                                .content_body {
                                    font-size: 24px !important;
                                    line-height: 40px  !important;
                                    p,div {
                                        font-size: 24px !important;
                                        line-height: 40px  !important;
                                    }
                                }
                            }
                        }
                        .baseTypeStem {
                            .topicDrt-content {
                                .content_body {
                                    p,div {
                                        font-size: 24px !important;
                                        line-height: 40px  !important;
                                    }
                                }
                            }
                            .baseTypeStem_key {
                                .options {
                                    .op-item .key {
                                        font-size: 24px !important;
                                    }
                                    .op-item .value_wrap .value {
                                        font-size: 24px !important;
                                    }
                                }
                                .blanks {
                                    .blank {
                                        .index {
                                            width: 60px !important;
                                            font-size: 24px !important;
                                        }
                                        .cont {
                                            textarea {
                                            height: 32px !important;
                                            font-size: 24px  !important;
                                            &::-webkit-input-placeholder {
                                                font-size: 24px  !important;
                                            }
                                            }
                                        }
                                    }
                                }
                                .written {
                                    .answerSheet {
                                        .top-img {
                                            img {
                                            width: 60px;
                                            height: 40px;

                                            }
                                        }
                                        .bottom-written {
                                            textarea {
                                            font-size: 24px  !important;
                                            &::-webkit-input-placeholder {
                                                font-size: 24px  !important;
                                            }
                                            }

                                        }
                                    }
                                }
                            }
                        }
                        .compoundTypeStem-answerSheet {
                            .answerSheet {
                                .start {
                                    span {
                                        font-size: 24px !important;
                                            height:  48px  !important;
                                            line-height: 48px  !important;
                                    }
                                }
                            }
                            .answerSheet-content {
                                .top-img {
                                        height: 25px !important;
                                    img {
                                        height: 25px !important;
                                        width: 60px !important;
                                    }
                                }
                                .bottom-gestalt {
                                    .bottom-gestalt-wrap {
                                        .swiper-container {
                                            max-width: 900px !important;
                                            padding: 20px 0 !important;
                                        }
                                        .swiper-wrapper {
                                            .topactive,.swiper-slide {
                                                line-height: 38px !important;
                                            }
                                            
                                                .topactive {
                                                    border: 1px solid #2B83D3 !important;
                                                    color: #2B83D3 !important;
                                                }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
        }
        .baseTypeStem_key {
            padding-bottom: 0.6rem;
            box-sizing: border-box;
        }
        
        /deep/ .allStem-dialog {
            /deep/ .el-dialog {
                /deep/ .el-dialog__header .el-dialog__title {
                    font-size: 24px !important;
                }
                /deep/ .el-dialog__body {
                    span {
                        font-size: 24px !important;
                    }
                }
                /deep/ .el-dialog__footer {
                    font-size: 24px !important;
                    .dialog-footer {
                        .footer-cell {
                            height: 50px !important;
                            width: 90px !important;
                            font-size: 24px !important;
                            line-height: 50px !important;
                        }
                    }
                }

            }
        }
  }
}
@media screen and (min-width: 850px) and (max-width: 1280px) {
    .preview {
        .cm-allStem-head {
            background: #FFFBF8;
                padding: 32px 0 12px 0;
                height: auto !important;
                width: 100% !important;
            .cm-allStem-head-title {
                padding-left: 30px !important;
                width: 400px !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                white-space: nowrap !important;
                font-size: 24px !important;
            }
            .cm-allStem-head-r {
                .cm-allStem-head-start {
                    margin-right: 30px !important;
                    width: 121px !important;
                    height: 37px !important;
                    line-height: 37px !important;
                    background: #2780D0 !important;
                    font-size: 19px !important;
                    border-radius: 24px;
                }
                .cm-allStem-head-time {
                    width: 280px !important;
                    margin-right: -25px !important;
                    font-size: 19px !important;
                    .iconfont{
                        width: 20px !important;
                        height: 20px !important;
                    }
                }
            } 
        }
        .answerpaperList {
            padding: 0 30px !important;
            .swiper-slideAnswer {
                padding-top: 20px !important;
                .big-name {
                    font-size: 24px !important;
                    color: #222222 !important;
                }
                .swiper-slide_content {
                    font-size: 19px !important;
                    .topicDrt {
                        .topicDrt-content {
                            span {
                                font-size: 19px !important;
                                line-height: 40px  !important;
                            }
                            .content_body {
                                font-size: 19px !important;
                                line-height: 40px  !important;
                                p,div {
                                    font-size: 19px !important;
                                    line-height: 40px  !important;
                                }
                            }
                        }
                    }
                    .baseTypeStem {
                        .topicDrt-content {
                            .content_body {
                                p,div {
                                    font-size: 19px !important;
                                    line-height: 40px  !important;
                                }
                            }
                        }
                        .baseTypeStem_key {
                            .options {
                                .op-item .key {
                                    font-size: 19px !important;
                                }
                                .op-item .value_wrap .value {
                                    font-size: 19px !important;
                                    line-height: 40px !important;
                                }
                            }
                        }
                    }
                }
            }
        }
        .baseTypeStem_key {
            // padding-bottom: 100px;
            box-sizing: border-box;
        }  

        .head-time-icon {
            display: none !important;
        }
        .cm-allStem-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e8e8e8;
            height: 37px;
            margin: auto;
            position: relative;
            width: 100%;
            font-size: 14px;
            font-weight: 400;
            color: #5e5e5e;
            // margin-bottom: 20px;
            .cm-allStem-head-r {
                display: flex;
                .cm-allStem-head-start {
                    margin-right: 30px !important;
                }
                .cm-allStem-head-time {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    line-height: 14px;
                    font-size: 19px !important;
                    .iconfont {
                        margin-right: 5px;
                    }
                }
                .cm-allStem-head-card {
                    height: 36px;
                    padding: 0 20px;
                    line-height: 36px;
                    text-align: center;
                    border-radius: 18px;
                    font-size: 19px !important;
                    font-weight: 400;
                    margin-left: 30px;
                    user-select: none;
                    position: relative;
                    background: linear-gradient(to left, #eb3f35, #ff6158);
                    color: #ffffff;
                }
            }
        }
        .cm-allStem-mhead {
            display: none !important;
        }
        
        .allStem-mhead-bot {
            margin: 0 30px !important;
            .mhead-bot-time {
                font-size: 19px !important;

            }
            .mhead-bot-order {
                font-size: 19px !important;

            }
        }
    }
    .paper  {
        padding-bottom: 0.2rem;
        box-sizing: border-box; 

        .cm-allStem-head {
            padding: 32px 0 12px 0;
            .cm-allStem-head-r {
                .cm-allStem-head-time {
                    font-size: 19px !important;
                }
                .cm-allStem-head-card {
                    font-size: 19px !important;
                }
            }
        }
        .head-time-icon {
            display: none !important;
        }
        .cm-allStem-footer {
            .cm-allStem-footer-item:first-child {
                background: #ffffff !important;
                border: 1px solid #e8e8e8 !important;
                color: #5e5e5e !important;
            }
            .cm-allStem-footer-item:last-child {
                background: #f2f8ff !important;
                border: 1px solid var(--color1) !important;
                color: var(--color1) !important;
            }
        }
        .cm-allStem-head {
                background: #FFFBF8;
                height: auto !important;
                width: 100% !important;
                .cm-allStem-head-title {
                    padding-left: 30px !important;
                    font-size: 20px !important;
                }
                .cm-allStem-head-r {
                    .cm-allStem-head-start {
                        margin-right: 30px !important;
                        font-size: 19px !important;
                    }
                } 
            }
        .allStem-mhead-top {
            background: #FFFBF8 !important;
            // height: 60px !important;
            // line-height: 60px !important;
            height: 110px !important;
            .mhead-top-name {
                font-size: 19px !important;
            }
            .mhead-top-btn {
                font-size: 19px !important;
                margin-right: 30px !important;
                height: 40px !important;
                line-height: 40px !important;
            }
            .head-time-icon {
                .iconfont {
                    display: none;
                }
            }
        }
        .allStem-mhead-bot {
            margin: 0 30px !important;
            .mhead-bot-time {
                font-size: 19px !important;

            }
            .mhead-bot-order {
                font-size: 19px !important;

            }
        }
        .cm-answerCard {
            width: 300px !important;
            max-height: 400px;
            overflow-y: scroll !important;
            .answerCard-stem-cell {
                .stem-cell-title {
                    span {
                        font-size: 19px !important;
                    }
                    .cell-title-order {
                        .cell-title-order-item {
                            font-size: 19px !important;
                            width: 40px !important;
                            height: 40px !important;
                            line-height: 40px !important;
                            margin-bottom: 10px !important;
                        }
                    }
                }
            }
            .cm-answerCard-footer {
                width: 200px !important;
                height: 37px !important;
                background: #2780D0 !important;
                border-radius: 15px !important;
                line-height: 37px !important;
                margin: 0 auto !important;
                position: relative !important;
                color: #FEFEFE !important;
                font-size: 19px !important;
            }
        }
        .answerpaperList {
                .swiper-slideAnswer {
                    padding: 0 15px !important;
                    .big-name {
                        padding: 15px 15px !important;
                        font-size: 24px !important;
                        color: #222222 !important;
                    }
                    .swiper-slide_content {
                        padding: 0 15px !important;
                        font-size: 19px !important;
                        .topicDrt {
                            .topicDrt-content {
                                span {
                                    font-size: 19px !important;
                                    line-height: 40px  !important;
                                }
                                .content_body {
                                    font-size: 19px !important;
                                    line-height: 40px  !important;
                                    p,div {
                                        font-size: 19px !important;
                                        line-height: 40px  !important;
                                    }
                                }
                            }
                        }
                        .baseTypeStem {
                            .topicDrt-content {
                                .content_body {
                                    p,div {
                                        font-size: 19px !important;
                                        line-height: 40px  !important;
                                    }
                                }
                            }
                            .baseTypeStem_key {
                                .options {
                                    .op-item .key {
                                        font-size: 19px !important;
                                    }
                                    .op-item .value_wrap .value {
                                        font-size: 19px !important;
                                    }
                                }
                                .blanks {
                                    .blank {
                                        .index {
                                            width: 60px !important;
                                            font-size: 19px !important;
                                        }
                                        .cont {
                                            textarea {
                                            height: 32px !important;
                                            font-size: 19px  !important;
                                            &::-webkit-input-placeholder {
                                                font-size: 19px  !important;
                                            }
                                            }
                                        }
                                    }
                                }
                                .written {
                                    .answerSheet {
                                        .top-img {
                                            img {
                                            width: 60px;
                                            height: 40px;

                                            }
                                        }
                                        .bottom-written {
                                            textarea {
                                            font-size: 19px  !important;
                                            &::-webkit-input-placeholder {
                                                font-size: 19px  !important;
                                            }
                                            }

                                        }
                                    }
                                }
                            }
                        }
                        .compoundTypeStem-answerSheet {
                            .answerSheet {
                                .start {
                                    span {
                                        font-size: 19px !important;
                                            height:  48px  !important;
                                            line-height: 48px  !important;
                                    }
                                }
                            }
                            .answerSheet-content {
                                .top-img {
                                        height: 25px !important;
                                    img {
                                        height: 25px !important;
                                        width: 60px !important;
                                    }
                                }
                                .bottom-gestalt {
                                    .bottom-gestalt-wrap {
                                        .swiper-container {
                                            max-width: 900px !important;
                                            padding: 20px 0 !important;
                                        }
                                        .swiper-wrapper {
                                            .topactive,.swiper-slide {
                                                line-height: 38px !important;
                                            }
                                            
                                                .topactive {
                                                    border: 1px solid #2B83D3 !important;
                                                    color: #2B83D3 !important;
                                                }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
        }
        .baseTypeStem_key {
            padding-bottom: 0.6rem;
            box-sizing: border-box;
        }
        
        /deep/ .allStem-dialog {
            /deep/ .el-dialog {
                /deep/ .el-dialog__header .el-dialog__title {
                    font-size: 19px !important;
                }
                /deep/ .el-dialog__body {
                    span {
                        font-size: 19px !important;
                    }
                }
                /deep/ .el-dialog__footer {
                    font-size: 19px !important;
                    .dialog-footer {
                        .footer-cell {
                            height: 50px !important;
                            width: 90px !important;
                            font-size: 19px !important;
                            line-height: 50px !important;
                        }
                    }
                }

            }
        }
  }
}
</style>
