<template>
	<!--简单题型组件-->
	<div class="baseTypeStem" :class="{baseTypeStem_voice: questionDetailsInfo.type == 5}" :style="{paddingBottom:  paperState != 1 ? '36px' : '0'}">
    <!-- 题干 -->
    <topic-drt :orderNum="orderNum" :stem="questionDetailsInfo.stem" v-if="isShowBlock('1')"></topic-drt>
  
    <div v-if="isShowBlock('2')" class="baseTypeStem_key" :class="{baseTypeStem_key_written: questionDetailsInfo.type == 5 || paperState != 1}">
      <!-- 选择题 -->
      <div v-if="questionDetailsInfo.type == 1 || questionDetailsInfo.type == 2">
        <div class="options">

          <div>
            <div
              v-for="(optionitem, index) in questionDetailsInfo.quesOption"
              :key="index"
              class="op"
              >
              
              <div 
                  class="op-item" 
                  :class="setClass(optionitem)"
                  @click="paperState == 1 ? onceChoice(questionDetailsInfo, index) : null">
                
                <span class="key">{{ optionitem.optionKey }}</span>
                <span class="line"></span>
                <div class="value_wrap">
                  <span
                    class="value"
                    v-html="strToUrlCmelement(optionitem.optionValue)"
                    ></span>
                </div>


              </div>
              <slot name="op">
                <slot name="optionitem" v-bind:optionitem="{questionDetailsInfo, index}">
                </slot>
              </slot>
            </div>
          </div>
          
        </div>
      </div>

      <!--填空-->
      <div v-if="questionDetailsInfo.type == 4">

        <!-- 作答状态 -->
        <div v-if="paperState == 1">
          <div
            
            class="blanks"
            v-for="(answertem, index) in questionDetailsInfo.answer"
            :key="index"
          >
            <div class="blank" :class="{'compound-blank': !questionDetailsInfo.componentId}">
              <span class="index">{{ `空${index + 1}` }}</span>
              <span class="line"></span>
              <div class="cont">
                <textarea
                type="textarea"
                placeholder="请输入答案"
                @input="changeHandler"
                v-model="answertem.userValue"
                @blur="onceChoice(questionDetailsInfo, answertem)"
                >
                </textarea>
              </div>
            </div>
          </div>

        </div>
        
        <!-- 作答完毕 -->
        <div v-if="paperState == 2">
          <div
            class="blanks"
            v-for="(answertem, index) in questionDetailsInfo.userAnswer"
            :key="index"
          >
            
            <div :class="['blank', answertem]">
              <span class="index">{{ `空${index + 1}` }}</span>
              <span class="line"></span>
              <div class="cont">
                <textarea
                type="textarea"
                readonly
                :placeholder="answertem"
                v-model="answertem.answerValue"
                ></textarea>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!--判断题-->
      <div v-if="questionDetailsInfo.type == 3">
        
        <!-- 预览状态 -->
        <div class="judge" v-if="paperState == 0">
          <div>√</div>
          <div>×</div>
        </div>
        
        <!-- 作答状态 -->
        <div class="judge" v-if="paperState == 1">
          <div
            @click="paperState == 1 ? onceChoice(questionDetailsInfo, '1') : null"
            :class="{ active: questionDetailsInfo.userAnswer == 1 }"
            >
            √
          </div>
          <div
            @click="onceChoice(questionDetailsInfo, '0')"
            :class="{ active: questionDetailsInfo.userAnswer == 0 }"
            >
            ×
          </div>
        </div>
        
        <!-- 作答完毕 -->
        <div class="judge" v-if="paperState == 2">
          <div
          :class="
            questionDetailsInfo.userAnswer == 1
            ? questionDetailsInfo.answer == 1
              ? 'ok'
              : 'err'
            : ''
          "
          >
          √
          </div>
          <div
          :class="
            (questionDetailsInfo.userAnswer + '') === '0'
            ? questionDetailsInfo.answer == 0
              ? 'ok'
              : 'err'
            : ''
          "
          >
          ×
          </div>
        </div>
      </div>


      <!--书面表达-->
      <div class="written" v-if="questionDetailsInfo.type == 5">
          
        <slot name="answerSheet" :scope="questionDetailsInfo">
          <div v-if="paperState == 1">
            <answer-sheet
              :questionType="5"
              :paperState="paperState"
              :questionDetails="questionDetailsInfo"
              @onceChoice="onceChoice"
            ></answer-sheet>

          </div>
        </slot>
        <div
          v-if="paperState == 2&& isShowBlock('6')"
          class="answer-wrap"
        >
          我的作答：
          <span
          :class="questionDetailsInfo.userAnswer == questionDetailsInfo.answer ? 'ok' : 'err'"
          >
            {{ questionDetailsInfo.userAnswer }}
          </span>
        </div>
      </div>
    </div>

    <!-- 产生式 -->
    <div v-if="paperState == 2 && isShowBlock('5') && showKnowledgePoint">
      <div class="result answer">
				<span class="name baseKnowledgeModels">产生式：</span>
        <span class="value" v-if="questionDetailsInfo.baseKnowledgeModels && questionDetailsInfo.baseKnowledgeModels.length > 0">
          <span v-for="(know, k) in questionDetailsInfo.baseKnowledgeModels" :key="k">
            {{ know.baseProductionName }}
            <span v-if="k != questionDetailsInfo.baseKnowledgeModels.length -1">、</span>
          </span>
        </span>
      </div>
    </div>
		<!--答案 解析-->
		<div v-if="paperState == 2 && isShowBlock('3')">
      <!-- 单选题、多选题 -->
			<div
				class="result answer"
				v-if="questionDetailsInfo.type == 1 || questionDetailsInfo.type == 2"
			>
				<span class="name">答案：</span>
				<span class="value">{{ questionDetailsInfo.answer }}</span>
			</div>
      <!-- 判断题 -->
			<div class="result answer" v-if="questionDetailsInfo.type == 3">
				<span class="name">答案：</span>
				<span class="value">{{ questionDetailsInfo.answer == 0 ? "×" : "√" }}</span>
			</div>
      <!-- 填空题 -->
			<div
				class="result answer blanks-answer"
				v-if="questionDetailsInfo.type == 4"
			>
				<span class="name">答案：</span>
				<div v-if="questionDetailsInfo.answer && questionDetailsInfo.answer.length > 0">
          <p
            class="value value-4"
            v-for="(answeritem, index) in questionDetailsInfo.answer"
            :key="index"
          >
          <span v-if="questionDetailsInfo.answer.length > 1">{{index+1+'、'}}</span>
          <span v-if="answeritem.answerKeys && answeritem.answerKeys.length > 0">
            <span class="value-child" v-for="(a, b) in answeritem.answerKeys" :key="b">
              <span v-if="answeritem.answerKeys.length > 1">{{`（${b+1}）`}}</span>
              <span v-html="strUrlChangeCmelement(a)" ></span>
            </span>
          </span>
          <span v-else>略</span>
          </p>
				</div>
        <div class="value" v-else>略</div>
			</div>
      <!-- 主观题 -->
			<div class="result answer" v-if="questionDetailsInfo.type == 5">
				<span class="name">答案：</span>
				<span class="value" v-html="strUrlChangeCmelement(questionDetailsInfo.answer)"></span>
			</div>
		</div>

		<div v-if="paperState == 2 && isShowBlock('4')">
			<div class="result analysis 2132">
        
            <span class="name">解析：</span>
            <span class="value" v-if="!questionDetails.quesAnalyze || !JSON.parse(questionDetails.quesAnalyze).length">暂无解析</span>
            <div v-else class="analysis_info"> 
              <div 
                v-for="(item, inx) in JSON.parse(questionDetails.quesAnalyze)" 
                :key="inx"
                class="value" >
                <span class="analyzeKey">{{`${item.analyzeKey ? item.analyzeKey + ':' : ''}`}}</span>
                
                <span class="analyzeValue" v-html="strUrlChangeCmelement(item.analyzeValue)"></span>
              </div>
              
            </div>
      </div>
		
		</div>
	</div>
