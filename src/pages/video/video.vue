<template>
<div class="videoControlBox">
    <div 
        class="videoControl" 
        ref="videoControl"
        :style="{height: height, width: width}" 
        :class="{'videoControl_inside': inside, 'h5Full': !isPC && windowFullscreen}" 
        @mouseenter="inside = true" 
        @mouseleave="inside = false">
        <!-- 底部阴影 -->
        <div class="videoControl_gradient_bottom">
        </div>
        <!-- 视频块 -->
        <div class="videoControl_video" @click="playStopHandler">
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
                x5-video-player-type="h5"
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
            <!-- <video src=""></video> -->
        </div>
        <!-- 控制面板 -->
        <div class="videoControl_control">
            <div class="videoControl_control_progress">
                <!-- 播放进度条 -->
                <div class="videoControl_control_progress_playRate">
                    <div class="videoControl_control_progress_playRate_buffer" :style="{width: `${bufferValue}%`}"></div>
                    <div class="videoControl_control_progress_playRate_rate" :style="{width: `${rangeValue}%`}"></div>
                    <div class="videoControl_control_progress_playRate_circle" :style="{left: `calc(${rangeValue}% - ${rangeValue/10}px)`}"></div>
                    <input @input="rangeInput"  @change="rangeChange" class="videoControl_control_progress_playRate_input" type="range" v-model="rangeValue" :max-value="maxValue" min-value="0" style="width: 100%">
                </div>
            </div>
            <div class="videoControl_control_wrap">
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
            <!-- @mouseleave="speedPopup = false" -->
            <div class="videoControl_control_wrap">
                <div class="control_speed" :class="{'speedPopup': speedPopup}" >
                    <div class="control_speed_lable" @click="showSpeedPopup">{{ activeSpeed == 1 ? '倍速' : activeSpeed + 'X'}}</div>
                    <div class="control_speed_list"  >
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

                <div class="control_wrap_cell">
                    <svg class="iconfont" aria-hidden="true"  @click="soundHandler"  >     
                        <use :xlink:href="muted ? '#iconfanhui' : '#iconline_shengyin'"></use>
                    </svg>
                    <!-- 声音进度条 -->
                    <!--  -->
                    <div class="control_change" @mouseleave="soundPopup = false" :style="{display: soundPopup ? 'block' : 'none'}">
                        <div class="control_change_drag" id="control_change_drag">
                            <div class="control_change_drag_voiceRate-bg"></div>
                            <div class="control_change_drag_voiceRate-rate"  :style="{height: `${voiceRangeValue}%`}"></div>
                            <div class="control_change_drag_voiceRate-circle" :style="{bottom: `calc(${voiceRangeValue}% - ${voiceRangeValue/10}px)`}"></div>
                            <input @change="voiceRangeChange" class="control_change_drag_voiceRate-input" type="range" v-model="voiceRangeValue" :max-value="voiceMaxValue" min-value="0">
                        </div>
                    </div>
                </div>
                <!-- <div class="control_playloop control_wrap_cell">
                    <svg class="iconfont" aria-hidden="true">     
                        <use :xlink:href="browserFullscreen ? '#icontuichuquanping-02' : '#iconquanping'"></use> 
                    </svg>
                </div> -->
                <div class="control_playloop control_wrap_cell">
                    <svg class="iconfont" aria-hidden="true" @click="controlFullScreen">     
                        <use :xlink:href="windowFullscreen ? '#iconcompress' : '#iconquanping_o'"></use> 
                    </svg>
                </div>
            </div>
        </div>
        <template v-if="videoLoadeddata && playStop">
            <slot name="loadeddata">
                <div class="videoControl_loadeddata">
                    <div class="loadeddata_cell"></div>
                    <div class="loadeddata_cell"></div>
                    <div class="loadeddata_cell"></div>
                </div>
            </slot>

            <slot name="pausePlay">
                <div class="videoControl_pausePlay" :class="playStop ? 'videoControl_playstate' : 'videoControl_pausestate'">
                    <div class="videoControl_pausePlay_strip">
                    </div>
                </div>
            </slot>
        </template>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
        <!-- 水印 -->
        <div class="videoControl_watermark">
            <img class="videoControl_watermark_img" :src="watermark" alt="">
        </div>
    </div>
    <input v-if="!isPC && windowFullscreen" @input="rangeInput"  @change="rangeChange" class="videoControlBoxInput" type="range" v-model="rangeValue" :max-value="maxValue" min-value="0" style="width: 100%">
        </div>

