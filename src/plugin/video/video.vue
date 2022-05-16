<template>
<!-- <div class="videoControlBox"> -->
    <!-- , 'h5Full': !isPC && windowFullscreen -->
    <div 
        class="videoControl" 
        ref="videoControl"
        :style="{height: height, width: width}" 
        :class="{'videoControl_inside': inside && controls}" 
        @mouseenter="inside = true" 
        @mouseleave="inside = false">
        
        <!-- 底部阴影 -->
        <div class="videoControl_gradient_bottom">
        </div>
        <!-- 视频块 -->
        <div class="videoControl_video" @click="playStopHandler(true)">
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
                @touchstart="touchstart"
                @touchmove="touchmove"
                @touchend="touchend"
                class="video_cell"
                :class="{'video_cell_opacity': isPlayAd}"
                :style="{'object-fit': objectFit}"
                :preload="preload" 
                :poster="poster" 
                :autoplay="autoplay"
                :loop="loop"
                :muted="muted"
                x5-video-player
                x5-playsinline
                x5-video-player-type="h5"
                playsInline
                webkit-playsinline
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
                ></video>
            <!-- 广告 -->
            <div v-show="adVideoUrl" class="adVideo_cell_masker"></div>
            <video 
                class="adVideo_cell" 
                :class="{'adVideo_cell_opacity': isPlayAd}"
                :preload="preload" 
                :muted="adMuted"
                :style="{'object-fit': adObjectFit}"
                @ended="adVideoEnded"
                x5-video-player
                x5-playsinline
                x5-video-player-type="h5"
                playsInline
                webkit-playsinline
            ></video>
        <div class="videoControl_video_speedAddOrDel" v-if="changeTime">
            <span>{{changeTime}} <span class="allTime">/ {{duration}}</span></span>
        </div>

        </div>
        <!-- 控制面板 -->
        <div class="videoControl_control" v-show="!isPlayAd && controls">
            <div class="videoControl_control_progress">
                <!-- 播放进度条 -->
                <div class="videoControl_control_progress_playRate">
                    <div class="videoControl_control_progress_playRate_buffer" v-for="(item, i) in bufferProgress" :key="i" :style="{width: item.width, left: item.left}"></div>
                    <div class="videoControl_control_progress_playRate_rate" :style="{width: `${rangeValue}%`}"></div>
                    <div class="videoControl_control_progress_playRate_circle" :style="{left: `calc(${rangeValue}% - ${rangeValue/10}px)`}"></div>
                    <input @input="rangeInput"  @change="rangeChange" class="videoControl_control_progress_playRate_input" type="range" v-model="rangeValue" :max-value="maxValue" min-value="0" style="width: 100%">
                </div>
            </div>
            <div class="videoControl_control_wrap">
                <div class="control_playBtn control_wrap_cell">
                    <svg class="iconfont" aria-hidden="true"  @click="playStopHandler(false)">     
                        <use :xlink:href="playStop ? '#iconzanting1' : '#iconkaishi1'"></use> 
                    </svg>
                </div>
                <div class="control_playNext control_wrap_cell" v-if="showPlayNext" @click="playNext">
                    <svg class="iconfont" aria-hidden="true">     
                        <use xlink:href="#iconNext"></use> 
                    </svg>
                </div>
                <div class="control_playloop control_wrap_cell">
                    <svg class="iconfont" aria-hidden="true" @click="setLoop">     
                        <use :xlink:href="loop ? '#icona-iconxunhuankai' : '#icona-iconxunhuanguan'"></use>
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
                        <use :xlink:href="muted ? '#iconmn_shengyinwu_fill' : '#iconline_shengyin'"></use>
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
        <!-- <div v-if="videoLoadeddata"> -->
            <!-- <slot name="loadeddata"> -->
                <div class="videoControl_loadeddata" v-if="videoLoadeddata && !isPlayAd">
                    <div class="loadeddata_cell"></div>
                    <div class="loadeddata_cell"></div>
                    <div class="loadeddata_cell"></div>
                </div>
            <!-- </slot> -->

            <!-- <slot name="pausePlay"> -->
                <div class="videoControl_pausePlay"  v-show="!isPlayAd" :class="playStop ? 'videoControl_playstate' : 'videoControl_pausestate'">
                    <div class="videoControl_pausePlay_strip">
                    </div>
                </div>
            <!-- </slot> -->
        <!-- </div> -->
                                                                                                                                                                                                                                                                                                                                                                                                                                               
        <!-- 水印 -->
        <div class="videoControl_watermark">
            <img class="videoControl_watermark_img" :src="watermark" alt="">
        </div>
    </div>
    <!-- <input v-if="!isPC && windowFullscreen" @input="rangeInput"  @change="rangeChange" class="videoControlBoxInput" type="range" v-model="rangeValue" :max-value="maxValue" min-value="0" style="width: 100%">
        </div> -->

