<template>
    <div>
        <div v-for="(item, index) in questionList" :key="index">
            <all-single-stem 
                :questionData="item"  
                :orderNum="index+1" 
                :showBlock="''" 
                :paperState="2"
                :showKnowledgePoint="false"
            ></all-single-stem>
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
                        "gradeCode":33,
                        "subjectCode":2,
                        "knowledgeCodes":[
                            "88930001",
                            "88930002",
                            "88930003",
                            "88930008"
                        ],
                        "pageNum":1,
                        "pageSize":10,
                        "booktypeCode":"b9a8320392c04661bfcee5117ba53260",
                        "difficultStars":null,
                        "saveLock":false,
                        "type":"6"
                    }
                const res = await $http.getTestQuestion(data);
                this.questionList = res.result.list
                console.log(res);
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>