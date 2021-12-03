<template>
    <div class="topicDrt">
        
        <div class="topicDrt-content" :class="{'topicDrt-compound': type > 5}">
            <span v-if="orderNum">{{ topicSmall ? `（${orderNum}）` : `${orderNum}.&nbsp;&nbsp;` }}</span>
            <div class="content_body">

                <span class="topicDrt_type" v-if="showType || showLowerType">{{questionType(type)}}</span>
                <div :class="{'topicDrt_html': showType || showLowerType}" v-html="strToUrlCmelement(stem)"></div>
            </div>
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
        },
        /**
         * 题型
         */
        type: {
            type: String | Number,
            default: "",
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
    display: flex;
    flex-direction: column;
    .topicDrt-content {
        display: flex;
        .content_body {
            position: relative;
            display: flex;
            .topicDrt_type {
                position: absolute;
                width: 40px;
                height: 20px;
                font-size: 12px !important;
                display: inline-block;
                background: var(--color9);
                border-radius: 4px; 
                color: var(--color8) !important;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .topicDrt_html {
                text-indent: 50px;
            }
        }
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
    .topicDrt-compound {
        margin-bottom: 10px;
    }
}
@media screen and (min-width: 700px) and (max-width: 1300px) {
    .topicDrt {
        font-size: 29px !important;
        /deep/ .topicDrt-content {
            /deep/span {
                font-size: 26px !important;
                line-height: 40px  !important;
            }
            /deep/ .content_body {
                font-size: 26px !important;
                line-height: 40px  !important;
                /deep/ p,div {
                    font-size: 26px !important;
                    line-height: 40px  !important;
                }
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
            
            .content_body {
                .topicDrt_type {
                    height: 24px;
                    font-size: 14px;
                }
            }
            /deep/ span {
                font-size: 14px ;
                font-weight: 400 ;
                line-height: 23px ;
            }
            /deep/p {
                font-size: 14px ;
                font-weight: 400 ;
                line-height: 23px ;
                margin: 0 ;
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