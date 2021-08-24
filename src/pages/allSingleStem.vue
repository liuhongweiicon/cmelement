<template>
    <div>
        <div v-for="(item, index) in questionList" :key="index">
            <all-single-stem 
                :questionData="item"  
                :orderNum="''" 
                :showBlock="'2'" 
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
                const res = await $http.getQuestionByKnowledge(data);
                this.questionList = []
                res.result.forEach(val => {
                        this.questionList.push( {
                      'answer':val.rightAnswer,
                  'stem':val.baseName,
                  'quesAnalyze':val.questionAnalyze,
                  'quesOption':val.questionOption,
                  'type':val.questionType,
                  'isShowBase': true,
                      isAdd:false,
                      ...val
                  })
                })
                console.log(this.questionList);
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>