
<template>
  <div class="scene-base-class">
    
    <zego-live-room>
      <!-- <page-layout-room/> -->
    </zego-live-room>
  </div>
</template>

<script>
// import PageLayoutRoom from './components/base/page-layout-room.vue';
import ZegoLiveRoom from './components/zego/zego-live-room.vue';

export default {
  name: 'SceneBaseClass',
  components: {
    ZegoLiveRoom,
    // PageLayoutRoom,
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  destroyed() {
  },
  methods: {
  }
}
</script>

<style lang="scss">
.scene-base-class {
  height: 100%;
  width: 100%;
}
</style>
