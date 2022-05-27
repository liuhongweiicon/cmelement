<template>
    <div class="cmimg">
        <cm-img class="cmImg_content" :dataSet="dataSet"></cm-img>

    </div>
</template>

<script>
export default {
    data() {
        return {
            dataSet: {
                width: '100%', // 图片容器高
                height: '100%', // 图片容器宽
                imgWidth: '', // 图片宽度
                imgHeight: '', // 图片高度
                urlList: [ // 图片路径
                    {
                        url:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F4k%2Fs%2F02%2F2109242332225H9-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1656049718&t=84ca5994fc0f44ef767b63662e087873',
                    }
                ], 
                wheel: true, // 是否允许滚轮缩放大小
                automatic: null, // 是否允许自动切换, 自动切换时间
                preNext: true, // 是否展示上一张和下一张按钮
                operate: true, // 是否展示放大缩小旋转重置按钮
                move: true, // 是否允许拖动
            }
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {

    }
}
</script>

<style lang="less" scoped>
.cmimg {
    // .cmImg_content {

    // }
    height: 100%;
    width: 100%;
}
</style>