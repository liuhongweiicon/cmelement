<template>
    <div 
        class="videocontrol" 
        :style="{height: height, width: width}" 
        :class="{'videocontrol_inside': inside}" 
        @mouseenter="inside = true" 
        @mouseleave="inside = false">
        <!-- 底部阴影 -->
        <div class="videocontrol_gradient_bottom">
        </div>
        <!-- 视频块 -->
        <div class="videocontrol_video">
            <video 
                class="video_cell" 
                :preload="preload" 
                :poster="poster" 
                :autoplay="autoplay"
                :loop="loop"
                :muted="muted">
                <source :src="src" type="video/mp4">
                <source :src="src" type="video/ogg">
                <source :src="src" type="video/WebM">
                <source v-if="isM3u8" :src="src" type="application/x-mpegURL">
            </video>
        </div>

        <!-- 控制面板 -->
        <div class="videocontrol_control">
            <div class="videocontrol_control_progress">
                <div class="progress_list">
                    <div class="progress_list_load" :style="{width: '69%'}"></div>
                    <div class="progress_list_play" :style="{width: '66%'}"></div>
                </div>
                <div class="progress_scrubber" :style="{left: '66%'}">
                    <div class="scrubber_indicator"></div>
                </div>
            </div>
            <div class="videocontrol_control_wrap">
                <div class="control_playbtn control_wrap_cell">
                    <svg class="iconfont" aria-hidden="true">     
                        <use :xlink:href="playStop ? '#iconzanting1' : '#iconkaishi1'"></use> 
                    </svg>
                </div>
                <div class="control_playnext control_wrap_cell">
                    <svg class="iconfont" aria-hidden="true">     
                        <use xlink:href="#iconNext"></use> 
                    </svg>
                </div>
                <div class="control_playloop control_wrap_cell">
                    <svg class="iconfont" aria-hidden="true">     
                        <use xlink:href="#iconcaozuo-xunhuan1"></use> 
                    </svg>
                </div>
                <div class="control_playtime">
                    <span class="control_playtime_item">07:23</span>
                    <span>/</span>
                    <span>09:23</span>
                </div>
            </div>
            <div class="videocontrol_control_wrap">
                <div class="control_speed" :class="{'speedPopup': speedPopup}" @click="speedPopup = true" @mouseleave="speedPopup = false">
                    <div class="control_speed_lable">倍速</div>
                    <div class="control_speed_list">
                        <div class="speed_list_content">
                            <div 
                                class="list_content_menuitem" 
                                v-for="(item, index) in speedList" 
                                :key="index + 'speed'" 
                                :class="{'activeSpeed': item == activeSpeed}" 
                                @click="speedHandler(item)">{{item}}X</div>
                        </div>
                        
                    </div>
                </div>
                <div class="control_wrap_cell" @click="soundPopup = true" @mouseleave="soundPopup = false">
                    <svg class="iconfont" aria-hidden="true">     
                        <use xlink:href="#iconline_shengyin"></use> 
                    </svg>

                    <div class="control_change" :style="{display: soundPopup ? 'block' : 'none'}" >
                        <div class="control_change_drag">
                            <div class="change_drag_range">
                                <div class="drag_range_current" style="height: 80%;">
                                    <div class="range_current_handle" @mousedown="mousedownHandler($event, dragRange)"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="control_playloop control_wrap_cell">
                    <svg class="iconfont" aria-hidden="true">     
                        <use xlink:href="#iconquanping"></use> 
                    </svg>
                </div>
                <div class="control_playloop control_wrap_cell">
                    <svg class="iconfont" aria-hidden="true">     
                        <use xlink:href="#iconquanping_o"></use> 
                    </svg>
                </div>

            </div>
        </div>

        <!-- 水印 -->
        <div class="videocontrol_watermark">
            <img class="videocontrol_watermark_img" :src="watermark" alt="">
        </div>
        
    </div>
</template>

