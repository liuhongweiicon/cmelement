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
        <div class="videocontrol_video" @click="playStopHandler">
            <!-- 1、loadstart：视频查找。当浏览器开始寻找指定的音频/视频时触发，也就是当加载过程开始时 -->
            <!-- 2、durationchange：时长变化。当指定的音频/视频的时长数据发生变化时触发，加载后，时长由 NaN 变为音频/视频的实际时长 -->
            <!-- 3、loadedmetadata ：元数据加载。当指定的音频/视频的元数据已加载时触发，元数据包括：时长、尺寸（仅视频）以及文本轨道 -->
            <!-- 4、loadeddata：视频下载监听。当当前帧的数据已加载，但没有足够的数据来播放指定音频/视频的下一帧时触发 -->
            <!-- 5、progress：浏览器下载监听。当浏览器正在下载指定的音频/视频时触发 -->
            <!-- 6、canplay：可播放监听。当浏览器能够开始播放指定的音频/视频时触发 -->
            <!-- 7、canplaythrough：可流畅播放。当浏览器预计能够在不停下来进行缓冲的情况下持续播放指定的音频/视频时触发 -->
            <!-- 8、play：播放监听 -->
            <!-- 9、pause：暂停监听 -->
            <!-- 10、seeking：查找开始。当用户开始移动/跳跃到音频/视频中新的位置时触发 -->
            <!-- 11、seeked：查找结束。当用户已经移动/跳跃到视频中新的位置时触发 -->
            <!-- 12、waiting：视频加载等待。当视频由于需要缓冲下一帧而停止，等待时触发 -->
            <!-- 13、playing：当视频在已因缓冲而暂停或停止后已就绪时触发 -->
            <!-- 14、timeupdate：目前的播放位置已更改时，播放时间更新 -->
            <!-- 15、ended：播放结束 -->
            <!-- 16、error：播放错误 -->
            <!-- 17、volumechange：当音量更改时 -->
            <!-- 18、stalled：当浏览器尝试获取媒体数据，但数据不可用时 -->
            <!-- 19、ratechange：当视频的播放速度已更改时 -->
            <!-- 20、事件在视频/音频（audio/video）终止加载时触发。 -->
            <!-- 21、当浏览器刻意不获取媒体数据时触发。 -->
            <video 
                class="video_cell"
                :preload="preload" 
                :poster="poster" 
                :autoplay="autoplay"
                :loop="loop"
                :muted="muted"
                @loadstart="loadstart"
                @durationchange="durationchange"
                @loadedmetadata="loadedmetadata"
                @loadeddata="loadeddata"
                @progress="progress"
                @canplay="canplay"
                @canplaythrough="canplaythrough"
                @play="play"
                @pause="pause"
                @seeking="seeking"
                @seeked="seeked"
                @waiting="waiting"
                @playing="playing"
                @timeupdate="timeupdate"
                @ended="ended"
                @error="error"
                @volumechange="volumechange"
                @stalled="stalled"
                @ratechange="ratechange"
                @abort="abort"
                @suspend="suspend"
                >
                <source :src="src" type="video/mp4">
                <source :src="src" type="video/ogg">
                <source :src="src" type="video/WebM">
                <source v-if="isM3u8" :src="src" type="application/x-mpegURL">
            </video>
        </div>
        <!-- 控制面板 -->
        <div class="videocontrol_control">
            <div class="videocontrol_control_progress">
                <progressBar 
                    :bufferProgress="bufferProgress"
                    :progressNum="progressNum"
                    @customdown="customdownHandler" 
                    @custommove="custommoveHandler" 
                    @customup="customupHandler"
                    @customleave="customleaveHandler"></progressBar>
            </div>
            <div class="videocontrol_control_wrap">
                <div class="control_playbtn control_wrap_cell">
                    <svg class="iconfont" aria-hidden="true" @click="playStopHandler">     
                        <use :xlink:href="playStop ? '#iconzanting1' : '#iconkaishi1'"></use> 
                    </svg>
                </div>
                <div class="control_playnext control_wrap_cell">
                    <svg class="iconfont" aria-hidden="true">     
                        <use xlink:href="#iconNext"></use> 
                    </svg>
                </div>
                <div class="control_playloop control_wrap_cell">
                    <svg class="iconfont" aria-hidden="true" @click="loop = !loop">     
                        <use :xlink:href="loop ? '#iconcaozuo-xunhuan1' : '#iconNext'"></use>
                    </svg>
                </div>
                <div class="control_playtime">
                    <span class="control_playtime_item">{{currentTime || '00:00'}}</span>
                    <span>/</span>
                    <span>{{duration || '00:00'}}</span>
                </div>
            </div>
            <div class="videocontrol_control_wrap">
                <div class="control_speed" :class="{'speedPopup': speedPopup}"  @mouseleave="speedPopup = false" >
                    <div class="control_speed_lable" @click="speedPopup = !speedPopup">{{ activeSpeed == 1 ? '倍速' : activeSpeed + 'X'}}</div>
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
                <div class="control_wrap_cell" @mouseleave="soundPopup = false">
                    
                    <svg class="iconfont" aria-hidden="true"  @click="soundHandler"  >     
                        <use :xlink:href="muted ? '#iconfanhui' : '#iconline_shengyin'"></use>
                    </svg>
                    <div class="control_change" :style="{display: soundPopup ? 'block' : 'none'}" >
                        <div class="control_change_drag" id="control_change_drag">
                            <progressBar 
                                direction="vertical"
                                height="90px"
                                width="4px"
                                thumbHW="10px"
                                moveId="control_change_drag"
                                
                                :progressNum="volumeNum"
                                @customdown="customdownHandler" 
                                @custommove="custommoveHandler" 
                                @customup="customupHandler"
                                @customleave="customleaveHandler">
                            </progressBar>
                        </div>
                    </div>
                </div>
                <div class="control_playloop control_wrap_cell">
                    <svg class="iconfont" aria-hidden="true">     
                        <use :xlink:href="browserFullscreen ? '#icontuichuquanping-02' : '#iconquanping'"></use> 
                    </svg>
                </div>
                <div class="control_playloop control_wrap_cell">
                    <svg class="iconfont" aria-hidden="true" @click="controlFullScreen">     
                        <use :xlink:href="windowFullscreen ? '#iconcompress' : '#iconquanping_o'"></use> 
                    </svg>
                </div>
            </div>
        </div>

        <slot name="loadeddata">
            <div class="videocontrol_loadeddata"  v-show="videoLoadeddata && playStop">
                <div class="loadeddata_cell"></div>
                <div class="loadeddata_cell"></div>
                <div class="loadeddata_cell"></div>
            </div>
        </slot>

        <slot name="pausePlay">
            <div class="videocontrol_pausePlay" :class="playStop ? 'videocontrol_playstate' : 'videocontrol_pausestate'">
                <div class="videocontrol_pausePlay_strip">
                </div>
            </div>
        </slot>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
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
    components: {
        progressBar: () => import('./progressBar.vue'), // 进度条组件
    },
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
            default: false
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
            default: false
        },
        /**
         * 视频地址
         */
        src: {
            type: String,
            default: 'https://downloadfile.e-eduspace.com/%E9%80%9F%E8%AF%BB%E6%B3%951.mp4'
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
            playStop: this.autoplay || false, // 暂停播放状态  true => 播放  false => 暂停
            speedPopup: false, // 点击倍速状态 => true  => 弹出倍速选择框
            activeSpeed: '1.0', // 当前选中倍速
            soundPopup: false, //  点击声音状态 => true  => 弹出声音选择框
            dragRange: null, // 音量鼠标mouseMove事件对象
            bufferProgress: [{  // 视频缓冲进度
                left: '0%', // 起始位置
                width: '0%' // 宽度
            }],
            volumeNum: '50%', // 音量进度条位置
            progressNum: '0%', // 视频播放进度条位置
            direction: 'vertical', // 进度条方向

            videoInfo: null, // 视频对象
            videoLoadeddata: true, // 视频是否准备就绪
            duration: 0, // 视频时长
            currentTime: 0, // 视频当前播放时间
            mouseDown: false, // 鼠标是否按下 = true 鼠标按下

            browserFullscreen: false, // 浏览器全屏
            windowFullscreen: false, // 系统全屏
        }
    },
    mounted() {
        window.document.addEventListener('keydown', this.escapeHandler());
    },
    methods: {
        /**
         * 点击倍速，切换倍速
         */
        speedHandler(item) {
            this.activeSpeed = item;
            this.videoInfo.playbackRate = item;
        },
        /**
         * 点击声音图标按钮
         */
        soundHandler() {
            if (this.soundPopup) {
                this.muted = true;
            }
            if (!this.soundPopup && this.muted) {
                this.muted = false;
            }
            this.soundPopup = !this.soundPopup;
        },
        /**
         * 点击开始播放或暂停播放
         */
        playStopHandler() {
            if (this.playStop) {
                this.videoInfo.pause();
            } else {
                this.videoInfo.play();
            }
            this.playStop = !this.playStop;
        },

        /**
         * 进度条鼠标按下事件
         */
        customdownHandler(item) {
            if (item.direction == 'vertical') {
                this.muted = false;
                this.videoInfo.volume = item.progress.replace("%", '') / 100;
            } else {
                if (this.playStop) {
                    this.mouseDown = true;
                    this.videoInfo.pause()
                }
                this.progressNum = item.progress;
            }
        },
        /**
         * 进度条鼠标移动事件
         */
        custommoveHandler(item) {
            if (item.direction == 'vertical') {
                this.volumeNum = item.progress;
            }
            
        },
        /**
         * 进度条鼠标抬起事件
         */
        customupHandler(item) {
            if (item.direction == 'vertical') {
                this.muted = false;
                this.videoInfo.volume = item.progress.replace("%", '') / 100;
            } else {
                this.videoInfo.currentTime = this.videoInfo.duration * (item.progress.replace("%", '') / 100);
                
                if (this.playStop) {
                    this.mouseDown = false;
                    this.videoInfo.play()
                }
            }
            
        },
        /**
         * 进度条鼠标移出事件
         */
        customleaveHandler(item) {
            if (item.direction == 'vertical') {
                this.volumeNum = item.progress;
            } else {
                this.videoInfo.currentTime = this.videoInfo.duration * (item.progress.replace("%", '') / 100);
                
                if (this.playStop) {
                    this.mouseDown = false;
                    this.videoInfo.play()
                }
            }
            
        },
        escapeHandler(e) {
            debugger
            this.windowFullscreen = false;
        },
        // 全屏 / 退出全屏
        controlFullScreen () {
            let ELE = document.querySelector('.video_cell');
            if (!this.windowFullscreen) {
                this.windowFullscreen = true;
                console.log('进入全屏')
                if (ELE.requestFullscreen) {
                ELE.requestFullscreen();
                } else if (ELE.mozRequestFullScreen) {
                ELE.mozRequestFullScreen();
                } else if (ELE.webkitRequestFullscreen) {
                ELE.webkitRequestFullscreen();
                } else if (ELE.msRequestFullscreen) {
                ELE.msRequestFullscreen();
                } else if (ELE.oRequestFullscreen) {
                ELE.oRequestFullscreen();
                } else {
                alert('当前视频不支持全屏')
                }
            } else {
                this.windowFullscreen = false;
                if (document.exitFullScreen) {
                document.exitFullScreen();
                } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
                }
                
            }


        },
        


        /**
         * 获取视频缓存进度
         */
        bufferProgressChange() {
            let temp = []
            for (let i = 0; i < this.videoInfo.buffered.length; i++) {
                const start = this.videoInfo.buffered.start(i);
                const end = this.videoInfo.buffered.end(i);
                const width = (end - start) / this.videoInfo.duration * 100 + '%';
                const left = start / this.videoInfo.duration * 100 + '%';
                temp.push({left, width})
            }

            this.bufferProgress = temp;
        },

        /**
         * 1、loadstart：视频查找。当浏览器开始寻找指定的音频/视频时触发，也就是当加载过程开始时
         */
        loadstart(e) {
            console.log(e, 'loadstart')
            this.$emit('loadstart', e);
            
            this.videoInfo = document.querySelector('.video_cell');
            
            this.videoInfo.volume = 0.5;
        },
        /**
         * 2、progress：浏览器下载监听。当浏览器正在下载指定的音频/视频时触发
         */
        progress(e) {
            console.log(e, 'progress')
            this.$emit('progress', e);
            // 更新视频缓存进度
            this.bufferProgressChange();
        },

        /**
         * 3、durationchange：时长变化。当指定的音频/视频的时长数据发生变化时触发，加载后，时长由 NaN 变为音频/视频的实际时长
         */
        durationchange(e) {
            console.log(e, 'durationchange');
            this.duration =  this.formatSeconds(this.videoInfo.duration, true);
            this.$emit('durationchange', e);
        },
        
        /**
         * 4、loadedmetadata ：元数据加载。当指定的音频/视频的元数据已加载时触发，元数据包括：时长、尺寸（仅视频）以及文本轨道
         */
        loadedmetadata(e) {
            console.log(e, 'loadedmetadata')
            this.$emit('loadedmetadata', e);
        },

        /**
         * 5、loadeddata：视频下载监听。当前帧的数据已加载，但没有足够的数据来播放指定音频/视频的下一帧时触发
         */
        loadeddata(e) {
            this.videoLoadeddata = true;
            console.log(e, 'loadeddata')
            this.$emit('loadeddata', e)
        },


        /**
         * 6、canplay：可播放监听。当浏览器能够开始播放指定的音频/视频时触发
         */
        canplay(e) {
            this.videoLoadeddata = false;
            console.log(e, 'canplay')
            this.$emit('canplay', e)
        },

        /**
         * 7、canplaythrough：可流畅播放。当浏览器预计能够在不停下来进行缓冲的情况下持续播放指定的音频/视频时触发
         */
        canplaythrough(e) {
            console.log(e, 'canplaythrough')
            this.$emit('canplaythrough', e)
        },

        /**
         * 8、play：播放监听
         */
        play(e) {
            console.log(e, 'play')
            this.$emit('play', e)
        },

        /**
         * 9、pause：暂停监听
         */
        pause(e) {
            console.log(e, 'pause')
            this.$emit('pause', e)
        },

        /**
         * 10、seeking：查找开始。当用户开始移动/跳跃到音频/视频中新的位置时触发
         */
        seeking(e) {
            console.log(e, 'seeking')
            this.$emit('seeking', e)
        },

        /**
         * 11、seeked：查找结束。当用户已经移动/跳跃到视频中新的位置时触发
         */
        seeked(e) {
            console.log(e, 'seeked')
            
            this.$emit('seeked', e)
        },

        /**
         * 12、waiting：视频加载等待。当视频由于需要缓冲下一帧而停止，等待时触发
         */
        waiting(e) {
            this.videoLoadeddata = true;
            console.log(e, 'waiting')
            this.$emit('waiting', e)
        },

        /**
         * 13、playing：当视频在已因缓冲而暂停或停止后已就绪时触发
         */
        playing(e) {
            console.log(e, 'playing')
            this.$emit('playing', e)
        },

        /**
         * 14、timeupdate：目前的播放位置已更改时，播放时间更新
         */
        timeupdate(e) {
            if (this.mouseDown) return
            this.progressNum = this.videoInfo.currentTime / this.videoInfo.duration * 100 + '%';
            this.currentTime = this.formatSeconds(this.videoInfo.currentTime, true);
            this.$emit('timeupdate', e)
        },

        /**
         * 15、ended：播放结束
         */
        ended(e) {
            console.log(e, 'ended')
            // 播放结束改变按钮状态
            this.playStop = false;
            this.$emit('ended', e)
        },

        /**
         * 16、error：播放错误
         */
        error(e) {
            console.log(e, 'error')
            this.$emit('error', e)
        },

        /**
         * 17、volumechange：当音量更改时
         */
        volumechange(e) {
            console.log(e, 'volumechange')
            this.$emit('volumechange', e)
        },

        /**
         * 18、stalled：当浏览器尝试获取媒体数据，但数据不可用时
         */
        stalled(e) {
            console.log(e, 'stalled')
            this.$emit('stalled', e)
        },

        /**
         * 19、ratechange：当视频的播放速度已更改时
         */
        ratechange(e) {
            console.log(e, 'ratechange')
            this.$emit('ratechange', e)
        },
        /**
         * 20、事件在视频/音频（audio/video）终止加载时触发。	
         */
        abort(e) {

            console.log(e, 'abort')
            this.$emit('abort', e)
        },
        
        suspend(e) {

            console.log(e, 'suspend')
            this.$emit('suspend', e)

        }

    },
    beforeDestroy(){
        window.document.removeEventListener('keydown', this.escapeHandler())
    }
    
}
</script>

