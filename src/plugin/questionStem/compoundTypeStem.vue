<template>
    <!--复合题组件-->
    <div class="compoundTypeStem" :class="paperState != 1 ? 'compound_viewall' : ''">
        
        <!-- 题干 -->
        <topic-drt :orderNum="orderNum" :stem="compoundDetails.stem" v-if="showBlock != 7" :showType="showType" :type="compoundDetails.type"></topic-drt>
        <!-- 预览使用 -->

        <div v-if="(paperState == 0 && compoundDetails.type != 7) || paperState == 2">
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
            <div v-if="paperState == 1 && compoundDetails.type > 5 " class="compoundTypeStem-answerSheet">
                <answer-sheet
                    :showType="showType"
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
            }

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

</style>
