<template>
  <div class="cmAnswerPanel" :class="{answerSheet_comp: questionType == 6}">
    <!--答题板组件  主观题 复合题-->
    <div class="answerSheet" v-if="questionType == 5">
      <div class="top-img" draggable="true" @touchmove="move" @click="toggle">
        <img src="../static/img/sheet_bg.png" />
      </div>
      <div
        class="bottom-written"
        v-show="writtentoggle"
        :style="{ height: heightNum + 'rem' }"
      >
        <textarea
          @blur="onceChoice(questionDetails, textCon)"
		  placeholder="请输入答案"
          v-model="textCon"
        ></textarea>
        <!--<p>向左滑动屏幕进入答题卡</p>-->
      </div>
    </div>
    <div class="answerSheet " v-if="questionType == 6">
		<div
			v-show="gestaltShow == false"
			class="start"
			@click="beginGestalt(componentQuestion)"
		>
			<span>获取试题</span>
		</div>
		<div v-show="gestaltShow == true" class="answerSheet-content">
			<div class="top-img" draggable="true" @touchmove="move" @click="toggle">
				<img src="../static/img/sheet_bg.png" />
			</div>
			<div class="bottom-gestalt" :style="{ height: heightNum + 'rem' }" @touchmove.stop>
				<div>
					<div class="swiper-container top-index">
						<div class="swiper-wrapper" >
							<div
								class="swiper-slide"
								:class="[{ topactive: nowIndex == index5 }]"
								style="width: 1.32rem;"
								@click="getnowIndex(item5, index5)"
								v-for="(item5, index5) in componentQuestion"
								:key="index5"
								>
								<span>{{ index5 + 1 }}</span>
							</div>
						</div>
					</div>
					
					<div
						class="bottom-topic"
						:style="{ height: heightNum - 1.28 + 'rem' }"
						>
						<div
							v-for="(item6, index6) in (screenWidth ? componentQuestion : [componentQuestion[nowIndex]])"
							:key="index6"
						>
							<base-type-stem
								@onceChoice="twoChoice"
								:questionDetails="paperDataHandler(item6)"
								:paperState="paperState"
								:orderNum="nowIndex + 1"
							></base-type-stem>
						</div>
					</div>
				</div>
			</div>
		</div>
    </div>
  </div>
</template>

<script>
import baseTypeStem from "../questionStem/baseTypeStem";
export default {
	name: "cm-answer-panel",
	props: {
		/**
		 * 5 => 主观题 6 => 复合题
		 */
		questionType: {
			type: String | Number,
			default: "5",
		},
		/**
		 * 复合题数据
		 */
		componentQuestion: {
			type: Array,
			default: function() {
				return [];
			},
		},
		/**
		 * 主观题数据
		 */
		questionDetails: {
			type: Object,
			default: function() {
				return {};
			},
		},
		/**
		 * 试卷状态，0 预览  1 做答中 2 作答完成
		 */
		paperState: {
			type: String | Number,
			default: 0,
		},
	},
	components: {
		baseTypeStem,
	},
	data() {
		return {
			heightNum: "5.86",
			writtentoggle: true, // 主观题答题面板是否显示， => true 显示
			nowIndex: 0, //当前题目下标
			textCon: "", //主观题内容
			gestaltShow: false, //复合题答题板是否显示
			swiperInfo: null, // swiper对象
			screenWidth: false, // 屏幕宽度大于1024标识PC， 否则是移动端
		};
	},
	watch: {
		gestaltShow(val) {
			if (val && this.questionType == 6) {
				
				setTimeout(() => {
					this.swiperInfo = new Swiper(".top-index", {
						slidesPerView: "auto",
						loop: false,
						observer: true, //修改swiper自己或子元素时，自动初始化swiper
						observeParents: true, //修改swiper的父元素时，自动初始化swiper
					});

				}, 500);
			}
		}
	},
	created() {
		this.screenWidth = document.body.offsetWidth > 1024 ? true : false;
	},
	mounted() {

	},
	methods: {
		//复合题中点击开始作答
		beginGestalt(componentQuestion) {
			this.gestaltShow = true;
			//复合题开始作答
			this.$emit("beginGestalt", componentQuestion);
		},
		//复合题中点击下方小题
		getnowIndex(item, index) {
			if (index >= 3) {
				this.swiperInfo.slideNext();
			}
			this.nowIndex = index;
			this.$emit("getnowIndex", item);
		},
		//调整高度
		move(e) {
			// 1rem 等于多少px
			var renNum =
			(document.documentElement.getBoundingClientRect().width * 100) / 750;
			//高度
			var screenHeight = document.documentElement.getBoundingClientRect()
			.height;
			//高度rem数
			var screenRem = screenHeight / renNum;
			this.heightNum = screenRem - e.changedTouches[0].clientY / renNum;
			if (this.heightNum >= screenRem - 3.33) {
				this.heightNum = screenRem - 3.33;
			}
			if (this.heightNum <= 4) {
				this.heightNum = 4;
			}
		},
		//点击答题板上方图标显示隐藏
		toggle() {
			if (this.questionType == 5) {
				this.writtentoggle = !this.writtentoggle;
			} else {
				this.heightNum == 0 ? (this.heightNum = 5.86) : (this.heightNum = 0);
			}
		},
		//主观题提交
		onceChoice(questionDetails, textCon) {
			this.$emit("onceChoice", questionDetails, textCon);
		},
		//复合题提交
		twoChoice(optionitem, emitoption) {
			this.$emit("twoChoice", optionitem, emitoption, this.nowIndex);
		},
	},
};
</script>

