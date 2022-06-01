<template>

                <!--  -->
    <div class="ed_img"
            @mouseenter="imgEnter" 
            @mouseleave="imgLeave">
            
        <div class="ed_img_group" 
        
            @touchstart.prevent="touchstartHandler"
            @touchmove.prevent="touchmoveHandler"
            @touchend.prevent="touchendHandler"
            @touchcancel.prevent="touchendHandler"
            >
            <div class="ed_img_cell"
                v-for="(item, index) in newAetDate.urlList" 
                :key="index" 
                @mousedown.stop.prevent="imgMove"
                :class="imgIndex === index ? 'active_img' : ''"
                >
                <transition name="fade">
                    <img class="cell_item" v-show="imgIndex === index" :class="imgIndex === index ? 'rotate_img' : ''"  :src="item.url" alt="">
                </transition>
                
            </div>
        </div>

        <svg class="icon icon_yj" aria-hidden="true"  @click.prevent.stop="imgPreNext(true)" v-show="newAetDate.preNext">
            <use xlink:href="#iconchangyongicon-1"></use>
        </svg>
        <svg class="icon icon_yj icon_right" aria-hidden="true"  @click.prevent.stop="imgPreNext(false)" v-show="newAetDate.preNext">
            <use xlink:href="#iconchangyongicon-2"></use>
        </svg>
        <transition name="fade" @click.stop>
            <!--   -->
            <div class="ed_img_operate" v-if="is0perateShow && newAetDate.operate">
                <span class="ed_img_operate_cell" @click.stop="setScale(true)">
                    <svg class="icon operate_size" aria-hidden="true">
                        <use xlink:href="#iconfangda1"></use>
                    </svg>
                </span>
                <span class="ed_img_operate_cell"  @click.stop="setScale(false)">
                    <svg class="icon operate_size" aria-hidden="true">
                        <use xlink:href="#iconsuoxiao1"></use>
                    </svg>
                </span>
                <span class="ed_img_operate_cell"  @click.stop="imgRotate(true)">
                    <svg class="icon operate_size" aria-hidden="true">
                        <use xlink:href="#iconyouzhuan"></use>
                    </svg>
                </span>
                <span class="ed_img_operate_cell"  @click.stop="imgRotate(false)">
                    <svg class="icon operate_size" aria-hidden="true">
                        <use xlink:href="#iconzuozhuan"></use>
                    </svg>
                </span>
                <span class="ed_img_operate_cell"  @click.stop="imgReset">
                    <svg class="icon operate_size" aria-hidden="true">
                        <use xlink:href="#iconzhongzhi"></use>
                    </svg></span>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'cm-img',
    props: {
        dataSet: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            imgIndex: 0, // 当前图片下标
            imgWidth: '', // 图片宽度
            imgHeight: '', // 图片高度
            scale: 1, // 图片当前缩放比例
            rotateDeg: 0, // 图片旋转角度 0 => 0deg 1 => 90Deg
            is0perateShow: false, // 是否展示操作按钮, 移入展示
            newAetDate: {
                urlList: [],
                wheel: true, // 是否允许滚轮缩放大小
                automatic: null, // 是否允许自动切换, 自动切换时间
                preNext: true, // 是否展示上一张和下一张按钮
                operate: true, // 是否展示放大缩小旋转重置按钮
                move: true, // 是否允许拖动
            },
            store: {}, // 移动端记录手指滑动位置
        }
    },
    created() {
        this.newAetDate = Object.assign(this.newAetDate, this.dataSet);
    },
    mounted() {

        this.setImgStyle();

       
        // 判断是否允许滚轮缩放
        if (this.newAetDate.wheel) {
             // 给页面绑定滑轮滚动事件  
            const imgDom = document.querySelector('.ed_img_group');
            if (imgDom.addEventListener) {//firefox  
                imgDom.addEventListener('DOMMouseScroll', this.scrollFunc, false);  
            }  
            //滚动滑轮触发scrollFunc方法  //ie 谷歌  
            imgDom.onmousewheel = imgDom.onmousewheel = this.scrollFunc;  
        }

        // 判断是否自动切换
        if (this.newAetDate.automatic) {
            setInterval(() => {
                this.imgPreNext(true)
            }, this.newAetDate.automatic);
        }

    },
    methods: {

        
        // 点击图片翻页
        imgPreNext(val) {
            
            if (val) { // 上一张 
                if (this.imgIndex === 0) {
                    this.imgIndex = this.newAetDate.urlList.length - 1;
                    // return
                }
                if (this.newAetDate.urlList.length > 1) {
                    this.imgIndex --;
                }
            } else { // 下一张
                if (this.imgIndex === (this.newAetDate.urlList.length - 1)) {
                     this.imgIndex = 0;
                    //  return
                }
                if (this.newAetDate.urlList.length > 1) {
                    this.imgIndex ++;
                }
                 
            }
            
            // 切换图片时, 将图片设为为正常大小
            this.$nextTick(() => {
                this.imgReset();
            })
        },

        // 鼠标滚动滚轮事件, 调用图片缩放方法
        scrollFunc(e) {
            e = e || window.event;  
            if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件               
                if (e.wheelDelta > 0) { //当滑轮向上滚动时  
                    this.setScale(true)
                }  
                if (e.wheelDelta < 0) { //当滑轮向下滚动时  
                    this.setScale()
                }  
            } else if (e.detail) {  //Firefox滑轮事件  
                if (e.detail > 0) { //当滑轮向上滚动时  
                    this.setScale(true)
                }  
                if (e.detail < 0) { //当滑轮向下滚动时  
                    this.setScale()
                }  
            }  
        },

        // 图片缩放方法
        setScale(val) {
            if (val) { // 放大图片
                // 图片最多放大三倍
                if (this.scale <= 3) {
                    this.scale = this.scale + 0.1;
                }
            } else { // 缩小图片
                // 图片最多缩0.5倍
                if (this.scale >= 0.5) {
                    this.scale = this.scale - 0.1;
                }
            }
            
            this.setImgStyle()
        },

        // 拖拽图片
        imgMove(e) {
            // 图片不允许拖动
            if (!this.newAetDate.move) return; 
            // 图片缩小转台不能拖动
            if (this.scale < 1) return;
            let imgGroupDom = e.target;        //获取目标元素
            const imgDom = document.querySelector('.active_img')
            //阻止默认事件的方法,如果不阻止默认事件onmouseup会无法触发
             e.preventDefault();
            //算出鼠标相对元素的位置
            let disX = e.clientX - imgDom.offsetLeft;
            let disY = e.clientY - imgDom.offsetTop;
            imgDom.onmousemove = (e)=>{  
                // console.log(e)
                 //鼠标按下并移动的事件
                //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                //因为img居中对齐，所以还要减去目标元素距离body的偏移量
                let left = e.clientX - disX;    
                let top = e.clientY - disY;
                // console.log(left, top);
                //移动当前元素
                imgDom.style.left = left + 'px';
                imgDom.style.top = top + 'px';
            };
            imgGroupDom.onmouseup = (e) => {
                imgDom.onmousemove = null;
                imgDom.onmouseup = null;
            };
            imgDom.onmouseout = () => {
                imgDom.onmousemove = null;
                imgDom.onmouseup = null;

            }
        },

        // 图片旋转方法
        imgRotate(val) {
            // 旋转时将图片缩放重置
            this.scale = 1;
            if (val) {
                this.rotateDeg++;
            } else {
                this.rotateDeg--;
            }
            const imgDom = document.querySelector('.active_img')
            imgDom.style.left = 0 + 'px';
            imgDom.style.top = '50%';
            this.setImgStyle();
        },
        
        // 获取坐标之间的举例
        getDistance(start, stop) {
            return Math.hypot(stop.x - start.x, stop.y - start.y);
        },

        /**
         * 移动端,手指按下时
         */
        touchstartHandler(event) {
            // 图片不允许拖动
            if (!this.newAetDate.move) return; 
            const touches = event.touches;
            const events = touches[0];
            const events2 = touches[1];

            if (!events) {
                return;
            }

            // 底部操作面板显示条件
            this.is0perateShow = !this.is0perateShow;
            // 切换图片icon展示条件
            const icon = document.querySelectorAll('.icon_yj');
            if (icon && this.newAetDate.preNext) {
                if (this.is0perateShow) {
                    icon[0].style.cssText = "animation: fade-in .5s infinite;animation-iteration-count: 1;animation-fill-mode:forwards;fill: #fff;"
                    icon[1].style.cssText = "animation: fade-in .5s infinite;animation-iteration-count: 1;animation-fill-mode:forwards;fill: #fff;"
                } else {
                    icon[0].style.cssText = "fill: transparent;"
                    icon[1].style.cssText = "fill: transparent;"
                }
                
            }
            
            // 记录图片元素
            const imgDom = document.querySelector('.active_img');
            this.store.imgDom = imgDom;
            
            //记录触点相对元素的位置
            this.store.disX = events.clientX - imgDom.offsetLeft;
            this.store.disY = events.clientY - imgDom.offsetTop;
            // console.log(event, imgDom.offsetLeft)

            // 第一个触摸点的坐标
            this.store.pageX = events.pageX;
            this.store.pageY = events.pageY;

            // 有第二个触摸点
            if (events2) {
                this.store.pageX2 = events2.pageX;
                this.store.pageY2 = events2.pageY;
            }
            // 记录原始发达状态
            this.store.originScale = this.scale || 1;

        },
        
        /**
         * 手指移动时
         */
        touchmoveHandler(event) {
            // 图片不允许拖动
            if (!this.newAetDate.move) return; 
            this.is0perateShow = false;

            
            // 切换图片icon展示条件
            const icon = document.querySelectorAll('.icon_yj');
            if (icon && this.newAetDate.preNext) {
                icon[0].style.cssText = "fill: transparent;"
                icon[1].style.cssText = "fill: transparent;"
                
            }

            const touches = event.touches;
            const events = touches[0];
            const events2 = touches[1];
            
            // 有第二个触摸点，缩放大小
            if (events2) {
                this.store.double = true;
                // 双指移动
                if (!this.store.pageX2) {
                    this.store.pageX2 = events2.pageX;
                    this.store.pageY2 = events2.pageY;
                }

                const moveZoom = this.getDistance ({
                    x: events.pageX,
                    y: events.pageY
                }, {
                    x: events2.pageX,
                    y: events2.pageY
                })
                const startZoom = this.getDistance ({
                    x: this.store.pageX,
                    y: this.store.pageY
                }, {
                    x: this.store.pageX2,
                    y: this.store.pageY2
                })


                const zoom = moveZoom / startZoom;
                
                this.scale = this.store.originScale * zoom;
                
                // 最大缩放比例限制
                if (this.scale > 3) {
                    this.scale  = 3;
                } else if (this.scale <= 0.5) {
                    this.scale = 0.5;
                }
                this.setImgStyle()
            } else if (!events2 && !this.store.double) { // 只有一个触摸点，拖动图片
                 //手指按下并移动的事件
                //手指的位置减去手指相对元素的位置，得到元素的位置
                //因为img居中对齐，所以还要减去目标元素距离body的偏移量
                let left = events.clientX - this.store.disX;    
                let top = events.clientY - this.store.disY;
                //移动当前元素
                if (!this.store.imgDom) return
                this.store.imgDom.style.left = left + 'px';
                this.store.imgDom.style.top = top + 'px';
            }

        },
        /**
         * 手指离开时
         */
        touchendHandler() {
            // 图片不允许拖动
            if (!this.newAetDate.move) return; 
            delete this.store.pageX2;
            delete this.store.pageY2;
            delete this.store.double;
            delete this.store.imgDom;
        },

        // 更新图片样式
        setImgStyle() {
            const rotateImgDom = document.querySelector('.rotate_img');
            if (!rotateImgDom) return
           
            rotateImgDom.style.cssText = `transform: scale(${this.scale}) rotate(${this.rotateDeg*90}deg);height: 100%; width: 100% `

        },

        // 初始化重置图片样式
        imgReset() {
            this.scale = 1;
            this.rotateDeg = 0;
            const imgDom = document.querySelector('.active_img')
            if (!imgDom) return
            imgDom.style.left = 0 + 'px';
            imgDom.style.top = '50%';
            
            this.setImgStyle();
        },

        // 鼠标移入图片时,展示操作按钮
        imgEnter() {
            this.is0perateShow = true
        },

        // 鼠标移出图片时,隐藏操作按钮
        imgLeave() {
            this.is0perateShow = false
            
        },

        // 返回当前下标图片对象
        getImgInfo() {
            const _this = this;
            console.log( _this.newAetDate)
            debugger
            return  _this.newAetDate.urlList[_this.imgIndex];
        }

    },
    beforeDestroy() {
        const imgDom = document.querySelector('.ed_img_group');
        imgDom&&imgDom.removeEventListener("DOMMouseScroll", this.scrollFunc)
    }
    
}
</script>

