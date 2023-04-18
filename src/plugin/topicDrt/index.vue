<template>
    <div class="topicDrt">
        <div  @click="topicBtn" class="topicDrt-content" :class="{'topicDrt-compound': type > 5}">
            <span v-if="orderNum">{{ topicSmall ? `（${orderNum}）` : `${orderNum}.&nbsp;&nbsp;` }}</span>
            <div class="content_body">

                <span class="topicDrt_type" v-if="showType || showLowerType">{{questionType(type)}}</span>
                <div class="topicDrt_img" :class="{'topicDrt_html': showType || showLowerType}" v-html="strToUrlCmelement(stem)"></div>
            </div>
        </div>
        <!-- <div class="topicDrt-audio-visual">
            <audio controls src="horse.mp3"></audio>

            <video src="movie.ogg" controls="controls">您的浏览器不支持 video 标签。</video>
        </div> -->
        <!-- <div class="edImg" @click="close" @touchstart.prevent.stop=""
            @touchmove.prevent.stop=""
            @touchend.prevent.stop=""
            @touchcancel.prevent.stop="" v-if="targetimgdata&&$route.query.isIpad">
            <div class="close" >
                <span data-close="close">关闭</span>
            </div>
            <div class="imgInfo" @touchstart.prevent.stop=""
            @touchmove.prevent.stop=""
            @touchend.prevent.stop=""
            @touchcancel.prevent.stop="">
                <cm-img class="cmImg_content" :dataSet="dataSet"></cm-img>
            </div>
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
        
        // 试卷状态，0 预览  1 做答中 2 作答完成 3 缓存作答
        paperState: {
            type: Number | String,
            default: 0,
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
            url: null,
            errorNum: 3,
            targetimgdata: false,
            dataSet: {
                width: '100%', // 图片容器高
                height: '100%', // 图片容器宽
                urlList: [
                    { // 图片路径
                        url: null,
                    }
                ],
                wheel: true, // 是否允许滚轮缩放大小
                automatic: null, // 是否允许自动切换, 自动切换时间
                preNext: false, // 是否展示上一张和下一张按钮
                operate: false, // 是否展示放大缩小旋转重置按钮
                move: true, // 是否允许拖动
            }
        }
    },
    watch: {
        stem(val) {
        }
    },
    mounted() {
        // window.errorImg = this.errorImg
    },
	methods: {
        // 关闭弹框
        close (event) {
            let target = event.target.dataset
                console.dir('event',target)
            if (target.close == "close") {
                // event.stopPropagation()
                this.targetimgdata = false;
                this.dataSet.urlList[0].url = null
            }
        },
        // 点击题干打开图片
        topicBtn (event) {
            console.log('topicBtn打开图片方法', this.paperState)
            if (this.paperState == 3){
                this.$emit('imgBtn', event.target.src)
            };
            // let targetimg = event.target.src,
            //     targetdata = event.target.nodeName
            //     // this.targetimgdata = true
            //     // this.dataSet.urlList[0].url = 'http://iwrong-static.xinguoren.cn/resources_v3/csb20456_csb20555.files/image102.png'
            // if (targetdata.toLowerCase() == 'img') {
            //     this.targetimgdata = true;
            //     this.dataSet.urlList[0].url = targetimg

            // }
        },
        // 图片加载失败回调
        errorImg (err) {
            console.log('2222222222', err.src)
            if (this.errorNum<0) {
                // document.removeEventListener('error',this.handel)
                return
            } else {
                err.src = err.src
                this.errorNum--
            }
        },
        // 图片加载失败回调
        handel (err) {
            this.errorImg(err)
        },
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
    .edImg {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background: #b3b3b3;
        z-index: 11;
        .close {
            position: absolute;
            right: 20px;
            top: 20px;
            border: 1px solid #FFFFFF;
            border-radius: 16px;
            width: 76px;
            text-align: center;
            height: 32px;
            line-height: 32px;
            span {
                color: #FFFFFF;
                font-size: 20px;
            }
        }
        .imgInfo {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 800px;
            height: 800px;
            transform: translate(-50%, -50%);
            /deep/ .ed_img {
                background: none !important;
                img {
                    width: auto !important;
                    height: auto !important;
                }
            }
        }
    }
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
            .topicDrt_img {
                /deep/ img {
                    vertical-align: middle;
                }
            }
        }
        span {
            font-size: 15px ;
            font-weight: 400 !important;
            line-height: 24px !important;
            color: #3C3C3C!important;
        }
        p {
            font-size: 15px ;
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
@media screen and (min-width: 700px) and (max-width: 850px) {
    .topicDrt {
        padding: 20px 12px 0 !important;
        font-size: 24px !important;
        line-height: 40px  !important;
        /deep/ .topicDrt-content {
            span {
                font-size: 24px !important;
                line-height: 40px  !important;
            }
            /deep/ .content_body {
                font-size: 24px !important;
                line-height: 40px  !important;
                p,div {
                    font-size: 24px !important;
                    line-height: 40px  !important;
                }
            }
        }
    }
}
@media screen and (min-width: 850px) and (max-width: 1280px) {
    .topicDrt {
        padding: 20px 12px 0 !important;
        font-size: 19px !important;
        line-height: 40px  !important;
        /deep/ .topicDrt-content {
            line-height: 40px  !important;
            span {
                font-size: 19px !important;
                line-height: 40px  !important;
            }
            .content_body {
                font-size: 19px !important;
                line-height: 40px  !important;
                p,div {
                    font-size: 19px !important;
                    line-height: 40px  !important;
                }
            }
        }
    }
}
</style>
<style lang="less">
.imgDiv {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: #000000;
    padding: 70px;
    z-index: 99;
    .imgInfo {
        width: 100%;
        height: 100%;
        border-radius: 33px;
        position: relative;
        background: white;
        img {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%); 
        }
    }
    .close {
        position: fixed;
        right: 0px;
        top: 152px;
        font-size: 20px;
        z-index: 6666;
        .closeText {
            border: 1px solid #FFFFFF;
            border-radius: 16px;
            color: #FFFFFF;
            padding: 4px 15px;
        }
    }
}
</style>