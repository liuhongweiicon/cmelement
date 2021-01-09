<template>
    <div class="tipsPage">
        <slot name="tips">
            <img class="tipsPage-img" :src="imgUrl" alt="">
            <p class="tipsPage-text" v-html="html"></p>
        </slot>
    </div>
</template>

<script>
export default {
    name: 'cm-tips-page',
    props: {
        // 提示页面图片
        imgUrl: {
            type: String,
            default: 'http://downloadfile.e-eduspace.com/PC.png',
        },

        // 提示页面文案
        html: {
            type: String,
            default: '暂无数据!'
        }
    },
    data() {
        return {

        }
    },

}
</script>

<style lang="scss" scoped>
.tipsPage {
    display: flex;
    align-items: center;
    padding-top: 144.5px;
    box-sizing: border-box;
    flex-direction: column;
    height: 100%;
    .tipsPage-text {
        font-size: 16px;
        color: #3C3C3C;
        line-height: 18px
    }
}
</style>