<style lang="less" scoped>
.videocontrol {
    position: relative;
    background: #1c1d30;
    margin: auto;
    user-select: none;
    // overflow: hidden;
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
        height: 48px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        box-sizing: border-box;
        // opacity: 0;
        .videocontrol_control_progress {
            position: absolute;
            top: -8px;
            left: 0;
            width: 100%;
            height: 8px;
            padding: 0;
            vertical-align: top;
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
                    &:hover {
                         fill: #ff6429;
                    }
                }
                .control_change {
                    z-index: 20;
                    position: absolute;
                    bottom: 100%;
                    width: 100%;
                    padding-bottom: 6px;
                    color: #eee;
                    left: 50%;
                    width: 42px;
                    transform: translate(-50%);
                    cursor: default;
                    .control_change_drag {
                        border-radius: 4px;
                        overflow: hidden;
                        background-color: rgba(0,0,0,.8);
                        height: 90px;
                        padding: 10px 0;
                        display: flex;
                        justify-content: center;
                        // .change_drag_range {
                        //     position: relative;
                        //     width: 4px;
                        //     height: 90px;
                        //     margin: 10px 19px;
                        //     border-radius: 2px;
                        //     background-color: #a6a6a6;
                        //     background-color: rgba(166,166,166,.5);
                        //     cursor: pointer;
                        //     .drag_range_current {
                        //         z-index: 1;
                        //         position: absolute;
                        //         bottom: 0;
                        //         left: 0;
                        //         width: 100%;
                        //         border-radius: 2px;
                        //         background-color: #ff6429;
                        //         height: 56%;
                        //         pointer-events: none;
                        //         .range_current_handle {
                        //             position: absolute;
                        //             top: -4px;
                        //             left: -2px;
                        //             width: 8px;
                        //             height: 8px;
                        //             border-radius: 100%;
                        //             background-color: #fff;
                        //             cursor: pointer;
                        //             &::after {
                        //                 display: block;
                        //                 z-index: -1;
                        //                 position: absolute;
                        //                 top: -12px;
                        //                 left: -12px;
                        //                 width: 32px;
                        //                 height: 32px;
                        //                 background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADAUExURQAAAP+ZAP+RAP9/AP+aAP9/AP+OCP//AP9/AP+qAP+QDf+SDP+TDv+TCv+RCP+ZAP+TC/+TCP+QC/+RCv+SCf+SCv+QCv+RCv+TCf+PD/+PCP+RDP+RCf+RCv+PCf+RB/+RCv+RCf6RCv+ZEf+RC/+RCf+RC/+RC/6RCv+OB/+QC/+RC/+RCv+TC/+QC/+SC/+RC/+RCv+RCv+RCv+RC/6RCv6RCv6RCv6SCv6SCv2QC/+RCv+SCv+RC/+RCv2RCn+uAUwAAABAdFJOUwAFBwYIBAsBAgMNExEYOAoWHit4JUtXYhoQHCg1MT4gRmmHD1SlsbaUIi5BIy1DUltIb2VygY+Jm6KYrHyYuqzDURAFAAAB/klEQVQ4y6WVWZeiMBSEhQZmDAgJO7LIIrivuNv2/P9/NTdRp7VlTmfO1BMP36kKl5ui1XrQD9DPm+hzq1lXqn3TlW3mKCXLApMsU7aBpHaUehMlJvGNsq+mzE6mlKEwGZSVX0yZnSBKBkJFoIGCAiFDEgVm+oUDO4Q0FeMOCGNVQ+hq+kAyDuwCFfuE9ECE+FgNwJSRz5yCNMCmdmiCQnsKqIaURxKCKVeone4onMWRDoriWTgiHbWg5D0cDAXRQGqH2GasJ/N0tUrniR6bNpDIEIW7JQtGGnDjKEmdhQtaOGkSjYHU0Gc4GEoowF17rE+c/tKrs6z2ln1noo/tLg6QdLdsyzTYH5nRxHG9bGOBNpnnOpPIHPk0XG5fQUFSNEzCOHHcem1t8/0+31rr2nWSOCRYU6glBekJVX8609O+t37Pd8PTabjL39deP9VnU7CkL85A0SjghGC4zKx8eDiW5fEwzK1sCZZwygKyGSiISgDJ0Xzhbba7Q/mrqs7lYbfdeIt5BNmBAhNiIByx0zMhuQbD47kaDKrzESxryDZ7dELP4MrNrP2prAYfH4OqvOytzF39H/h9NO/LcI/nZeCXS/PAuT8h91Lc1ow0rRl5XDPuxeW+CtyXi/u68hfAn0pRnitFeakU7pJ6rj0E+lvt8RcpfzX/Q9l/8/v4DS6tX+XyhPN2AAAAAElFTkSuQmCC);
                        //                 background-size: 32px 32px;
                        //                 content: "";
                        //                 opacity: .5;
                        //                 pointer-events: none;
                        //             }
                        //             &::before {
                        //                 display: block;
                        //                 position: absolute;
                        //                 top: -3px;
                        //                 left: -3px;
                        //                 width: 14px;
                        //                 height: 14px;
                        //                 transform: scale(0);
                        //                 border-radius: 7px;
                        //                 background-color: #fff;
                        //                 background-color: rgba(255,255,255,.2);
                        //                 content: "";
                        //                 opacity: 0;
                        //             }
                        //             &:hover {
                        //                 &::after {
                        //                    opacity: 1; 
                        //                 }
                        //                 &::before {
                        //                    transform: scale(1);
                        //                     opacity: 1;
                        //                 }
                        //             }
                        //         }
                        //     }
                        // }
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
                    &:hover {
                        background-color: #ff6429;
                    }

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
    .videocontrol_loadeddata {
        pointer-events: none;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: space-evenly;
        .loadeddata_cell {
            height: 15px;
            width: 15px;
            border-radius: 15px;
            // transform: skew(-15deg);
            margin-left: 10px;
            &:nth-child(1) {
                background: #ff6429;
                transform: scale(0);
                opacity: 0;
                animation: scale .9s infinite;
            }
            &:nth-child(2) {
                background: #9deb1d;
                transform: scale(0);
                animation: scale .9s .15s infinite;
            }
            &:nth-child(3) {
                background: #30aafb;
                transform: scale(0);
                animation: scale .9s .3s infinite;
            }
            @keyframes scale {
                0% {
                    transform: scale(0);
                    opacity: 0;
                }
                50% {
                    transform: scale(1);
                    opacity: 1;
                }
                100% {
                    transform: scale(0);
                    opacity: 0;
                }
            }
        }
    }
    .videocontrol_pausePlay {
        pointer-events: none;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 4em;
        width: 4em;
        border-radius: 50%;
        background: rgba(0,0,0,.5);
        border: 1px solid #9191916e;
        transition: all .15s;


        .videocontrol_pausePlay_strip {
            background-color: rgba(255, 255, 255, 1);
            width:  .8em;
            height: 2em;
            border-radius: .8em;
            position: absolute;
            top: 1em;
            left: 1.3em;
            transform: scale(.8);
            &::after, &::before {
                content: '';
                position: absolute;
                width:  .8em;
                height: 2em;
                border-radius:.8em;
                background-color: rgba(255, 255, 255, 1);
                transform: rotate(-60deg);
                transform-origin: .4em .4em;
            }
            &::before {
                transform: rotate(60deg);
                transform-origin: .4em 1.6em;
            }

        }
    }
    .videocontrol_playstate {
        transform: scale(0) translate(-50%, -50%);
        opacity: 0;
    }
    .videocontrol_pausestate {
        transform: scale(1) translate(-50%, -50%);
        opacity: 1;
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