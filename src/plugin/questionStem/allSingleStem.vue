<template>
    <div>
        <baseTypeStem 
            v-if="questionData.type < 6" 
            :questionDetails="questionData" 
            :paperState="paperState" 
            :orderNum="orderNum" 
            :showBlock="showBlock"
            :showKnowledgePoint="showKnowledgePoint"
        ></baseTypeStem>
        <compoundTypeStem 
            v-else
            :compoundDetails="questionData" 
            :paperState="paperState" 
            :orderNum="orderNum" 
            :showBlock="showBlock"
            :showKnowledgePoint="showKnowledgePoint"
        ></compoundTypeStem>
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
        components: {baseTypeStem, compoundTypeStem}
    }
</script>

<style lang="scss" scoped>

</style>