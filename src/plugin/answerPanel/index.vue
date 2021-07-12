<template>
  <div class="cmAnswerPanel" :class="{answerSheet_comp: questionType > 5}">
    <!--答题板组件  主观题 复合题-->
    <div class="answerSheet" v-if="questionType == 5">
      <div class="top-img" draggable="true" @touchmove="move" @click="toggle">
        <img src="../static/img/sheet_bg.png" />
      </div>
      <div
        class="bottom-written"
        v-show="writtentoggle"
        :style="{ height: heightNum + 'px' }"
      >
        <textarea
          @blur="onceChoice"
		  placeholder="请输入答案"
          v-model="textCon"
        ></textarea>
      </div>
    </div>
    <div class="answerSheet " v-if="questionType == 6 || (questionType == 7 && !getSmallBtn)">
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
			<div class="bottom-gestalt" :style="{ height: heightNum + 'px' }" @touchmove.stop>
				<div class="bottom-gestalt-wrap">
					<div class="swiper-container top-index"
						:class="'top-index' + orderNum">
						<div class="swiper-wrapper" >
							<div
								class="swiper-slide"
								:class="[{ topactive: nowIndex == index5 }]"
								style="width: 66px;"
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
						:class="'bottom-topic' + orderNum"
						:style="{ height: heightNum - 1 + 'px' }"
						>
						<div
							v-for="(item6, index6) in componentQuestion"
							:key="item6.componentId"
						>
							<base-type-stem
								v-show="index6 == nowIndex || screenWidth"
								@onceChoice="twoChoice"
								:questionDetails="paperDataHandler(item6)"
								:paperState="paperState"
								:orderNum="screenWidth ? index6 + 1 : nowIndex + 1"
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

		/**
		 * 试题序号
		 */
		orderNum: {
			type: String | Number,
			default: '0',
		},
		
		// 自判题是否展示获取小题按钮 false == 展示，true == 不展示
		getSmallBtn: {
		  type: Boolean,
		  default: false
		},
	},
	components: {
		baseTypeStem,
	},
	data() {
		return {
			heightNum: "293",
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
			const _this = this;
			if (val && this.questionType > 5) {
				_this.swiperInfo = new Swiper(".top-index" + this.orderNum, {
					slidesPerView: "auto",
					loop: false,
				});
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
			document.querySelector('.bottom-topic' + this.orderNum).scrollTop = 0;
			if (index >= 3) {
				this.swiperInfo.slideNext();
			}
			this.nowIndex = index;
			this.$emit("getnowIndex", item);
		},
		//调整高度
		move(e) {
			var screenHeight = document.documentElement.getBoundingClientRect().height;

			this.heightNum = screenHeight - e.changedTouches[0].clientY;
			if (this.heightNum >= screenHeight - 190) {
				this.heightNum = screenHeight - 190;
			}
			if (this.heightNum <= 200) {
				this.heightNum = 200;
			}
		},
		//点击答题板上方图标显示隐藏
		toggle() {
			if (this.questionType == 5) {
				this.writtentoggle = !this.writtentoggle;
			} else {
				this.heightNum == 0 ? (this.heightNum = 293) : (this.heightNum = 0);
			}
		},
		//主观题提交
		onceChoice() {
			
			this.$emit("onceChoice", this.questionDetails, this.textCon);
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
		box-shadow: 0rem -2px 19px 0rem rgba(198, 198, 198, 0.29);
		border-radius: 10px 10px 0rem 0rem;
		height: 54px;
		line-height: 54px;
		text-align: center;
		span {
			display: inline-block;
			background-color: var(--color1);
			width: 278px;
			height: 40px;
			line-height: 40px;
			text-align: center;
			border-radius: 20px;
			color: #FFFFFF;
		}
		
    }

    /*上方图片*/
    .top-img {
      width: 100%;
      height: 15px;
      text-align: center;
      img {
        width: 40px;
        height: 15px;
      }
    }
    /*下方内容*/
    /*主观题*/
    .bottom-written {
      background: white;
	  
	  box-shadow: 0rem -2px 19px 0rem rgba(198, 198, 198, 0.29);
	  border-radius: 10px;
	  padding: 16px 16px;
      textarea {
        width: 100%;
        height: 100%;
        resize: none;
		border: 1px solid #d9d9d9;
		padding: 10px;
		font-size: 15px;
		border-radius: 10px;
		box-sizing: border-box;
		&::-webkit-input-placeholder {
			font-size: 15px;
			color: #BBBBBB;
		}
      }
    }
    /*完形填空*/
    .bottom-gestalt {
		height: 293px;
		box-shadow: 0 -1.5px 0 0 #eeeeee;
		background: white;
		overflow: hidden;
		box-shadow: 0rem -2px 19px 0rem rgba(198, 198, 198, 0.29);
		border-radius: 10px 10px 0rem 0rem;
		.bottom-gestalt-wrap {
			display: flex;
			flex-direction: column;
			height: 100%;
		}
		/*上方题目index*/
		.top-index {
		width: 100%;
		overflow: hidden;
		border-bottom: 1px solid #d4d4d4;
		padding: 10px 0;
		ul {
			display: flex;
		}
		.swiper-wrapper {
			.swiper-slide {
			line-height: 28px;
			text-align: center;
			margin-right: 12px;
			display: inline-block;
			border-radius: 4px;
			border: 1px solid #b3b3b3;
			color: #b3b3b3;
			border-radius: 10px;
			}
			.swiper-slide:first-child {
				margin-left: 12px;
			}
			.topactive {
			border: 1px solid var(--color1) !important;
			// box-shadow: 0 0 3px 0.02rem var(--color1) inset;
			color: var(--color1) !important;
			}
		}
		}

		/*下方题目内容*/
		.bottom-topic {
			overflow: auto;
			flex: 1;
			height: 0;
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
							padding-bottom: 20px;
							box-sizing: border-box;
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