</template>

<script>
export default {
    name: 'cm-yj-video',
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
            default: ''
        },
        /**
         * 广告视频地址
         */
        adSrc: {
            type: String,
            default: ''
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
            default: '100%'
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
            default: () =>{ return ['0.5', '1.0', '1.25', '1.5', '2.0'] }
        },
        /**
         * 播放下一个按钮
         */
        showPlayNext: {
            type: Boolean,
            default: false
        },
         /**
         * 广告插入时间 小于1 按照百分比， 大于1 按照多少秒播放广告
         */
        adTime: {
            type: Number | String,
            default: 0
        },
        /**
         * 视频控制条显示隐藏
         */
        controls: {
            type: Boolean,
            default: true
        },
        /**  
         * 视频填充类型
         */
        objectFit: {
            type: Boolean,
            default: 'contain'
        },
        /**  
         * 广告视频填充类型
         */
        adObjectFit: {
            type: Boolean,
            default: 'contain'
        },

    },
    watch: {
        /**
         * 监听视频源改变
         */
        src: {
            handler(val) {
            },  
            deep: true
        },
        adSrc: {
            handler(val) {
            },  
            deep: true
        }
    },
    data() {
        return {
            isM3u8: false, // 是否是m3u8 true => m3u8
            inside: true, // 鼠标移入顶级元素标识 true => 移入 false => 移除

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
            adVideoInfo: null,// 广告视频对象
            videoLoadeddata: true, // 视频是否准备就绪
            duration: 0, // 视频时长
            currentTime: 0, // 视频当前播放时间
            mouseDown: false, // 鼠标是否按下 = true 鼠标按下

            browserFullscreen: false, // 浏览器全屏
            windowFullscreen: false, // 系统全屏
            rangeValue: 0,  // 播放进度
            maxValue: 100, // 播放进度input最大值
            isDragRange: true,  // 拖拽进度条时
            bufferValue: 0, // 缓存进度
            voiceRangeValue: 0, // 声音大小
            voiceMaxValue: 100, // 声音最大值
            isPC: true, // 是pc还是移动端
            isRotate: false,
            videoUrl: '', // 视频
            adVideoUrl: '', // 广告
            isPlayAdVideo: false, // 视频中间播放过一次广告标记
            timer: null, // 播放控件定时关闭
            touchForm: { //移动端滑动相关数据
                change: 0, // 位移大小
                curPageX: 0, // 当前手指触屏的位置
                newChange: 0,
                start: 0,
                screenX: 0, // 屏幕宽度
                currentTime: 0
            },
            changeTime: null, //移动端全屏滑动屏幕快进到的视频时刻
            adMuted: true, // 广告是否静音
            isPlayAd: false, // 还是否播放广告
            isFirstPlayAdVideo: false, // 点击开始播放视频面板播放视频广告标记一次
        }
    },
    mounted() {
        window.document.addEventListener('keydown', this.escapeHandler());
        this.isPC = parseInt(document.body.offsetWidth) < 1024 ? false : true;

        this.addEventListenerScreen();
        this.videoInfo = document.querySelector('.video_cell'); 
        this.videoInfo.volume = 0.5;
        this.adVideoInfo = document.querySelector('.adVideo_cell');
        // 处理视频和广告url
        this.formatTurn('videoUrl', true);
        this.formatTurn('adVideoUrl', false);
        // 移动端添加定时器关闭控制器
        !this.isPC && this.setTimer();
    },
    methods: {
        /**
         * 设置自定义控件隐藏
         */
        setTimer () {
            if (this.timer) {
                clearTimeout(this.timer)
                this.timer = null;
            }
            this.inside = true;
            this.timer = setTimeout(() => {
                this.speedPopup = false;
                this.soundPopup = false;
                this.inside = false;
                clearTimeout(this.timer);
                this.timer = null;
            }, 5000)
        },
        /**
         * 视频格式转换
         */
        formatTurn (url, val) {

            this.isM3u8 = false;
            const src = (val ? this.src : this.adSrc).trim();
            if (src.slice(0, 5) == 'http:') {
                this[url] = encodeURI('https:' + src.slice(5))
            }else {
                this[url] = src;
            }
            const video = val ? 'videoInfo' : 'adVideoInfo';
            if (/(\.m3u8)$/.test(this[url]) && Hls.isSupported()) {
                this.isM3u8 = true;
                let hls = new Hls(); // 实例化 Hls 对象
                hls.loadSource(this[url]); // 传入路径
                hls.attachMedia(this[video]);
            }else {
                this[video].src = this[url];
            }
            this.$nextTick(() => {
                this[video].load();
            })
        },

        // 获取当前设备信息
        versions () {
            let u = navigator.userAgent;
            return {//移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        },
        // 监听全屏
        addEventListenerScreen(val){
            let event = val ? 'removeEventListener' : 'addEventListener'
            window.document[event]("fullscreenchange", this.changeScreen);
            window.document[event]("mozfullscreenchange", this.changeScreen);
            window.document[event]("webkitfullscreenchange", this.changeScreen);
            window.document[event]("msfullscreenchange", this.changeScreen);
        },
        /** 
         * 全屏变化
         */
        changeScreen(){
            this.windowFullscreen = !this.windowFullscreen;
        },
        // 移动端全屏滑屏快进快退
        touchstart(e){
            // e.preventDefault();
            if(!this.windowFullscreen) return;
            const {pageX, screenX} = e.touches[0]
            this.touchForm.start = pageX;
            this.touchForm.curPageX = pageX;
            this.touchForm.screenX = screenX;
            // console.log('start', e,pageX);
        },
        touchmove(e){
            if(!this.windowFullscreen) return;
            const pageX = e.touches[0].pageX;
            this.touchForm.change = pageX - this.touchForm.start;    
            const {currentTime, duration} = this.videoInfo;
            const {change, screenX,curPageX} = this.touchForm;
            this.touchForm.newChange = curPageX - pageX;
            this.touchForm.curPageX = pageX;
            let time = Number(currentTime) + Number(((change / screenX) * duration).toFixed(6));
            if(time < 0){
                time = 0;
            }else if(time > Number(duration)){
                time = duration;
            }
            this.touchForm.currentTime = time;
            this.changeTime = this.cmFormatSeconds(time, true);
        },
        touchend(e){
            // e.preventDefault();
            if(!this.windowFullscreen) return;
            this.videoInfo.currentTime = this.touchForm.currentTime;
            this.changeTime = null;
        },
        /** 
         * 设置循环播放
         */
        setLoop() {
            this.loop = !this.loop;
            !this.isPC && this.setTimer();
        },
        /** 
         * 视频进度条变化
         */
        rangeChange(val){
            const fullScreenEle = document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
            this.isDragRange = true;
            this.videoInfo.currentTime = (this.videoInfo.duration * (Number(this.rangeValue) / 100)).toFixed(6)
            !this.isPC && this.setTimer();
        },
        /** 
         * 播放下一个视频
         */
        playNext(){
            this.$emit('playNext');
        },
        /** 
         * 播放进度条变化input事件
        */
        rangeInput(){
            if(this.soundPopup || this.speedPopup){
                this.soundPopup = false;
                this.speedPopup = false;
            }
            this.isDragRange = false;
            !this.isPC && this.setTimer();
        },
        /** 
         * 声音进度条变化
        */
        voiceRangeChange(){
            this.videoInfo.volume = Number(this.voiceRangeValue) / 50;
            !this.isPC && this.setTimer();
        },
        /** 
         * 打开倍速弹框
        */
        showSpeedPopup(){
            this.soundPopup = false;
            this.speedPopup = !this.speedPopup;
            !this.isPC && this.setTimer();
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
            !this.isPC && this.setTimer();
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
        playStopHandler(val) {
            if(this.isPlayAd)return;
            this.speedPopup = false;
            this.soundPopup = false;
            !this.isPC && this.setTimer();
            if (this.playStop) {
                this.videoInfo.pause();
            } else {
                this.videoInfo.play();
                // 首次同时加载广告
                if(!this.isFirstPlayAdVideo && this.adVideoUrl){
                    this.isFirstPlayAdVideo = true;
                    this.adVideoInfo.play();
                    this.$nextTick(()=> {
                        this.adVideoInfo.currentTime = this.adVideoInfo.duration;
                        this.adVideoInfo.pause();
                        this.adMuted = true;
                    })
                }
            }
            this.playStop = !this.playStop;
        },
        escapeHandler(e) {
            // debugger
            this.windowFullscreen = false;
        },
        // 全屏 / 退出全屏
        controlFullScreen () {
            const {ios, iPhone, iPad, webKit} = this.versions();
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
                } else if(ios || iPhone || iPad){
                    this.videoInfo.webkitEnterFullScreen();
                }else {
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
            let temp = [];
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
            this.duration =  this.cmFormatSeconds(this.videoInfo.duration, true);
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
            console.log(e, 'loadeddata')
            this.$emit('loadeddata', e)
        },


        /**
         * 6、canplay：可播放监听。当浏览器能够开始播放指定的音频/视频时触发
         */
        canplay(e) {
            this.videoLoadeddata = false;
            // this.videoInfo.load()
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
            // if (this.mouseDown) return
            this.progressNum = this.videoInfo.currentTime / this.videoInfo.duration * 100 + '%';
            if(this.isDragRange){
                this.rangeValue = this.videoInfo.currentTime / this.videoInfo.duration * 100;
            }
            // 播放广告
            let adTime = this.adTime && Number(this.adTime) || 0;
            if(this.adVideoUrl && !this.isPlayAdVideo && adTime && adTime > 0){
                if(adTime < 1){
                    adTime = parseInt(this.videoInfo.duration * adTime);
                }
                if(parseInt(this.videoInfo.currentTime) == parseInt(adTime)){
                    this.isPlayAdVideo = true;
                    this.videoInfo.pause();
                    // this.playStop = !this.playStop;
                    this.isPlayAd  = true;
                    this.adVideoInfo.currentTime = 0;
                    this.$nextTick(()=> {
                        this.adMuted = false;
                        this.adVideoInfo.play();
                    })
                }
            }
            this.currentTime = this.cmFormatSeconds(this.videoInfo.currentTime, true);
            this.$emit('timeupdate', e)
        },
        /**   
         * 广告播放完毕
         */
        adVideoEnded(e){
            this.isPlayAd = false;
            this.videoInfo.play();
            // this.playStop = !this.playStop;
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
        this.addEventListenerScreen(true);
    }
    
}
</script>

<style lang="scss" scoped>
.videoControl {
    position: relative;
    background: #1c1d30;
    margin: auto;
    user-select: none;
    // pointer-events: none;
    div,span,video, input {
        user-select: none;
    }
    // overflow: hidden;
    .videoControl_gradient_bottom {
        // pointer-events: none;
        position: absolute;
        bottom: 0;
        left: 0;
        opacity: 0;
        width: 100%;
        height: 63px;
        background-image: linear-gradient(0deg,rgba(0,0,0,.5) 0,rgba(0,0,0,0));
        background-position: 0 bottom;
        background-repeat: repeat-x;
        z-index: 9;
    }
    .videoControl_video {
        height: 100%;
        width: 100%;
        position: relative;
        .video_cell,.adVideo_cell {
            height: 100%;
            width: 100%;
            object-fit: contain;
            cursor: pointer;
        }
        .video_cell_opacity {
            position: relative;
            opacity: 0;
            z-index: -99;
        }
        .adVideo_cell {
            position: absolute;
            top:0; 
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -100;
            opacity: 0;
            display: none;
        }
        .adVideo_cell_opacity {
            opacity: 1;
            z-index: 199;
            display: block;
        }
        // .adVideo_cell_masker {
        //     z-index: 198;
        //     background-color: #000;
        // }
        .videoControl_video_speedAddOrDel {
            position: absolute;
            top: calc(50% - 60px);
            left: 50%;
            width: 120px;
            height: 30px;
            border-radius: 15px;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.3);
            color: #fff;
            z-index: 200;
            text-align: center;
            line-height: 30px;
            // display: flex;
            // align-items: center;
            .iconfont {
                margin: 0 10px;
                width: 40px;
                height: 40px;
                fill: #fff;
            }
            span {
                color: #ff6429;
            }
            .allTime {
                color: #fff;
                // color: rgba(0, 0, 0, 0.5);
            }
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
        // background: linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8));
        // box-shadow:   0px -15px 10px 0px rgba(0, 0, 0, 0.2);
        opacity: 0;
        z-index: 10;
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
                    // &:hover {
                    //      fill: #ff6429;
                    // }
                }
                .control_change {
                    z-index: 120;
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
                    // &:hover {
                    //     background-color: #ff6429;
                    // }

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
                    z-index: 130;
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
                            // &:hover {
                            //     color: #ff6429;
                            //     cursor: pointer;
                            // }
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
        top: calc(50% - 2em);
        left: calc(50% - 2em);
        // transform: translate(-50%, -50%);
        height: 4em;
        width: 4em;
        border-radius: 50%;
        background: rgba(0,0,0,.5);
        border: 1px solid #9191916e;
        transition: all .5s;
        cursor: pointer;

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
        transform: scale(0);
        opacity: 0;
    }
    .videoControl_pausestate {
        transform: scale(1);
        opacity: 1;
    }
    input[type=range] {
        // -webkit-appearance: none;/*清除系统默认样式*/
        // width: 1.8rem;
        background: -webkit-linear-gradient(#ddd, #ddd) no-repeat, #ddd;/*设置左边颜色为#61bd12，右边颜色为#ddd*/
        background-size: 75% 100%;/*设置左右宽度比例*/
        height: 16px;/*横条的高度*/
        // border-radius: 10px;
    }
    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;/*清除系统默认样式*/
        height: 16px;/*拖动块高度*/
        width: 16px;/*拖动块宽度*/
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