<template>
    <!--复合题组件-->
    <div class="compoundTypeStem" :class="paperState != 1 ? 'compound_viewall' : ''">
        
        <!-- 题干 -->
        <topic-drt :orderNum="orderNum" :stem="compoundDetails.stem" v-if="showBlock != 7" :showType="showType" :type="compoundDetails.type"></topic-drt>
        <!-- 预览使用 -->

        <div v-if="(paperState == 0 && compoundDetails.type != 7) || paperState == 2&&!isSwider">
            <div 
            v-for="(item4,index4) in compoundDetails.componentQuestionModels"
            :key="index4" 
            >
                <base-type-stem
                    :questionDetails="paperDataHandler(item4)"
                    :paperState="paperState"
                    :orderNum="(index4 + 1)"
                    :topicSmall="true"
                    :showBlock="showBlock"
                    :showType="showType"
                    :showLowerType="showLowerType"
                    :showKnowledgePoint="showKnowledgePoint">
                        <template v-slot:optionitem="{optionitem}">
                            <slot name="bases" v-bind:bases="optionitem">
                            </slot>
                        </template>
                </base-type-stem>
            </div>

        </div>

        <!--答题板-->
        
        <slot name="answerSheet" :scope="compoundDetails">
            <div v-if="paperState == 1 && compoundDetails.type > 5 || isSwider" class="compoundTypeStem-answerSheet">
                <answer-sheet
                    :showType="showType"
                    :showLowerType="showLowerType"
                    :questionType="compoundDetails.type"
                    :orderNum="orderNum"
                    :gainBtnShow="gainBtnShow"
                    @beginGestalt="beginGestalt"
                    @getnowIndex="getnowIndex" 
                    @twoChoice="twoChoice"
                    :getSmallBtn="getSmallBtn"
                    :componentQuestion="compoundDetails.componentQuestionModels" 
                    :paperState="paperState">
                </answer-sheet>

            </div>
            
        </slot>

    </div>

</template>

<script>

    export default {
        name: "cm-compoundcm-question",
        props: {
            // 试卷状态，0 预览  1 做答中 2 作答完成
            paperState: {
                type: String | Number,
                default: 0,
            },
            // 试题信息
            compoundDetails: {
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
            // 是否展示答题板形式
            isSwider: {
                type: Boolean,
			    default: false
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
                default: ''
            },
            // 是否展示产生式
            showKnowledgePoint: {
                type: Boolean,
                default: false
            },
            
			// 自判题是否展示获取小题按钮 false == 展示，true == 不展示
			getSmallBtn: {
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
        components: {
            baseTypeStem: () => import('./baseTypeStem'), // 基础题型组件
            answerSheet: () => import('../answerPanel/index'), // 作答面板
            topicDrt: () => import('../topicDrt/index'), // 题干组件
        },
        data() {
            return {
                stemPB:"0",  // 题干距离底部的padding值（复合题）
                getHeight: 'calc(100vh - 216.25px)', // 符合小题答题板高度
                // analysis: '',//解析
            }
        },
        created() {

        },
        mounted() {
        },
        methods: {

            //复合题提交
            twoChoice(optionitem, emitoption, index) {
                this.$emit('twoChoice', optionitem, emitoption, index)
            },
            //复合题中点击获取试题
            beginGestalt(componentQuestion) {
                this.$emit('beginGestalt',componentQuestion);
            },
            //复合题中点击下方小题
            getnowIndex(item) {
                this.$emit('getnowIndex',item);
            }
        },
    }
</script>

<style scoped lang="scss">
.compoundTypeStem {
    height: 100%;
    display: flex;
    flex-direction: column;
    text-align: left;
    .topicDrt {
        font-size: 14px;
        line-height: 20px;
        white-space: pre-wrap;
        flex: 1;
        height: 0;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        &::-webkit-scrollbar{

            display:none;
        
        }
        &>span {
            word-wrap: normal;
            word-break: break-word;
            line-height: 24px;
        }
    }

}
.compound_viewall {
    .topicDrt {
        touch-action: inherit;
        height: inherit;
        overflow-y: inherit;
    }
}
@media screen and (min-width: 1024px) {
    .compoundTypeStem {
        flex-direction: row;
        .topicDrt {
            height: 100%;
            &::-webkit-scrollbar{
                width: 4px;
                display: block;
            
            }
        }
        .compoundTypeStem-answerSheet {
            width: 40%;
        }

    }
    
    .compound_viewall {
        flex-direction: column;
    }
}
@media screen and (min-width: 700px) and (max-width: 1300px) {
    .compoundTypeStem {
                font-size: 29px !important;
                .compoundTypeStem-stem {
                    .topicDrt {
                            span {
                                font-size: 29px !important;
                                line-height: 40px  !important;
                            }
                    }
                    .baseTypeStem_key {
                        .options {
                            .op-item .key {
                                font-size: 29px !important;
                            }
                            .op-item .value_wrap .value {
                                font-size: 29px !important;
                            }
                        }
                    }
                }
                .compoundTypeStem-answerSheet {
                    .answerSheet {
                        .start {
                            span {
                                font-size: 29px !important;
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
                            .gestalt-wrap-sc {
                                font-size: 26px !important;
                            } 
                            .bottom-topic {
                                .baseTypeStem {
                                    .topicDrt {
                                        span {
                                            font-size: 26px !important;
                                        }
                                    }
                                    .baseTypeStem_key {
                                        .options {
                                        .op-item .key {
                                            font-size: 29px !important;
                                        }
                                        .op-item .value_wrap .value {
                                            font-size: 29px !important;
                                        }
                                    }
                                    }
                                    
                                    .result {
                                        padding: 20px 12px 0 !important;
                                        .baseKnowledgeModels,.name,.value {
                                            font-size: 26px !important;
                                        }
                                        .name {
                                            line-height: 40px !important;
                                        }
                                        .value-4 {
                                            margin-bottom: 10px;
                                        }
                                        .value {
                                            .analyzeValue {
                                                line-height: 40px !important;
                                            }
                                            span {
                                                font-size: 26px !important;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                .bottom-gestalt-wrap {
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
                    .top-img{
                        display: none;
                    }
                    .bottom-gestalt {
                        min-height: 293px !important;
                        height: 100% !important;
                    }
        }
        .compoundTypeStem {
                        font-size: 29px !important;
                        .topicDrt {
                            font-size: 29px !important;
                            .topicDrt-content {
                                span {
                                    font-size: 26px !important;
                                    line-height: 40px  !important;
                                }
                                .content_body {
                                    font-size: 26px !important;
                                    line-height: 40px  !important;
                                    p,div {
                                        font-size: 26px !important;
                                        line-height: 40px  !important;
                                    }
                                }
                            }
                        }
                        .baseTypeStem_key {
                            
                                .options {
                                    .op-item .key {
                                        font-size: 29px !important;
                                    }
                                    .op-item .value_wrap .value {
                                        font-size: 29px !important;
                                    }
                                }
                                .blanks {
                                    .blank {
                                        .index {
                                            width: 60px !important;
                                            font-size: 26px !important;
                                        }
                                        .cont {
                                            textarea {
                                                padding-top: 0px !important;
                                             height: 32px !important;
                                            font-size: 26px  !important;
                                            &::-webkit-input-placeholder {
                                                font-size: 26px  !important;
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
                                            font-size: 26px  !important;
                                            &::-webkit-input-placeholder {
                                                font-size: 26px  !important;
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
                                        font-size: 29px !important;
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
                            }
                        }
                    }
}
</style>
