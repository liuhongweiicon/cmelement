<template>
  <div class="allDoubleStem">
    <div class="stemBox">
      <baseTypeStem v-if="questionData.type < 6"
                    :questionDetails="questionData"
                    :paperState="paperState"
                    :orderNum="orderNum"
                    :showBlock="showBlock"
                    
                    :showType="showType"
                    @onceChoice='selectAnswer'
                    :showKnowledgePoint="showKnowledgePoint"></baseTypeStem>
      <compoundTypeStem v-else
                        :compoundDetails="questionData"
                        :paperState="paperState"
                        :gainBtnShow="gainBtnShow"
				                :getSmallBtn="showKnowledgePoint"
                        :orderNum="orderNum"
                        @twoChoice="twoChoice"
                        
                        :showType="showType"
                        :showBlock="showBlock"
                        :showKnowledgePoint="showKnowledgePoint"></compoundTypeStem>
    </div>

    <div class="next-question-wrap">
      <div class="next-question-btn"
           @click="preQuestion"
           :class="{ isfirstQuestion: isfirstQuestion }">
        上一题
      </div>
      <div class="next-question-btn"
           @click="nextQuestion"
           :class="{ isLastQuestion: isLastQuestion }">
        下一题
      </div>
    </div>
  </div>
</template>

<script>
import baseTypeStem from './baseTypeStem'
import compoundTypeStem from './compoundTypeStem'
export default {
  name: 'all-double-stem',
  components: { baseTypeStem, compoundTypeStem },
  data () {
    return {
    }
  },
  props: {
    // 试卷数据
    questionData: {
      type: Object,
      default: {}
    },
    // 试卷状态，0 预览  1 做答中 2 作答完成
    paperState: {
      type: String | Number,
      default: 0,
    },
    // 试题序号
    orderNum: {
      type: String | Number,
      default: '1'
    },
    // 试题总数
    totalNum: {
      type: String | Number,
      default: 1
    },
    /**
     * 区分展示题干/作答/答案/解析
     * 为空 => 全部展示
     * 1 => 只展示题干
     * 2 => 只展示题干及作答
     * 3 => 只展示答案
      * 4 => 只展示解析
      * 6 => 只隐藏我的作答
      * 7 => 只展示答案和解析
    */
    showBlock: {
      type: String | Number,
      default: ''
    },
    // 是否展示产生式
    showKnowledgePoint: {
      type: Boolean,
      default: false
    },
    
            
    /**
     * 获取试题按钮是否展示 true = 不展示
     */
    gainBtnShow: {
        type: Boolean,
        default: false
    },
    // 自判题预览默认是否展示小题 true => 不展示
    showSmallJudgeSelf: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否展示题型
     */
    showType: {
        type: Boolean,
        default: false
    }

  },
  computed: {
    /**
     * @msg: 判断是否为最后一题
     * @return: Boolean类型数据
     */
    isLastQuestion () {
      return this.totalNum - this.orderNum === 0;
    },
    isfirstQuestion () {
      return this.orderNum === 1;
    },
  },
  methods: {
    /**
   * @msg: 点击下一题
   * nextTick : 待本题加载完成后在加载下一题
   */
    nextQuestion () {
      if (!this.isLastQuestion) {
        this.$nextTick(() => {
          this.$emit("nextQuestion");
        });
      }
    },
    /**
     * @msg: 点击上一题
     * nextTick : 待本题加载完成后在加载下一题
     */
    preQuestion () {
      if (!this.isfirstQuestion) {
        this.$nextTick(() => {
          this.$emit("preQuestion");
        });
      }
    },
    selectAnswer (optionitem, emitoption) {
      this.$emit("selectAnswer", optionitem, emitoption);
    },
    twoChoice (optionitem, emitoption, index) {
      this.$emit("twoChoice", optionitem, emitoption, index);
    }
  },
}
</script>

<style lang="scss" scoped>
.allDoubleStem {
  display: flex;
  flex-direction: column;
  padding: 35px 0 0;
  .stemBox {
    flex: 1;
    // height: 0;
    .baseTypeStem {
      flex: 1;
      // height: 0;
      text-align: left;
      /deep/.topicDrt-content {
        color: #4c4c4c;
        font-size: 18px;
        line-height: 35px;
      }
      /deep/.baseTypeStem_key {
        .key,
        .value {
          color: #888 !important;
          font-size: 16px !important;
          line-height: 25px !important;
        }
      }
    }
    .compoundTypeStem {
      height: auto;
    }
  }

  .next-question-wrap {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    padding: 10px;
    .next-question-btn {
      width: 112px;
      $h: 40px;
      height: $h;
      line-height: $h;
      border-radius: 6px;
      color: #eb3f35;
      font-size: 16px;
      border: 1px solid #eb3f35;
      margin-right: 20px;
      cursor: pointer;
      user-select: none;
    }
    .isLastQuestion {
      cursor: not-allowed;
    }
    .isfirstQuestion {
      cursor: not-allowed;
    }
  }
}
</style>