<style lang="scss" scoped>
    .ed_img {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #2f2f2f;
        display: flex;
        position: relative;
        -moz-user-select:none; /*火狐*/
        -webkit-user-select:none; /*webkit浏览器*/
        -ms-user-select:none; /*IE10*/
        -khtml-user-select:none; /*早期浏览器*/
        user-select:none;
        .ed_img_group {
            position: relative;
            height: 100%;
            width: 100%;
            .ed_img_cell {
                width: 100%;
                height: 100%;
                position: absolute;
                transform: translateY(-50%);
                top: 50%;
                // left: 0;
                // right: 0;
                // bottom: 0;
                opacity: 0;
                z-index: 0;
                animation: fade-out 1s infinite;
                animation-iteration-count: 1;
                animation-fill-mode:forwards;
                .cell_item {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    position: absolute;
                    top: 0;
                    right: 0;
                    left: 0;
                    bottom: 0;
                    margin: auto;
                }
            }
            .active_img {
                z-index: 9;
                animation: fade-in 1s infinite;
                animation-iteration-count: 1;
                animation-fill-mode:forwards;
            }
        }
        .icon_yj {
            height: 50px;
            width: 50px;    
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            fill: transparent;
            z-index: 9;
        }
        .icon_right {
            right: 0
        }
        .ed_img_operate {
            position: absolute;
            bottom: 0;
            height: 40px;
            text-align: center;
            width: 100%;
            background: rgba(0,0,0,.4);
            color: #fff;
            line-height: 40px;
            z-index: 10;
            display: flex;
            justify-content: center;
            .ed_img_operate_cell {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 60px;
                .operate_size {
                    width: 20px;
                    height: 20px;
                    fill: #fff;
                }
                .operate_size:hover {
                    fill: red;
                }
            }
        }
        .fade-enter-active, .fade-leave-active {
            transition: opacity .5s;
        }
        .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
            opacity: 0;
        }
    }
    .ed_img:hover {
        cursor: pointer;
        .icon_yj {
            animation: fade-in .5s infinite;
            animation-iteration-count: 1;
            animation-fill-mode:forwards;
            fill: #fff;
        }
    }
    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1
        }
    }
    @keyframes fade-out {
        from {
            opacity: 1;
        }
        to {
            opacity: 0
        }
    }
</style>