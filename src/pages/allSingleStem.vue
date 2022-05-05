<template>
    <div>
        <div v-for="(item, index) in questionList" :key="index">
            <all-single-stem 
                :questionData="item"  
                :gainBtnShow="true"
                :orderNum="1"
                :showBlock="'2'" 
                :isSwider="true"
                :paperState="2"
            >
            <!-- <template v-slot:optionScope="{optionScope}">
                
                    <span>============={{optionScope}}</span>
                    <span>-----------{{optionScope.index}}</span>
            </template> -->
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
//                         classCode: 4514,
                        // taskCode: "9ecfe2012e4f433b86464b867f1a7682"
                        // evaluationRecordCode: "ffe230c5517a4f83b5f7ce0e0e4dc14b"
                        // paperId: "2aa445c21ceb473fb0830c04c33ead7a",
                        // token: "string"
                        "questionId":"368eb5b68cc64733b342f2126bd0def2",
                        "sourceCode":"968d56aa6ad844a490478b9ab24c5073",
                        "userId":"1030457d-7861-404c-9db2-ba2cb45d4255"
                    }

                // const parmas = {"booktypeCode":"b9a8320392c04661bfcee5117ba53260","difficultStar":null,"gradeCode":33,"knowledgeCodes":["88900001","88900002"],"pageNum":1,"pageSize":10,"stem":null,"subjectCode":2}
                // const res = await $http.getTaskQuestionsByTaskCode(data);
                const res = await $http.getWrongSubjectQuestion(data);
                // let arr = []
                // res.bigQuestions.forEach(val => arr.push(...val.smallQuestions))
                // console.log('this.questionList',this.questionList)
                this.questionList = [res.result.question]
                // res.result.forEach(val => {
                //         this.questionList.push( {
                //       'answer':val.rightAnswer,
                //   'stem':val.baseName,
                //   'quesAnalyze':val.questionAnalyze,
                //   'quesOption':val.questionOption,
                //   'isShowBase': true,
                //       isAdd:false,
                //       ...val,
                //   'type':val.questionType,
                //   })
                // })
                console.log('this.questionList',this.questionList)
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>