</template>
<script>
export default {
  name: "cm-base-type-stem",
  components: {
    answerSheet: () => import('../answerPanel/index'), // 作答面板
    topicDrt: () => import('../topicDrt/index'), // 题干组件
  },
  props: {
    // 试卷状态，0 预览  1 做答中 2 作答完成
    paperState: {
      type: String | Number,
      default: 0,
    },
    // 试题信息
    questionDetails: {
      type: Object,
      default: function() {
        return {};
      },
    },
    /**
     * 试题序号
     */
    orderNum: {
      type: String | Number,
      default: '1'
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
     */
    showBlock: {
      type: String | Number,
      default: ''
    },
    // 是否展示产生式
    showKnowledgePoint: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    

    /**
     * 区分展示题干/作答/答案/解析
     * 为空 => 全部展示
     * 1 => 只展示题干
     * 2 => 只展示题干及作答
     * 3 => 只展示答案
     * 4 => 只展示解析
     * 5 => 只展示知识点
     * 6 => 只隐藏我的作答
     */
    isShowBlock() {
      /**
       * val => 1 题干
       *     => 2 作答
       *     => 3 答案
       *     => 4 解析
       */
      return function(val) {
        if (!this.showBlock) return true;
        switch(val) {
          case '1':
            return this.showBlock == 1 || this.showBlock == 2|| this.showBlock == 6;
            break;
          case '2':
            return this.showBlock == 2 || this.showBlock == 6;
            break;
          case '3':
            return this.showBlock == 3|| this.showBlock == 6;
            break;
          case '4':
            return this.showBlock == 4|| this.showBlock == 6;
            break;
          case '5':
            return this.showBlock == 5|| this.showBlock == 6;
            break;
          case '6':
            return !this.showBlock;
            break;
        }
      }
    },

    /**
     * 设置选择题class
     */
    setClass() {
      return function(item) {
        switch(Number(this.paperState)) {
          case 0:
            return '';
            break;
          case 1:
            return {
              active: item.active == true,
            }
            break;
          case 2:
            return item.ok
            break;
          
        };
      };
    },

  },
  data() {
    return {
      analysis: "", //解析
      judgeActive: null, //判断是否正确
      questionDetailsInfo: {}, // 试题数据
    };
  },
  watch: {
    /**
     * 复合题-试题改变时触发处理数据函数
     */
    questionDetails: {
      handler(val) {
        this.questionDetailsInfo = JSON.parse(JSON.stringify(val));
        this.dataHandler(JSON.parse(JSON.stringify(val)));
      },
      immediate: true,
      deep: true,
    },

    /**
     * 监听转台改变
     */
    paperState() {
      this.dataHandler(this.questionDetailsInfo);
    }
  },
  mounted() {
    // this.dataHandler(this.questionDetailsInfo);
  },
  methods: {
    onceChoice: function(optionitem, index) {
      //要传的选中值
      var emitoption = null;

      //作答状态
      if (this.paperState == 1) {
        if (this.questionDetailsInfo.type == 1) { //单选
          for (var i = 0; i < this.questionDetailsInfo.quesOption.length; i++) {
            this.questionDetailsInfo.quesOption[i].active = false;
          }
          this.questionDetailsInfo.quesOption[index].active = true;
          this.questionDetailsInfo.quesOption.splice(index, 1, this.questionDetailsInfo.quesOption[index])

          emitoption = this.questionDetailsInfo.quesOption[index];
        } else if (this.questionDetailsInfo.type == 2) { //多选
         
          //若当前选中状态，点击取消选中
          if (this.questionDetailsInfo.quesOption[index].active == true) {
            this.questionDetailsInfo.quesOption[index].active = false;
          } else {
            this.questionDetailsInfo.quesOption[index].active = true;
          }
          this.questionDetailsInfo.quesOption.splice(index, 1, this.questionDetailsInfo.quesOption[index])
          emitoption = this.questionDetailsInfo.quesOption;
        } else if (this.questionDetailsInfo.type == 4) { //填空
          emitoption = this.questionDetailsInfo.answer;
        } else if (this.questionDetailsInfo.type == 3) { //判断
          
          // this.judgeActive = index;
          this.$set(optionitem, "userAnswer", index);
          emitoption = index;
        } else if (this.questionDetailsInfo.type == 5) { //主观题
          
          emitoption = index;
        }
        this.$emit("onceChoice", optionitem, emitoption);
      }
    },

    /**
     * 监听文本域内容的改变
     */
    changeHandler(e) {
      e.target.style.height ="inherit";
      e.target.style.height = `${e.target.scrollHeight}px`;
    },

    /**
     * 处理数据
     */
    dataHandler(item) {

      var _this = this;
      if (
        this.questionDetailsInfo.type == "1" ||
        this.questionDetailsInfo.type == "2"
      ) {
        if (typeof this.questionDetailsInfo.quesOption != "object") {
          var obj = JSON.parse(this.questionDetailsInfo.quesOption);
          for (var i = 0; i < obj.length; i++) {
            obj[i].active = false;


            if (_this.paperState == 2) {
              obj[i].ok = "";

              let userAnswerStr = _this.questionDetailsInfo.userAnswer || "";
              var answerStr = _this.questionDetailsInfo.answer || "";
              if (userAnswerStr.indexOf(obj[i].optionKey) != -1) {
                if (answerStr.indexOf(obj[i].optionKey) != -1) {
                  obj[i].ok = "ok";
                } else {
                  obj[i].ok = "err";
                }
              }
            }
          }
          this.questionDetailsInfo.quesOption = obj;
        }
      } else if (this.questionDetailsInfo.type == "4") {
        // console.log(typeof this.questionDetailsInfo.answerKeys != "object");\
        
        if (!this.questionDetailsInfo.answerKeys && this.questionDetailsInfo.rightAnswer) {
          this.questionDetailsInfo.answerKeys = this.questionDetailsInfo.rightAnswer
        }

        if (this.questionDetailsInfo.answerKeys && typeof this.questionDetailsInfo.answerKeys != "object") {
          if (_this.paperState == 2 || _this.paperState == 1) {
            var obj = JSON.parse(this.questionDetailsInfo.answerKeys);
            if (_this.paperState == 2) {
              if (this.questionDetailsInfo.userAnswer) {
                    var  useranswerArr = JSON.parse(this.questionDetailsInfo.userAnswer)
                    // const allAnswer = userAnswer.filter(item => !!item);
                  //  var useranswerArr = allAnswer.length ? userAnswer : '';
              }
            }
            for (var i = 0; i < obj.length; i++) {
              if (_this.paperState == 1) {
                obj[i].userValue = '';
              }
              if (_this.paperState == 2 && useranswerArr && useranswerArr.length) {
                if (obj[i].answerValue == useranswerArr[i].answerValue) {
                  // useranswerArr[i].ok = 'ok';
                } else {
                  // useranswerArr[i] = 'err';
                }
              }
            }
            if (_this.paperState == 2) {
              this.$set(this.questionDetailsInfo, "userAnswer", useranswerArr);
            }
            this.$set(this.questionDetailsInfo, "answer", obj);
          }
        }else {
          const answer = this.questionDetailsInfo.answer
          if(answer && typeof answer != "object"){
            const obj = JSON.parse(answer)
            if(obj.length > 0){
              for(let o of obj){
                o['answerKeys'] = [o.answerValue]
              }
            }
            this.$set(this.questionDetailsInfo, "answer", obj);
          }
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>
/*外层容器*/ 
.baseTypeStem {
    
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      display: none;
    }
    .baseTypeStem_key {
      padding-bottom: 10px;
      /*选择*/
      .op {
        display: flex;
        padding: 15px 15px 0;
        .op-item {
          box-sizing: border-box;
          padding: 13px;
          flex: 2;
          border: 1px solid #cccccc;
          border-radius: 10px;
          display: flex;
          width: 100%;
          align-items: center;
          .key, .value {
            font-size: 13px;
            line-height: 20px;
            white-space: pre-wrap;
            word-break: break-word;
            &>span {
              word-wrap: break-word;
              line-height: 24px;
              img{
                width:100% !important;
                display: block;
              }
            }
          }
          .value {
            color: #5E5E5E;
          }
          .key {
            color: #3C3C3C;
          }
          
          .line {
            display: inline-block;
            border-right: 1px solid #CCCCCC;
            height: 15px;
            margin: 0 14px 0 12.5px;
          }

        }
        
        /*点击情况*/
        .active {
          border: 1px solid var(--color1);
          background: var(--color2);
          .key, .value_wrap .value {
            color: var(--color1);
          }
        }
        /*正确情况*/
        .ok {
          border: 1px solid var(--color3);
          background: var(--color4);
          .key, .value_wrap .value {
            color: var(--color3);
          }
        }
        /*错误情况*/
        .err {
          border: 1px solid var(--color5);
          background: var(--color6);
          .key, .value_wrap .value {
            color: var(--color5);
          }
        }
      }
      /*填空*/
      .blanks{
        .blank{
          border: 1px solid #ccc;
          font-size: 13px;
          border-radius: 10px;
          margin: 16px 12px 0;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          /*填空key值*/
          .index{
            z-index: 1;
            font-size: 13px;
            color: #3C3C3C;
            padding-left: 13.5px;
            width: 30px;
            min-width: 50px;
          }
          .line {
            display: inline-block;
            border-right: 1px solid #CCCCCC;
            height: 15px;
            margin: 0 14px 0 12.5px;
          }
          /*input外层容器*/
          .cont{
            padding:  10px 10px 10px 0;
            box-sizing: border-box;
            width: 100%;
            z-index: 1;
          }
          input,textarea{
            outline: none;
            border: none;
            // overflow: hidden;
            width: 100%;
            height: 100%;
            font-size: 14px;
            background-color: transparent;
            overflow: hidden;  // 防止换行出现滚动条闪动
            box-sizing: border-box;
            transition: all 0.2s linear;
            resize:none;
            &::-webkit-scrollbar {
              display: none;
            }
            &::-webkit-input-placeholder {
              color: #BBBBBB;
              font-size: 13px;
            }
          }
          /*正确*/
          &.ok{
            border: 1px solid var(--color3);
            .index{
              color: var(--color3);
              background-color: var(--color4);
            }
          }
          /*错误*/
          &.err{
            border: 1px solid var(--color5);
            .index{
              color: var(--color6);
              background-color: var(--color6);
            }
          }
        }
      }

      /*判断题*/
      .judge {
        
        margin: 13px 12px 0;
        font-family: "微软雅黑";
        &>div {
          border: 1px solid #ccc;
          font-size: 16px;
          border-radius: 10px;
          width: 100%;
          height: 44px;
          line-height: 44px;
          text-align: left;
          // margin-bottom: 15px;
          margin-top: 15px;
          padding-left: 20px;
          box-sizing: border-box;
          /*点击情况*/
          &.active {
            border: 1px solid var(--color1);
            color: var(--color1);
            background: var(--color2);
          }
          &.ok {
            border: 1px solid var(--color3);
            color: var(--color3);
            background: var(--color4);
          }
          &.err {
            border: 1px solid var(--color5);
            color: var(--color5);
            background: var(--color6);
          }
        }
      }

      /*完形填空*/
      .gestalt {
        .gestalt-item {
          display: flex;
          justify-content: space-between;
          /*左侧index值*/
          .left-index {
            margin-top: 28px;
            font-size: 15px;
          }
          /*右侧选项值*/
          .right-options {
            width: 309px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            & >div {
              width: 149px;
              height: 42px;
              line-height: 42px;
              border: 1px solid #cccccc;
              border-radius: 5px;
              margin-top: 12px;
              .key {
                font-size: 13px;
                padding-right: 10px;
                padding-left: 15px;
              }
              .value {
                font-size: 14px;
              }
            }
            /*正确情况*/
            .ok {
              color: var(--color3);
              background: var(--color4);
            }
            /*错误情况*/
            .err {
              color: var(--color5);
              background: var(--color6);
            }
          }
        }
      }

      /*书面表达*/
      .written {
        /*line-height: 24px;*/
        font-size: 14px;
        .answer-wrap {
          border: 1px solid #d9d9d9;
          margin: 12px 12px 0;
          padding: 12px;
          word-break: break-word;
          line-height: 20px;
          border-radius: 4px;
        }
        /*正确情况*/
        .ok {
          color: var(--color4);
        }
        /*错误情况*/
        .err {
          color: var(--color5);
        }
      }
    }

    .baseTypeStem_key_written {
      padding-bottom: 0;
    }
    
    /*答案 解析*/
    .result{
      padding: 11px 12px 0;
      font-family: "微软雅黑";
      .name,.value{
        font-size: 15px;
        line-height: 24px;
      }
      &.analysis{
        
        display: flex;
        .analysis_info {
          flex: 1;
          .value {
            display: flex;
            
            color: #808080;
            /deep/ .analyzeKey,.analyzeValue {
              font-size: 15px;
              font-weight: 400 ;
              line-height: 24px;
              font-family: "微软雅黑";
              color: #808080 ;
            }
            span:first-child {
              margin-right: 10px;
            }
            span:last-child {
              flex: 1;
            }
          }
        }
      }
      &.answer{
        display: flex;
        align-items: baseline;
        .answer_know {
          flex: 1;
        }
        .value{
          flex: 1;
          color: #7ac858;
          /deep/ span {
            font-size: 15px!important;
            font-weight: 400 !important;
            line-height: 24px!important;
            font-family: "微软雅黑"!important;
            .value-child {
              display: flex;
              color: #7ac858;
            }
          }
        }
        .value-4 {
          display: flex;

        }
      }
    }
    /*填空题答案*/
    .blanks-answer {
      display: flex;
    }
    .topicDrt {
      /deep/p {
        margin: 0;
      }
    }
}
.baseTypeStem_voice {
    display: flex;
    flex-direction: column;
    .topicDrt {
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      &::-webkit-scrollbar {
        display: none;
      }
    }
}

@media screen and (min-width: 1024px) {
  .baseTypeStem {
    
    .topicDrt {
      flex: none;
    }
    .baseTypeStem_key {
      padding-bottom: 0px;
      .written {
          font-size: 14px;
          .answer-wrap {    
            margin: 10px 24px 0;
            padding: 10px 20px;
            word-break: break-word;
            line-height: 20px;
            border-radius: 6px;
          }

      }
      .op {
        padding: 20px 24px 0;
        .op-item {
          padding: 6px 18px;
          border-radius: 5px;
          margin: 0;
          min-width: 30%;
          width: initial;
          min-height: 40px;
          &:hover {
            cursor: pointer;
          }
          .value_wrap {
            .value {
              font-size: 14px;
              line-height: 18px;
            }
          }
          .line {
            height: 14px;
            margin: 0 16px;
          }
          .key {
            font-size: 14px;
            line-height: 18px;
            
          }

        }
      }
      .judge {
        margin: 0;
        margin-left: 24px;
        &:hover {
          cursor: pointer;
        }
        div {
          font-size: 20px;
          border-radius: 5px;
          height: 40px;
          line-height: 40px;
          margin-top: 20px;
          padding-left: 20px;
          width: 180px;
        }
      }
      .blanks {
        .blank {
          min-height: inherit;
          border-radius: 5px;
          margin: 20px 24px 0;
          font-size: 20px;
          .index {
            display: flex;
            justify-content: center;
            align-items: center;
            line-height: inherit;
            font-size: 14px;
            padding-left: 18px;
            width: 50px;
          }
          .line {
            height: 14px;
            margin: 0 16px;
          }
          .cont {
            padding: 10px 10px 10px 0;
            textarea {
              font-size: 14px;
              &::-webkit-input-placeholder {
                color: #BBBBBB;
                font-size: 14px;
              }
            }
          }
        }
        .compound-blank {
          width: 50%;
          min-width: 264px;
        }
      }

    }
    
    
    /*答案 解析*/
    .result{
      padding: 5px 24px;
      .baseKnowledgeModels {
        padding-top: 10px;
      }
      .name,.value{
        font-size: 14px;
        line-height: 23px;
      }
      &.analysis {
        .analysis_info {
          .value {
            /deep/ .analyzeKey,.analyzeValue {
              font-size: 14px ;
              font-weight: 400 ;
              line-height: 23px ;
            }
            span:first-child {
              margin-right: 0;
            }
          }
        }
      }
      &.answer .value{
        /deep/ span {
          font-size: 14px ;
          font-weight: 400 ;
          line-height: 23px ;
        }
      }
    }
    
    &::-webkit-scrollbar {
      display: block;
      width: 4px;
    }
  }
}
</style>