</template>

<script>
require('./hls.js')
export default {
    name: 'videoControl',
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
            default: 'auto'
        },
        /**
         * 视频宽度
         */
        width: {
            type: String,
            default: '100vw'
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
            progressNum: '0%', // 视频播放进度条位置
            direction: 'vertical', // 进度条方向

            videoInfo: null, // 视频对象
            videoLoadeddata: true, // 视频是否准备就绪
            duration: 0, // 视频时长
            currentTime: 0, // 视频当前播放时间
            mouseDown: false, // 鼠标是否按下 = true 鼠标按下

            browserFullscreen: false, // 浏览器全屏
            windowFullscreen: false, // 系统全屏
            rangeValue: 0,  // 播放进度
            maxValue: 100,
            isDragRange: true,  // 拖拽进度条时
            bufferValue: 0, // 缓存进度
            voiceRangeValue: 0, // 声音大小
            voiceMaxValue: 100, // 声音最大值
            isPC: true
        }
    },
    mounted() {
        window.document.addEventListener('keydown', this.escapeHandler());
        this.isPC = parseInt(document.body.offsetWidth) < 1024 ? false : true;

        this.addEventListenerScreen();
    },
    methods: {
        addEventListenerScreen(){
            document.addEventListener("fullscreenchange", () => {
                this.windowFullscreen = !this.windowFullscreen;
            });

            document.addEventListener("mozfullscreenchange", () => {
                this.windowFullscreen = !this.windowFullscreen;
            });

            document.addEventListener("webkitfullscreenchange", () => {
                this.windowFullscreen = !this.windowFullscreen;
            });

            document.addEventListener("msfullscreenchange", () => {
                this.windowFullscreen = !this.windowFullscreen;
            });
        },
        // 点击进度条
        rangeChange(val){
            let ELE = document.querySelector('.videoControl');
            const fullScreenEle = document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

            console.log('[ this.$refs.videoControl ] >', fullScreenEle)
            this.isDragRange = true;
            this.videoInfo.currentTime = (this.videoInfo.duration * (Number(this.rangeValue) / 100)).toFixed(6)
        },
        rangeInput(){
            this.isDragRange = false;
        },
        voiceRangeChange(){
            this.videoInfo.volume = Number(this.voiceRangeValue) / 100;
        },
        showSpeedPopup(){
            this.soundPopup = false;
            this.speedPopup = !this.speedPopup;
        },
        /**
         * 点击倍速，切换倍速
         */
        speedHandler(item) {
            this.activeSpeed = item;
            this.videoInfo.playbackRate = item;
            let timer = setTimeout(() => {
                this.speedPopup = false;
                clearTimeout(timer);
            },1000)
        },
        /**
         * 点击声音图标按钮
         */
        soundHandler() {
            this.speedPopup = false;
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
            this.speedPopup = false;
            this.soundPopup = false;
            this.playStop = !this.playStop;
        },
        escapeHandler(e) {
            // debugger
            this.windowFullscreen = false;
        },
        // 全屏 / 退出全屏
        controlFullScreen () {
            // let ELE = document.querySelector('.video_cell');
            if(!this.isPC) {
                this.windowFullscreen = !this.windowFullscreen;
                return;
            };
            let ELE = document.querySelector('.videoControl');

            if (!this.windowFullscreen) {
                // this.windowFullscreen = true;
                // console.log('进入全屏')
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
                // this.windowFullscreen = false;
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
            // debugger
            let temp = []
        // 先不计算缓存
            // for (let i = 0; i < this.videoInfo.buffered.length; i++) {
            //     const start = this.videoInfo.buffered.start(i);
            //     const end = this.videoInfo.buffered.end(i);
            //     console.log('[ start,end ] >', start,end)
            //     const width = (end - start) / this.videoInfo.duration * 100 + '%';
            //     const left = start / this.videoInfo.duration * 100 + '%';
            //     temp.push({left, width})
            // }
            // console.log('bufferProgress',temp, this.videoInfo.buffered);
            this.bufferProgress = temp;
        },

        /**
         * 1、loadstart：视频查找。当浏览器开始寻找指定的音频/视频时触发，也就是当加载过程开始时
         */
        loadstart(e) {
            // console.log(e, 'loadstart')
            this.$emit('loadstart', e);
            
            this.videoInfo = document.querySelector('.video_cell');
            
            this.videoInfo.volume = 0.5;
        },
        /**
         * 2、progress：浏览器下载监听。当浏览器正在下载指定的音频/视频时触发
         */
        progress(e) {
            // console.log(e, 'progress')
            this.$emit('progress', e);
            // 更新视频缓存进度
            this.bufferProgressChange();
        },

        /**
         * 3、durationchange：时长变化。当指定的音频/视频的时长数据发生变化时触发，加载后，时长由 NaN 变为音频/视频的实际时长
         */
        durationchange(e) {
            // console.log(e, 'durationchange');
            this.duration =  this.formatSeconds(this.videoInfo.duration, true);
            this.maxValue = this.videoInfo.duration || 0;
            // console.log('this.maxValue', this.maxValue);
            this.$emit('durationchange', e);
        },
        
        /**
         * 4、loadedmetadata ：元数据加载。当指定的音频/视频的元数据已加载时触发，元数据包括：时长、尺寸（仅视频）以及文本轨道
         */
        loadedmetadata(e) {
            // console.log(e, 'loadedmetadata')
            this.$emit('loadedmetadata', e);
        },

        /**
         * 5、loadeddata：视频下载监听。当前帧的数据已加载，但没有足够的数据来播放指定音频/视频的下一帧时触发
         */
        loadeddata(e) {
            this.videoLoadeddata = true;
            // console.log(e, 'loadeddata')
            this.$emit('loadeddata', e)
        },


        /**
         * 6、canplay：可播放监听。当浏览器能够开始播放指定的音频/视频时触发
         */
        canplay(e) {
            this.videoLoadeddata = false;
            // console.log(e, 'canplay')
            this.$emit('canplay', e)
        },

        /**
         * 7、canplaythrough：可流畅播放。当浏览器预计能够在不停下来进行缓冲的情况下持续播放指定的音频/视频时触发
         */
        canplaythrough(e) {
            // console.log(e, 'canplaythrough')
            this.$emit('canplaythrough', e)
        },

        /**
         * 8、play：播放监听
         */
        play(e) {
            // console.log(e, 'play')
            this.$emit('play', e)
        },

        /**
         * 9、pause：暂停监听
         */
        pause(e) {
            // console.log(e, 'pause')
            this.$emit('pause', e)
        },

        /**
         * 10、seeking：查找开始。当用户开始移动/跳跃到音频/视频中新的位置时触发
         */
        seeking(e) {
            // console.log(e, 'seeking')
            this.$emit('seeking', e)
        },

        /**
         * 11、seeked：查找结束。当用户已经移动/跳跃到视频中新的位置时触发
         */
        seeked(e) {
            // console.log(e, 'seeked')
            this.$emit('seeked', e)
        },

        /**
         * 12、waiting：视频加载等待。当视频由于需要缓冲下一帧而停止，等待时触发
         */
        waiting(e) {
            this.videoLoadeddata = true;
            // console.log(e, 'waiting')
            this.$emit('waiting', e)
        },

        /**
         * 13、playing：当视频在已因缓冲而暂停或停止后已就绪时触发
         */
        playing(e) {
            // console.log(e, 'playing')
            this.$emit('playing', e)
        },

        /**
         * 14、timeupdate：目前的播放位置已更改时，播放时间更新
         */
        timeupdate(e) {
            if (this.mouseDown) return
            this.progressNum = this.videoInfo.currentTime / this.videoInfo.duration * 100 + '%';
            if(this.isDragRange){
                this.rangeValue = this.videoInfo.currentTime / this.videoInfo.duration * 100;
            }
            this.currentTime = this.formatSeconds(this.videoInfo.currentTime, true);
            this.$emit('timeupdate', e)
        },

        /**
         * 15、ended：播放结束
         */
        ended(e) {
            // console.log(e, 'ended')
            // 播放结束改变按钮状态
            this.playStop = false;
            this.$emit('ended', e)
        },

        /**
         * 16、error：播放错误
         */
        error(e) {
            // console.log(e, 'error')
            this.$emit('error', e)
        },

        /**
         * 17、volumechange：当音量更改时
         */
        volumechange(e) {
            // console.log(e, 'volumechange')
            this.$emit('volumechange', e)
        },

        /**
         * 18、stalled：当浏览器尝试获取媒体数据，但数据不可用时
         */
        stalled(e) {
            // console.log(e, 'stalled')
            this.$emit('stalled', e)
        },

        /**
         * 19、ratechange：当视频的播放速度已更改时
         */
        ratechange(e) {
            // console.log(e, 'ratechange')
            this.$emit('ratechange', e)
        },
        /**
         * 20、事件在视频/音频（audio/video）终止加载时触发。	
         */
        abort(e) {

            // console.log(e, 'abort')
            this.$emit('abort', e)
        },
        
        suspend(e) {

            // console.log(e, 'suspend')
            this.$emit('suspend', e)

        }

    },
    beforeDestroy(){
        window.document.removeEventListener('keydown', this.escapeHandler())
    }
    
}
</script>

