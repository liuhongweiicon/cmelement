<template>
    <div class="topicDrt">
        
        <span>{{ orderNum }}、</span>
        <span v-html="strToUrl(stem)"></span>
    </div>
</template>

<script>
export default {
    name: 'cm-topic-drt',
    props: {
        /**
         * 题干数据
         */
        stem: {
            type: String,
            default: ''
        },
        /**
         * 题序号
         */
        orderNum: {
            type: String | Number,
            default: 1
        },
    },
    data() {
        return {
        }
    },
}
</script>

<style lang="scss" scoped>
.topicDrt {
    font-size: .3rem;
    line-height: 0.4rem;
    white-space: pre-wrap;
    word-break: break-word;
    padding: 0.15rem 0.24rem 0;
    display: flex;
    align-items: baseline;
    color: #3C3C3C;
     /deep/ span {
        font-size: .3rem !important;
        font-weight: 400 !important;
        line-height: 0.48rem !important;
        color: #3C3C3C!important;
    }
     /deep/p {
        font-size: .3rem !important;
        font-weight: 400 !important; 
        line-height: 0.48rem !important;
        color: #3C3C3C!important;
    }
    &>span {
        word-wrap: break-word;
        line-height: 0.48rem;
        img{
            width:100%!important;
            display: block;
        }
    }

    &>span:first-child {
        white-space: nowrap;
    }
}
@media screen and (min-width: 1024px) {
    .topicDrt {
        font-size: 14px !important;
        line-height: 23px !important;
        white-space: pre-wrap !important;
        word-break: break-word !important;
        padding: 15px 24px 0 !important;
        display: flex !important;
        align-items: baseline !important;
        /deep/ span {
            font-size: 14px !important;
            font-weight: 400 !important;
            line-height: 23px !important;
        }
        /deep/p {
            font-size: 14px !important;
            font-weight: 400 !important;
            line-height: 23px !important;
            margin: 0 !important;
        }
        &>span {
            word-wrap: break-word;
            line-height: 23px;
            img{
                width:100% ;
                display: block;
            }
        }

        &>span:first-child {
            white-space: nowrap;
        }
    }
}
</style>