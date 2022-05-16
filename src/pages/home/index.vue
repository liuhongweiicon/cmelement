<template>
    <div>
        <cusVideo :src="src" :adTime="5" :adSrc="adVideoUrl"></cusVideo>
    </div>
</template>

<script>
    import cusVideo from '../../plugin/video/video.vue'
    export default {
        components: {cusVideo},
        data(){
            return {
                src: 'https://downloadfile.e-eduspace.com/%E9%80%9F%E8%AF%BB%E6%B3%951.mp4',
                adVideoUrl: 'http://anlichonggou.e-eduspace.com/FtfVWFhans3Ic7PjaDrKf93LnvnU'
                // adVideoUrl: 'http://anlichonggou.e-eduspace.com/lgcgAkaFOqnvY91ZaAVPCCMgySHs'
                // http://anlichonggou.e-eduspace.com/lgcgAkaFOqnvY91ZaAVPCCMgySHs
                // src: 'https://downloadfile.e-eduspace.com/%E9%80%9F%E8%AF%BB%E6%B3%951.mp4',
                // adVideoUrl: 'https://qn-slice.resource.e-eduspace.com/09/1af93ae81fbd412ba9d1961db9992bdb/1af93ae81fbd412ba9d1961db9992bdb.high.m3u8'
            }
        }
    }
</script>                

<style scoped>

</style>