<style lang="scss" scoped>
.videoControl {
    position: relative;
    background: #1c1d30;
    margin: auto;
    user-select: none;
    // overflow: hidden;
    .videoControl_gradient_bottom {
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
    .videoControl_video {
        height: 100%;
        width: 100%;
        .video_cell {
            height: 100%;
            width: 100%;
            object-fit: fill;
        }
    }

    .videoControl_control{
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
        .videoControl_control_progress {
            position: absolute;
            top: -8px;
            left: 10px;
            width: calc(100% - 20px);
            height: 8px;
            padding: 0;
            vertical-align: top;
            &_playRate {
                position: absolute;
                left: 0;
                right: 0;
                top: 0px;
                height: 4px;
                background-color: rgba(255,255,255,.35);
                // &_rate {
                //     height: 4px;
                //     width: 0;
                //     background-color: #ff6429;
                //     cursor: pointer;
                // }
                &_rate, &_buffer {
                    position: absolute;
                    height: 100%;
                    width: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    background-color:#ff6429;
                    cursor: pointer;
                }
                &_buffer {
                    background-color: #fff;
                }
                &_circle {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    display: none;
                    width: 12px;
                    height: 12px;
                    border-radius: 100%;
                    background-color: #ff6429;
                    box-shadow: 0px 0px 2px 4px rgba(254,100,41,.3);
                    cursor: pointer;

                }
                &_input {
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 99;
                    margin: 0;
                    padding: 0;
                    opacity: 0;
                    cursor: pointer;
                }
            }
        }
        .videoControl_control_progress:hover {
            .videoControl_control_progress_playRate {
                height: 8px;
                transition: height .2s ease;
                // &_rate,&_buffer {
                //     height: 8px;
                //     transition: height .2s ease;
                // }
                &_circle{
                    display: inline-block;
                }
            }
        }
        .videoControl_control_wrap {
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
                    width: 42px;
                    height: 120px;
                    top: -118px;
                    background-color: rgba(0,0,0,.8);
                    border-radius: 4px;
                    padding: 10px 0px;
                    box-sizing: border-box;
                    .control_change_drag {
                        height: 100%;
                        width: 100%;
                        position: relative;
                        cursor: pointer;
                        &_voiceRate-bg,&_voiceRate-rate {
                            position: absolute;
                            left: 50%;
                            transform: translateX(-50%);
                            height: 100%;
                            width: 4px;
                            background-color: rgba(255,255,255,.35);
                        }
                        &_voiceRate-rate {
                            bottom: 0;
                        }
                        &_voiceRate-input {
                            position: absolute;
                            top: 50%;
                            transform: translateY(-50%);
                            width: 104px;
                            height: 8px;
                            margin: 0;
                            padding: 0;
                            z-index: 26;
                            cursor: pointer;
                            transform: rotateZ(-90deg);
                            transform-origin: center bottom;
                            left: -27px;
                            top: 40px;
                            opacity: 0;
                        }
                        &_voiceRate-rate {
                            background-color: #ff6429;
                            z-index: 22;
                        }
                        &_voiceRate-circle {
                            position: absolute;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 10px;
                            height: 10px;
                            border-radius: 100%;
                            background-color: #ff6429;
                            z-index: 23;
                        }
                    }
                    .control_change_drag:hover {
                        .control_change_drag_voiceRate-circle {
                            box-shadow: 0px 0px 2px 4px rgba(254,100,41,.3);
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
                    cursor: pointer;
                    &:hover {
                        background-color: #ff6429;
                    }

                }
                .control_speed_list {
                    display: none;
                    position: absolute;
                    bottom: 44px;
                    // padding-bottom: 24px;
                    color: #eee;
                    cursor: default;
                    left: 50%;
                    width: auto;
                    transform: translate(-50%);
                    font-size: 0;
                    z-index: 30;
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

    .videoControl_watermark {
        pointer-events: none;
        .videoControl_watermark_img {
            pointer-events: none;
            position: absolute;
            height: 40px;
            right: 20px;
            top: 10px;
        }
    }
    .videoControl_loadeddata {
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
    .videoControl_pausePlay {
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


        .videoControl_pausePlay_strip {
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
    .videoControl_playstate {
        transform: scale(0) translate(-50%, -50%);
        opacity: 0;
    }
    .videoControl_pausestate {
        transform: scale(1) translate(-50%, -50%);
        opacity: 1;
    }
    input[type=range] {
        // -webkit-appearance: none;/*清除系统默认样式*/
        // width: 1.8rem;
        background: -webkit-linear-gradient(#ddd, #ddd) no-repeat, #ddd;/*设置左边颜色为#61bd12，右边颜色为#ddd*/
        background-size: 75% 100%;/*设置左右宽度比例*/
        height: 8px;/*横条的高度*/
        // border-radius: 10px;
    }
    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;/*清除系统默认样式*/
        height: 4px;/*拖动块高度*/
        width: 4px;/*拖动块宽度*/
        // background: rgb(255, 1, 1);/*拖动块背景*/
        border-radius: 50%; /*外观设置为圆形*/
        border: solid 1px #ddd; /*设置边框*/
    }
}
// 鼠标移入顶级元素
.videoControl_inside {
    .videoControl_gradient_bottom {
        opacity: 1;
        transition: opacity .5s cubic-bezier(0,0,.2,1);
    }
    .videoControl_control {
        opacity: 1;
        transition: opacity .5s cubic-bezier(0,0,.2,1);
    }
}
.h5Full {
    height: 100vw!important;
    width: 100vh!important;
    transform: translate(-50%, -50%) rotate(90deg);
    left: 50%;
    top: 50%;
}
.videoControlBox {
    width: 100%;
    height: 100%;
    position: relative;
    .videoControlBoxInput {
        width: calc(100vh - 20px)!important;
        position: absolute;
        transform: rotateZ(90deg);
        transform-origin: left center;
        top: 0;
        left: 50px;
        opacity: 0;
    }
        .videoControl_control_progress_playRate {
            height: 6px!important;
            &_circle {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                display: inline-block!important;
                width: 12px;
                height: 12px;
                border-radius: 100%;
                background-color: #ff6429;
                box-shadow: 0px 0px 2px 4px rgba(254,100,41,.3);
                cursor: pointer;
            }
        }
}
</style>