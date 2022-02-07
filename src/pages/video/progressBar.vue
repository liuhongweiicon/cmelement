<template>
    <div class="progressBar" :class="{'progressBar_vertical': direction == 'vertical'}"  :style="{height, width}" @mousedown.stop="mousedownHandler">
            <div class="progressBar_list" :style="{height, width}">
                <div 
                    class="progressBar_list_load"  
                    v-for="item in bufferProgress" 
                    :key="item.left" 
                    :style="{
                        width: item.width, 
                        left: item.left}">
                    </div>
                <div 
                    class="progressBar_list_play" 
                    :style="{
                        width: direction == 'vertical' ? '100%' : progressNum, 
                        height: direction == 'vertical' ? progressNum : '100%'}">
                    </div>
            </div>
            <div 
                class="progressBar_scrubber" 
                :style="{
                    height: thumbHW, 
                    width: thumbHW, 
                    left: direction == 'vertical' ? '50%' : progressNum,
                    bottom: direction == 'vertical' ? progressNum : '50%'}"  
                    data-bar="scrubber">
            </div>
    </div>
</template>

<script>
export default {
    name: 'progressBar',
    props: {
        // 进度条高度
        height: {
            type: String,
            default: '8px'
        },
        // 进度条宽度
        width: {
            type: String,
            default: '100%'
        },
        //滑块高度和高度
        thumbHW: {
            type: String,
            default: '12px'
        },
        // 移动方向, 默认水平 ==> horizontal 水平方向
        // ==> vertical 垂直方向
        direction: {
            type: String,
            default: 'horizontal'
        },
        // 移动id
        moveId: {
            type: String,
            default: ''
        },
        // 视频缓冲进度
        bufferProgress: {
            type: Array,
            default: () => {
                return [{  
                    left: '0%', // 起始位置
                    width: '0%' // 宽度
                }]
            }
        },
        //进度条位置
        progressNum: {
            type: String,
            default: '0%'

        }

    },
    data() {
        return {
            
            // progressNum: '0%', //进度条位置
        }
    },
    mounted() {
    },
    methods: {


        /**
         * 鼠标按下拖动事件
         */
        mousedownHandler(e) {
            e = e || window.event;
            const moveDom = this.moveId ? document.getElementById(this.moveId) : document;
            // debugger
            let diifX = e.offsetX,
                diifY = e.currentTarget.clientHeight - e.offsetY,
                clientHeight = e.currentTarget.clientHeight,
                clientWidth = e.currentTarget.clientWidth;
            const originPositionX = e.clientX;
            const originPositionY = e.clientY;
            if (e.target.dataset.bar === 'scrubber') {
                diifX = e.target.offsetLeft + (e.offsetX - e.target.clientWidth / 2);
                // debugger
                diifY = clientHeight - ((e.target.offsetTop + e.target.clientHeight) - (e.target.clientHeight / 2 - e.offsetY));
            }
            // 水平移动
            if (this.direction == 'horizontal') {
                this.progressNum = (diifX / clientWidth) * 100 + '%';
            } else {
                this.progressNum = (diifY / clientHeight) * 100 + '%';
            }
            
            this.$emit('customdown', {progress: this.progressNum, direction: this.direction});
            // debugger
            moveDom.onmousemove = (event) => {
                event = event || window.event;
                const moveDiifX = event.clientX - originPositionX + diifX;
                const moveDiifY = originPositionY - event.clientY + diifY;
                console.log(event.clientY, originPositionY, diifY, moveDiifY, 'event.clientY, originPositionY, diifY')
                // 水平移动
                if (this.direction == 'horizontal') {
                    this.progressNum = moveDiifX <= 0 ? '0%' : moveDiifX >= clientWidth ? '100%' : (moveDiifX / clientWidth) * 100 + '%';
                } else {
                    this.progressNum =  moveDiifY <= 0 ? '0%' : moveDiifY >= clientHeight ? '100%' : (moveDiifY / clientHeight) * 100 + '%';
                }
                this.$emit('custommove', {progress: this.progressNum, direction: this.direction});
                
            }
            moveDom.onmouseup = () => {
                
                this.$emit('customup', {progress: this.progressNum, direction: this.direction});
                moveDom.onmousemove = null;
                moveDom.onmouseup = null;
                moveDom.onmouseleave = null;
            }
            moveDom.onmouseleave = () => {
                
                this.$emit('customleave', {progress: this.progressNum, direction: this.direction});
                moveDom.onmousemove = null;
                moveDom.onmouseup = null;
                moveDom.onmouseleave = null;
            }
            
            return false;
            
        },
    }
    
}
</script>

<style lang="less" scoped>
    .progressBar {
        cursor: pointer;
        position: relative;
        .progressBar_list {
            background-color: transparent;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            .progressBar_list_play, .progressBar_list_load {
                position: absolute;
                top: 50%;
                left: 0;
                height: 100%;
                transform: scaleY(.5) translateY(-50%);
                background-color: #ff6429;
                transition: all .15s ease;
            }
            .progressBar_list_load {
                background-color: rgba(255,255,255,.5);
            }
            &::after {
                position: absolute;
                top: 50%;
                left: 0;
                width: 100%;
                height: 100%;
                transform: scaleY(.5) translateY(-50%);
                background-color: #fff;
                background-color: rgba(255,255,255,.35);
                content: "";
                transition: all .15s ease;
            }
        }
        .progressBar_scrubber {
            position: absolute;
            top: 50%;
            width: 12px;
            height: 12px;
            transform: scale(0) translate(-50%, -50%);
            border-radius: 100%;
            background-color: #ff6429;
            box-shadow: 0px 0px 2px 4px rgba(254,100,41,.3);
            cursor: pointer;
            transition: all .15s ease;
        }
        &:hover {
            .progressBar_scrubber {
                transform: scale(1) translate(-50%, -50%);
            }
            .progressBar_list {
                .progressBar_list_play, .progressBar_list_load {
                    transform: scaleY(1) translateY(-50%);
                }
                &::after {
                    transform: scaleY(1) translateY(-50%);
                }
            }
        }
    }
    .progressBar_vertical {
        .progressBar_scrubber {
            top: initial;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 50%);
            box-shadow: none;
        }
        .progressBar_list {
            .progressBar_list_play, .progressBar_list_load {
                top: initial;
                width: 100%;
                bottom: 0;
                left: 50%;
                transform: scaleX(1) translateX(-50%);
            }
            &::after {
                position: absolute;
                top: initial;
                left: 50%;
                width: 100%;
                height: 100%;
                transform: scaleX(1) translatex(-50%);
            }

        }
        
        &:hover {
            .progressBar_scrubber {
                transform: translate(-50%, 50%);
                box-shadow: 0px 0px 2px 4px rgba(254,100,41,.5);
            }
            .progressBar_list {
                .progressBar_list_play, .progressBar_list_load {
                    transform: scaleX(1) translateX(-50%);
                }
                &::after {
                    transform: scaleX(1) translateX(-50%);
                }
            }
        }

    }
</style>