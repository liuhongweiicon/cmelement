<template>
    <div>
        <div v-for="(item, index) in questionList" :key="index">
            <all-single-stem 
                :questionData="item"  
                :orderNum="''" 
                :showBlock="'6'" 
                :paperState="2"
                :showKnowledgePoint="false"
            >
            <template v-slot:optionScope="{optionScope:{questionDetailsInfo,index}}">
                
                    <!-- <span>============={{questionDetailsInfo}}</span>
                    <span>-----------{{index}}</span> -->
            </template>
            </all-single-stem>
        </div>
    </div>
</template>

<script>
    import allSingleStem from '../plugin/questionStem/allSingleStem'
    import $http from '@/servers/index';

    export default {
        components: {
            allSingleStem
        },
        data(){
            return {
                questionList: []
            }
        },
        created() {
            this.getTestQuestion()
        },
        methods: {
            async getTestQuestion(){
                const data = {
                        // "gradeCode":33,
                        // "subjectCode":1,
                        // "knowledgeCodes":[
                        //     "776100200001", "776100200002"
                        // ],
                        // "pageNum":1,
                        // "pageSize":10,
                        // "booktypeCode":"bd9bfc91c6a540c2bbe0866ebc6df1b8",
                        // "difficultStars":null,
                        // "saveLock":false,
                        // "typeId":"6"
                        classCode: 4514,
taskCode: "d78b45c5b736416f99ef29980b28e6a5"
                    }

                const parmas = {"booktypeCode":"b9a8320392c04661bfcee5117ba53260","difficultStar":null,"gradeCode":33,"knowledgeCodes":["88900001","88900002"],"pageNum":1,"pageSize":10,"stem":null,"subjectCode":2}
                const res = await $http.getPaper(parmas);
                this.questionList = res.result.list
                // res.result.forEach(val => {
                //         this.questionList.push( {
                //       'answer':val.rightAnswer,
                //   'stem':val.baseName,
                //   'quesAnalyze':val.questionAnalyze,
                //   'quesOption':val.questionOption,
                //   'type':val.questionType,
                //   'isShowBase': true,
                //       isAdd:false,
                //       ...val
                //   })
                // })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>