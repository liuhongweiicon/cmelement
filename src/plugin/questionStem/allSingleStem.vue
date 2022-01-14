<template>
    <div class="all-single-stem">
        <baseTypeStem 
            v-if="questionData.type < 6" 
            :questionDetails="questionData" 
            :paperState="paperState" 
            :knowledgeString="knowledgeString"
            :orderNum="orderNum" 
            :showBlock="showBlock"
            
            :showType="showType"
            :showKnowledgePoint="showKnowledgePoint"
            @onceChoice="onceChoice"
        >
        <template v-slot:optionitem="{optionitem}">
            <slot name="optionScope" v-bind:optionScope="optionitem">
            </slot>
            </template>
        </baseTypeStem>
        <compoundTypeStem 
            v-else
            :gainBtnShow="gainBtnShow"
            :compoundDetails="questionData" 
            :paperState="paperState" 
            :orderNum="orderNum" 
            :isSwider="isSwider"
            :knowledgeString="knowledgeString"
            :showBlock="showBlock"
            :showType="showType"
            :showLowerType="showLowerType"
            :showKnowledgePoint="showKnowledgePoint"
            @twoChoice="twoChoice"
        >
            <template v-slot:bases="{bases}">
            <slot name="optionScope" v-bind:optionScope="bases">
            </slot>
            </template>
        </compoundTypeStem>
    </div>
</template>

<script>
    import baseTypeStem from './baseTypeStem'
    import compoundTypeStem from './compoundTypeStem'
    export default {
        name: 'all-single-stem',
        data() {
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
            // 知识点文案
            knowledgeString: {
                type: String,
                default: '',
            },
            // 试题序号
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
        },
        components: {baseTypeStem, compoundTypeStem},

        methods: {
            /**
             * 基础题型,作答答案处理
             */
            onceChoice(item, question) {
                // 更新提交内容值
                this.$emit('onceChoice', {item, question})
            },

            /**
             * 复合题型答案处理
             */
            twoChoice(item, question, index) {
                // 更新提交内容值
                this.$emit('twoChoice', {item, question, index})
            },
        }
    }
</script>

<style lang="scss" scoped>
.all-single-stem {
    height: 100%;
}
@media screen and (min-width: 700px) and (max-width: 850px) {
    .all-single-stem {
        
        .baseTypeStem {
            
            .answer,.analysis {
                        display: none;
                    }
                    
            .baseTypeStem_key {
                /deep/ .blank {
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
                .written {
                            .answer-wrap {
                                        font-size: 24px  !important;
                                .err {
                                        font-size: 24px  !important;

                                }
                            }
                            .answerSheet {
                                .top-img {
                                    img {
                                    width: 60px;
                                    height: 40px;

                                    }
                                }
                                .bottom-written {
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
            }
            .result {
                padding: 20px 12px 0 !important;
                .baseKnowledgeModels,.name,.value {
                    font-size: 24px !important;
                }
                .analysis_info {
                    margin-left: -10px !important;
                    .value {
                        span {
                        font-size: 24px !important;
                        }  
                    } 
                }
                .value-4 {
                    margin-bottom: 10px;
                }
                .value {
                    .analyzeValue {
                        line-height: 40px !important;
                    }
                    span {
                        font-size: 24px !important;
                    }
                }
            }
        }
        .baseTypeStem {
                        font-size: 24px !important;
                        
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
                                                padding-top: 0px !important;
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
                                            height: 32px !important;
                                            font-size: 24px  !important;
                                            &::-webkit-input-placeholder {
                                                font-size: 24px  !important;
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
                            }
                        }
                    }
                    
        .baseTypeStem {
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
                            .textarea {
                            height: 32px !important;
                            font-size: 24px !important;
                            }
                        }
                    }
                }
            }
            .result {
                padding: 20px 12px 0 !important;
                .baseKnowledgeModels,.name,.value {
                    font-size: 24px !important;
                }
                .value-4 {
                    margin-bottom: 10px;
                }
                .name {
                    line-height: 40px !important;
                }
                .analysis_info {
                        margin-left: -10px !important;
                }
                .value {
                    .analyzeValue {
                        line-height: 40px !important;
                    }
                    span {
                        font-size: 24px !important;
                    }
                }
            }
        }
        .baseTypeStem_key {
            padding-bottom: 0.6rem;
            box-sizing: border-box;
        }
        .allStem-dialog {
            .el-dialog {
                .el-dialog__header {
                    .el-dialog__title {
                        font-size: 24px !important;
                    }
                    .el-dialog__body {
                        span {
                            font-size: 24px !important;
                        }
                    }
                    .el-dialog__footer {
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
}
@media screen and (min-width: 850px) and (max-width: 1280px) {
    .all-single-stem {
        
        .baseTypeStem {
            
            .answer,.analysis {
                        display: none;
                    }
                    
            .baseTypeStem_key {
                /deep/ .blank {
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
                .written {
                            .answer-wrap {
                                        font-size: 19px  !important;
                                .err {
                                        font-size: 19px  !important;

                                }
                            }
                            .answerSheet {
                                .top-img {
                                    img {
                                    width: 60px;
                                    height: 40px;

                                    }
                                }
                                .bottom-written {
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
            }
            .result {
                padding: 20px 12px 0 !important;
                .baseKnowledgeModels,.name,.value {
                    font-size: 19px !important;
                }
                .analysis_info {
                    margin-left: -10px !important;
                    .value {
                        span {
                        font-size: 19px !important;
                        }  
                    } 
                }
                .value-4 {
                    margin-bottom: 10px;
                }
                .value {
                    .analyzeValue {
                        line-height: 40px !important;
                    }
                    span {
                        font-size: 19px !important;
                    }
                }
            }
        }
        .baseTypeStem {
                        font-size: 19px !important;
                        
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
                                                padding-top: 0px !important;
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
                                            height: 32px !important;
                                            font-size: 19px  !important;
                                            &::-webkit-input-placeholder {
                                                font-size: 19px  !important;
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
                            }
                        }
                    }
                    
        .baseTypeStem {
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
                            .textarea {
                            height: 32px !important;
                            font-size: 19px !important;
                            }
                        }
                    }
                }
            }
            .result {
                padding: 20px 12px 0 !important;
                .baseKnowledgeModels,.name,.value {
                    font-size: 19px !important;
                }
                .value-4 {
                    margin-bottom: 10px;
                }
                .name {
                    line-height: 40px !important;
                }
                .analysis_info {
                        margin-left: -10px !important;
                }
                .value {
                    .analyzeValue {
                        line-height: 40px !important;
                    }
                    span {
                        font-size: 19px !important;
                    }
                }
            }
        }
        .baseTypeStem_key {
            padding-bottom: 0.6rem;
            box-sizing: border-box;
        }
        .allStem-dialog {
            .el-dialog {
                .el-dialog__header {
                    .el-dialog__title {
                        font-size: 19px !important;
                    }
                    .el-dialog__body {
                        span {
                            font-size: 19px !important;
                        }
                    }
                    .el-dialog__footer {
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
}
</style>