<style lang="scss" scoped>
.cmAnswerPanel {
  .answerSheet {
    width: 100%;
    z-index: 100;
    .start {
		
		background: #FFFFFF;
		box-shadow: 0px -.04rem .38rem 0px rgba(198, 198, 198, 0.29);
		border-radius: .2rem .2rem 0px 0px;
		height: 1.08rem;
		line-height: 1.08rem;
		text-align: center;
		span {
			display: inline-block;
			background-color: var(--color1);
			width: 5.56rem;
			height: .8rem;
			line-height: .8rem;
			text-align: center;
			border-radius: .4rem;
			color: #FFFFFF;
		}
		
    }

    /*上方图片*/
    .top-img {
      width: 100%;
      height: 0.3rem;
      text-align: center;
      img {
        width: 0.8rem;
        height: 0.3rem;
      }
    }
    /*下方内容*/
    /*主观题*/
    .bottom-written {
      background: white;
	  
	  box-shadow: 0px -.04rem .38rem 0px rgba(198, 198, 198, 0.29);
	  border-radius: .2rem;
	  padding: 0.32rem .32rem;
      textarea {
        width: 100%;
        height: 100%;
        resize: none;
		border: 1px solid #d9d9d9;
		padding: 0.2rem;
		font-size: 0.3rem;
		border-radius: .2rem;
		box-sizing: border-box;
		&::-webkit-input-placeholder {
			font-size: 0.30rem;
			color: #BBBBBB;
		}
      }
    }
    /*完形填空*/
    .bottom-gestalt {
      height: 5.86rem;
      box-shadow: 0 -0.03rem 0 0 #eeeeee;
      background: white;
      overflow: hidden;
		box-shadow: 0px -.04rem .38rem 0px rgba(198, 198, 198, 0.29);
		border-radius: .20rem .20rem 0px 0px;
      /*上方题目index*/
      .top-index {
        width: 100%;
        overflow: hidden;
        margin: 0.38rem 0;
        ul {
          display: flex;
        }
        .swiper-wrapper {
          .swiper-slide {
            line-height: 0.56rem;
            text-align: center;
            margin-right: 0.24rem;
            display: inline-block;
            border-radius: 0.08rem;
            border: 1px solid #b3b3b3;
			color: #b3b3b3;
			border-radius: .2rem;
		  }
		  .swiper-slide:first-child {
			  margin-left: .24rem;
		  }
          .topactive {
            border: 1px solid var(--color1) !important;
            // box-shadow: 0 0 0.06rem 1px var(--color1) inset;
            color: var(--color1) !important;
          }
        }
      }

      /*下方题目内容*/
      .bottom-topic {
		overflow: auto;
		&::-webkit-scrollbar {
			display: none;
		}
      }
    }
  }
}

@media screen and (min-width: 1024px) {
	.cmAnswerPanel {
		// margin-top: 20px;
		
		.top-img {
			display: none;
		}
		.answerSheet {
			.start {
				height: 40px;
				line-height: 40px;
				font-size: 16px;
				width: 200px;
				margin: 0 auto;
				border-radius: 6px;
				box-shadow: none;
				span {
					width: 100%;
					border-radius: 40px;
					height: inherit;
					line-height: inherit;
				}
				&:hover {
					cursor: pointer;
				}
			}
			.bottom-written {
				box-shadow: none;
				height: 400px !important;
	  			padding: 20px 40px;
				textarea {
					padding: 10px;
					font-size: 24px;
					box-sizing: border-box;
					font-size: 14px;
					&::-webkit-input-placeholder {
						font-size: 14px;
					}
				}
			}

		}
	}
}
@media screen and (min-width: 1024px) {
	.answerSheet_comp{
		margin-top: 0px;
		height: 100%;

		.bottom-topic {
			/deep/ .baseTypeStem {
				.topicDrt {
					padding-top: 0;
				}
			}
		}
		.bottom-gestalt {
			box-shadow: none !important;
			.top-index {
				display: none;
			}
		}
		.answerSheet {
			height: 100%;
			.answerSheet-content {
				height: 100%;
				.bottom-gestalt {
					height: 100% !important;
					&>div {
						height: 100%;
						.bottom-topic {
							height: 100% !important;
							&::-webkit-scrollbar {
								display: block;
								width: 4px; 
							}
						}
					}
				}
			}

		}

	}

}
</style>