<script>
require('./hls.js')
export default {
    name: 'videocontrol',
    props: {
        /**
         * auto => 指示一旦页面加载，则开始加载音频/视频。
         * metadata => 指示当页面加载后仅加载音频/视频的元数据。
         * node => 指示页面加载后不应加载音频/视频。
         */
        preload: {
            type: String,
            default: 'metadata'
        },
        /**
         * 视频封面网络链接
         */
        poster: {
            type: String,
            default: ''
        },
        /**
         * 自动播放
         * true => 自动播放
         * false => 手动触发播放
         */
        autoplay: {
            type: Boolean,
            default: true
        },
        /**
         * 循环播放 
         * true => 循环播放
         */
        loop: {
            type: Boolean,
            default: false
        },
        /**
         * 静音 
         * true => 静音
         */
        muted: {
            type: Boolean,
            default: true
        },
        /**
         * 视频地址
         */
        src: {
            type: String,
            default: 'http://downloadfile.e-eduspace.com/read_report.mp4'
        },
        /**
         * 视频高度
         */
        height: {
            type: String,
            default: '600px'
        },
        /**
         * 视频宽度
         */
        width: {
            type: String,
            default: '900px'
        },
        /**
         * 水印
         */
        watermark: {
            type: String,
            default: 'https://downloadfile.e-eduspace.com/waterMarkImg.png'

        },
        /**
         * 倍速值
         */
        speedList: {
            type: Array,
            default: ['0.5', '1.0', '1.25', '1.5', '2.0']
        }

    },
    watch: {
        /**
         * 监听视频源改变
         */
        src: {
            handler(val) {

            },  
            deep: true
        }
    },
    data() {
        return {
            isM3u8: false, // 是否是m3u8 true => m3u8
            inside: false, // 鼠标移入顶级元素标识 true => 移入 false => 移除

            // 操作面板
            playStop: false, // 暂停播放状态  true => 播放  false => 暂停
            speedPopup: false, // 点击倍速状态 => true  => 弹出倍速选择框
            activeSpeed: '1.0', // 当前选中倍速
            soundPopup: false, //  点击声音状态 => true  => 弹出声音选择框
            dragRange: null, // 音量鼠标mouseMove事件对象
        }
    },
    mounted() {
        this.dragRange = document.querySelector('.change_drag_range');
    },
    methods: {
        /**
         * 点击倍速，切换倍速
         */
        speedHandler(item) {
            this.activeSpeed = item;
        },

        /**
         * 鼠标按下事件
         */
        mousedownHandler(event, moveDom) {
            const e = event || window.event;
            const diifX = e.clientX;
            const diifY = e.clientY;
            console.log(this.offsetLeft)
            debugger
            moveDom.onmousemove = function (event) {
                event = event || window.event;
                let moveX = event.clientX - diifX;
                let moveY = event.clientY - diifY;
                console.log(moveY, 'moveY')
            }
            moveDom.onmouseup = function (event) {
                moveDom.onmousemove = null;
                moveDom.onmouseup = null;
            }
            moveDom.mouseleave = () => {
                moveDom.onmousemove = null;
                moveDom.onmouseup = null;
                moveDom.mouseleave = NULL;
            }
            
        },

        /**
         * 设置
         */
        changeVolume(event) {
            let volumeNum = event.clientY - 0;

        }
    }
}
</script>

