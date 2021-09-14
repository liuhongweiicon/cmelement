<template>
    <div class="all-single-stem">
        <baseTypeStem 
            v-if="questionData.type < 6" 
            :questionDetails="questionData" 
            :paperState="paperState" 
            :orderNum="orderNum" 
            :showBlock="showBlock"
            :showKnowledgePoint="showKnowledgePoint"
            @onceChoice="onceChoice"
        >
        <template v-slot:optionitem="{optionitem:{questionDetailsInfo,index}}">
            <slot name="optionScope" v-bind:optionScope="{questionDetailsInfo,index}">
            </slot>
            </template>
        </baseTypeStem>
        <compoundTypeStem 
            v-else
            :gainBtnShow="gainBtnShow"
            :compoundDetails="questionData" 
            :paperState="paperState" 
            :orderNum="orderNum" 
            :showBlock="showBlock"
            :showKnowledgePoint="showKnowledgePoint"
            @twoChoice="twoChoice"
        >
            <template v-slot:bases="{bases:{questionDetailsInfo,index}}">
            <slot name="optionScope" v-bind:optionScope="{questionDetailsInfo,index}">
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
            // 试题序号
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
            },
            
            /**
             * 获取试题按钮是否展示 true = 不展示
             */
            gainBtnShow: {
                type: Boolean,
                default: false
            }

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
</style>