# cmelement
试题（PCor Mobile）封装

# 视频组件使用
<cm-video :src="src" :adTime="5" :adSrc="adVideoUrl" ></cm-video>

## 视频组件传参

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