<style lang="less" scoped>
.videocontrol {
    position: relative;
    background: #1c1d30;
    margin: auto;
    user-select: none;
    .videocontrol_gradient_bottom {
        pointer-events: none;
        position: absolute;
        bottom: 0;
        left: 0;
        opacity: 0;
        width: 100%;
        height: 15%;
        background-image: linear-gradient(0deg,rgba(0,0,0,.5) 0,rgba(0,0,0,0));
        background-position: 0 bottom;
        background-repeat: repeat-x;
    }
    .videocontrol_video {
        height: 100%;
        width: 100%;
        .video_cell {
            height: 100%;
            width: 100%;
        }
    }

    .videocontrol_control{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 10%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        box-sizing: border-box;
        opacity: 0;
        .videocontrol_control_progress {
            position: absolute;
            top: -8px;
            left: 0;
            width: 100%;
            height: 8px;
            padding: 0;
            vertical-align: top;
            cursor: pointer;
            .progress_list {
                background-color: transparent;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 8px;
                .progress_list_play, .progress_list_load {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 2px;
                    height: 100%;
                    transform: scaleY(.5);
                    background-color: #ff6429;
                    transition: all .15s ease;
                }
                .progress_list_load {
                    background-color: rgba(255,255,255,.5);
                }
                &::after {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    transform: scaleY(.5);
                    background-color: #fff;
                    background-color: rgba(255,255,255,.35);
                    content: "";
                    transition: all .15s ease;
                }
            }
            .progress_scrubber {
                position: absolute;
                top: -2px;
                width: 12px;
                height: 12px;
                margin-left: -6px;
                transform: scale(0);
                cursor: pointer;
                transition: all .15s ease;
                .scrubber_indicator {
                    left: 0;
                    top: 0;
                    position: relative;
                    width: 12px;
                    height: 12px;
                    border-radius: 100%;
                    background-color: #ff6429;
                    &::before {
                        display: block;
                        position: absolute;
                        top: -4px;
                        left: -4px;
                        width: 20px;
                        height: 20px;
                        border-radius: 100%;
                        background-color: #fe6429;
                        background-color: rgba(254,100,41,.3);
                        content: "";
                    }
                }
            }
            &:hover {
                .progress_scrubber {
                    transform: scale(1);
                }
                .progress_list {
                    .progress_list_play, .progress_list_load {
                        transform: scaleY(1);
                    }
                    &::after {
                        transform: scaleY(1);
                    }
                }
            }
        }
        .videocontrol_control_wrap {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            .control_wrap_cell {
                height: 100%;
                width: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                .iconfont {
                    height: 20px;
                    width: 20px;
                    fill: #fff;
                }
                &:hover {
                    .iconfont {
                        fill: #ff6429;
                    }
                }
                .control_change {
                    z-index: 20;
                    position: absolute;
                    bottom: 34px;
                    width: 100%;
                    padding-bottom: 24px;
                    color: #eee;
                    left: 50%;
                    width: 42px;
                    transform: translate(-50%);
                    cursor: default;
                    .control_change_drag {
                        border-radius: 4px;
                        overflow: hidden;
                        background-color: rgba(0,0,0,.8);
                        .change_drag_range {
                            position: relative;
                            width: 4px;
                            height: 90px;
                            margin: 10px 19px;
                            border-radius: 2px;
                            background-color: #a6a6a6;
                            background-color: rgba(166,166,166,.5);
                            cursor: pointer;
                            .drag_range_current {
                                z-index: 1;
                                position: absolute;
                                bottom: 0;
                                left: 0;
                                width: 100%;
                                border-radius: 2px;
                                background-color: #ff6429;
                                    height: 56%;
                                .range_current_handle {
                                    position: absolute;
                                    top: -4px;
                                    left: -2px;
                                    width: 8px;
                                    height: 8px;
                                    border-radius: 100%;
                                    background-color: #fff;
                                    cursor: pointer;
                                    &::after {
                                        display: block;
                                        z-index: -1;
                                        position: absolute;
                                        top: -12px;
                                        left: -12px;
                                        width: 32px;
                                        height: 32px;
                                        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADAUExURQAAAP+ZAP+RAP9/AP+aAP9/AP+OCP//AP9/AP+qAP+QDf+SDP+TDv+TCv+RCP+ZAP+TC/+TCP+QC/+RCv+SCf+SCv+QCv+RCv+TCf+PD/+PCP+RDP+RCf+RCv+PCf+RB/+RCv+RCf6RCv+ZEf+RC/+RCf+RC/+RC/6RCv+OB/+QC/+RC/+RCv+TC/+QC/+SC/+RC/+RCv+RCv+RCv+RC/6RCv6RCv6RCv6SCv6SCv2QC/+RCv+SCv+RC/+RCv2RCn+uAUwAAABAdFJOUwAFBwYIBAsBAgMNExEYOAoWHit4JUtXYhoQHCg1MT4gRmmHD1SlsbaUIi5BIy1DUltIb2VygY+Jm6KYrHyYuqzDURAFAAAB/klEQVQ4y6WVWZeiMBSEhQZmDAgJO7LIIrivuNv2/P9/NTdRp7VlTmfO1BMP36kKl5ui1XrQD9DPm+hzq1lXqn3TlW3mKCXLApMsU7aBpHaUehMlJvGNsq+mzE6mlKEwGZSVX0yZnSBKBkJFoIGCAiFDEgVm+oUDO4Q0FeMOCGNVQ+hq+kAyDuwCFfuE9ECE+FgNwJSRz5yCNMCmdmiCQnsKqIaURxKCKVeone4onMWRDoriWTgiHbWg5D0cDAXRQGqH2GasJ/N0tUrniR6bNpDIEIW7JQtGGnDjKEmdhQtaOGkSjYHU0Gc4GEoowF17rE+c/tKrs6z2ln1noo/tLg6QdLdsyzTYH5nRxHG9bGOBNpnnOpPIHPk0XG5fQUFSNEzCOHHcem1t8/0+31rr2nWSOCRYU6glBekJVX8609O+t37Pd8PTabjL39deP9VnU7CkL85A0SjghGC4zKx8eDiW5fEwzK1sCZZwygKyGSiISgDJ0Xzhbba7Q/mrqs7lYbfdeIt5BNmBAhNiIByx0zMhuQbD47kaDKrzESxryDZ7dELP4MrNrP2prAYfH4OqvOytzF39H/h9NO/LcI/nZeCXS/PAuT8h91Lc1ow0rRl5XDPuxeW+CtyXi/u68hfAn0pRnitFeakU7pJ6rj0E+lvt8RcpfzX/Q9l/8/v4DS6tX+XyhPN2AAAAAElFTkSuQmCC);
                                        background-size: 32px 32px;
                                        content: "";
                                        opacity: .5;
                                        pointer-events: none;
                                    }
                                    &::before {
                                        display: block;
                                        position: absolute;
                                        top: -3px;
                                        left: -3px;
                                        width: 14px;
                                        height: 14px;
                                        transform: scale(0);
                                        border-radius: 7px;
                                        background-color: #fff;
                                        background-color: rgba(255,255,255,.2);
                                        content: "";
                                        opacity: 0;
                                    }
                                    &:hover {
                                        &::after {
                                           opacity: 1; 
                                        }
                                        &::before {
                                           transform: scale(1);
                                            opacity: 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .control_playtime {
                font-size: 12px;
                color: rgba(255,255,255,.5);
                .control_playtime_item {
                    color: #fff
                }
            }
            .control_speed {
                position: relative;
                min-width: 52px;
                height: 100%;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                justify-content: center;
                align-items: center;
                &:hover {
                    .control_speed_lable {
                        background-color: #ff6429;
                    }
                    
                }
                .control_speed_lable {
                    min-width: 52px;    
                    height: 26px;
                    line-height: 26px;
                    border-radius: 26px;
                    color: #ececec;
                    text-align: center;
                    white-space: nowrap;
                    border-radius: 26px;
                    background-color: rgba(0,0,0,.5);

                }
                .control_speed_list {
                    display: none;
                    position: absolute;
                    bottom: 34px;
                    padding-bottom: 24px;
                    color: #eee;
                    cursor: default;
                    left: 50%;
                    width: auto;
                    transform: translate(-50%);
                    font-size: 0;
                    .speed_list_content {
                        background-color: rgba(0,0,0,.8);
                        border-radius: 4px;
                        padding: 6px 0;
                        .list_content_menuitem {
                            display: flex;
                            position: relative;
                            align-items: center;
                            justify-content: center;
                            min-width: 80px;
                            height: 40px;
                            margin: 0 6px;
                            padding: 0 22px;
                            font-size: 14px;
                            line-height: 40px;
                            text-align: center;
                            &:hover {
                                color: #ff6429;
                                cursor: pointer;
                            }
                        }
                        .activeSpeed {
                            color: #ff6429;
                        }
                    }
                }
            }
            .speedPopup {
                .control_speed_list {
                    display: block;
                }
            }
        }
        
        &:hover {
            cursor: pointer;
        }
    }

    .videocontrol_watermark {
        pointer-events: none;
        .videocontrol_watermark_img {
            pointer-events: none;
            position: absolute;
            height: 40px;
            right: 20px;
            top: 10px;
        }
    }

}
// 鼠标移入顶级元素
.videocontrol_inside {
    .videocontrol_gradient_bottom {
        opacity: 1;
        transition: opacity .5s cubic-bezier(0,0,.2,1);
    }
    .videocontrol_control {
        opacity: 1;
        transition: opacity .5s cubic-bezier(0,0,.2,1);
    }
}
</style>