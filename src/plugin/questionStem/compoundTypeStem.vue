<template>
    <!--复合题组件-->
    <div class="compoundTypeStem" :class="paperState != 1 ? 'compound_viewall' : ''">
        
        <!-- 题干 -->
        <topic-drt :orderNum="orderNum" :stem="compoundDetails.stem"></topic-drt>
        <!-- 预览使用 -->
        <div v-if="paperState != 1">
            <div 
            v-for="(item4,index4) in compoundDetails.componentQuestionModels"
            :key="index4" 
            >
                <base-type-stem
                    :questionDetails="paperDataHandler(item4)"
                    :paperState="paperState"
                    :orderNum="orderNum + '.' + (index4 + 1)">
                </base-type-stem>
            </div>

        </div>

        <!--答题板-->
        
        <slot name="answerSheet" :scope="compoundDetails">
            <div v-if="paperState == 1 && compoundDetails.type == 6 " class="compoundTypeStem-answerSheet">
                <answer-sheet
                    questionType="6"
                    @beginGestalt="beginGestalt"
                    @getnowIndex="getnowIndex" 
                    @twoChoice="twoChoice" 
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
                getHeight: 'calc(100vh - 4.325rem)', // 符合小题答题板高度
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
    // margin-bottom: 0.6rem;
    height: 100%;
    display: flex;
    flex-direction: column;

    .topicDrt {
        padding: 0 .2rem;
        // display: flex;
        font-size: .28rem;
        line-height: .4rem;
        white-space: pre-wrap;
        // margin-top: .24rem;
        // touch-action: none;
        flex: 1;
        height: 1px;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        &::-webkit-scrollbar{

            display:none;
        
        }
        &>span {
            word-wrap: normal;
            word-break: break-word;
            line-height: .48rem;
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
