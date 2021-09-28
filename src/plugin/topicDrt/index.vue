<template>
    <div class="topicDrt">
        <div class="topicDrt-content">
            <span v-if="orderNum">{{ topicSmall ? `（${orderNum}）` : `${orderNum}.&nbsp;&nbsp;` }}</span>
            <div v-html="strToUrlCmelement(stem)"></div>
        </div>
        <!-- <div class="topicDrt-audio-visual">
            <audio controls src="horse.mp3"></audio>

            <video src="movie.ogg" controls="controls">您的浏览器不支持 video 标签。</video>
        </div> -->
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
        /**
         * 是否是小题
         */
        topicSmall: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
        }
    },
    watch: {
        stem(val) {
        }
    }
}
</script>

<style lang="scss" scoped>
.topicDrt {
    font-size: 15px;
    line-height: 20px;
    white-space: pre-wrap;
    word-break: break-word;
    padding: 7.5px 12px 0;
    // display: flex;
    // align-items: baseline;
    color: #3C3C3C;
    .topicDrt-content {
        display: flex;
        /deep/ span {
            font-size: 15px !important;
            font-weight: 400 !important;
            line-height: 24px !important;
            color: #3C3C3C!important;
        }
        /deep/p {
            font-size: 15px !important;
            font-weight: 400 !important; 
            line-height: 24px !important;
            color: #3C3C3C!important;
        }
        &>span {
            word-wrap: break-word;
            line-height: 24px;
            img{
                width:100%!important;
                display: block;
            }
        }

        &>span:first-child {
            white-space: nowrap;
        }

    }
}
@media screen and (min-width: 768px) and (max-width: 1024px) {
    .topicDrt {
        font-size: 18px !important;
        .topicDrt-content {
            display: flex;
            /deep/ span {
                font-size: 18px !important;
            }
            /deep/p {
                font-size: 18px !important;
            }

        }

    }
}
@media screen and (min-width: 1024px) {
    .topicDrt {
        font-size: 14px ;
        line-height: 23px !important;
        white-space: pre-wrap !important;
        word-break: break-word !important;
        padding: 0px 24px 0 !important;
        // display: flex !important;
        // align-items: baseline !important;
        .topicDrt-content {
            display: flex;
            /deep/ span {
                font-size: 14px ;
                font-weight: 400 !important;
                line-height: 23px !important;
            }
            /deep/p {
                font-size: 14px ;
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
}
</style>