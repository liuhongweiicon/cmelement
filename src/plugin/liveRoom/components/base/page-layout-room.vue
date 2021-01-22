<template>
  <div class="page-view-room">
    <div class="page-left">
      <zego-whiteboard-area parentId="whiteboardDemo">
        <div class="main-area">
          <div class="main-top">
            <room-controller-whiteboard />
          </div>
          <div class="main-mid">
            <room-whiteboard-area v-show="!share"/>
          </div>
          <div class="main-bottom">
            <room-controller-feature />
          </div>
        </div>
      </zego-whiteboard-area>
    </div>
    <div class="page-right">
      <room-video-list />
    </div>
  </div>
</template>

<script>
import RoomWhiteboardArea from '../room/room-whiteboard-area'
import RoomVideoList from '../room/room-video-list'
import ZegoWhiteboardArea from '../zego/zego-whiteboard-area'
import RoomControllerWhiteboard from '../room/room-controller-whiteboard'
import RoomControllerFeature from '../room/room-controller-feature'
import { storage } from '@/utils/tool'
import { roomStore } from '@/service/biz/room'
import zegoClient from '@/service/zego/zegoClient'

import BUS from '../../../js/room/utils/bus/index'

export default {
  name: 'PageLayoutRoom',
  components: {
    RoomWhiteboardArea,
    RoomControllerFeature,
    RoomControllerWhiteboard,
    RoomVideoList,
    ZegoWhiteboardArea
  },
  inject: ['zegoLiveRoom'],
  data() {
    return {
      share: false, // 是否开启共享， share => false,非共享，=> true 共享
      user: null,
      streamID: '', // 共享流ID
    }
  },
  computed: {
    shareList() {
      return this.zegoLiveRoom.shareList
    }
  },
  watch: {
    // 监听共享流更新
    shareList(val) {
      if (val) {
        // 学生端通过流ID获取远端流
        this.shareHandler(val);
      } else {
        this.screenSharingEndedHandler();
      }
    }
  },
  mounted() {
    const { roomId, userId, userName, role, classScene } = storage.get('loginInfo')
    roomStore.init({ roomId, uid: userId, name: userName, role, route: this.$route.meta.from, room_type: classScene });
    

    // 监听开启共享屏幕
    BUS.$on('createStreamHandler', this.pullVideo);
  },
  methods: {
    

    /**
     * 拉流监听
     */
    playerStateUpdate() {
      const _this = this;
      this.zegoLiveRoom.shareClient.on('playerStateUpdate', (result) => {
        _this.share = true;
          
      });

      this.zegoLiveRoom.shareClient.on('screenSharingEnded', () => {
          _this.zegoLiveRoom.shareClient.stopPublishingStream(_this.streamID);
          _this.zegoLiveRoom.shareClient.stopPlayingStream(_this.streamID);
          const dom = document.querySelector('.main-mid');
          _this.zegoLiveRoom.shareClient.removeElementVideo(dom);
          _this.share = false;
      });
    },

    /**
     * 停止拉流
     */
    screenSharingEndedHandler() {
      const _this = this;
      _this.zegoLiveRoom.shareClient.stopPublishingStream(_this.streamID);
      _this.zegoLiveRoom.shareClient.stopPlayingStream(_this.streamID);
      const dom = document.querySelector('.main-mid');
      _this.zegoLiveRoom.shareClient.removeElementVideo(dom);
      _this.share = false;
    },
    
    
    /**
     * @desc 教师端本地展示共享页面
     * @returns {Promise<void>}
     */
    async pullVideo(streamID) {
      this.user = zegoClient.getState('user').user;
      // tip:如果是本端拉自己的流则直接预览即可，如果是要拉对端的流则使用startPlayingStream播放流
      const dom = document.querySelector('.main-mid');
      if (this.user.isMe) {
        this.streamID = streamID;
        this.zegoLiveRoom.shareClient.startPreview(streamID, dom);
        this.share = true;
        // 拉流监听
        this.playerStateUpdate(); 
      }
    },

    /**
     * 学生端通过流ID获取远端流
     */
    async shareHandler(item) {
      this.streamID = item.streamID;
      const dom = document.querySelector('.main-mid');
      await this.zegoLiveRoom.shareClient.startPlayingStream(this.streamID, {}, dom);
      // 拉流监听
      this.playerStateUpdate();
    },
  }

}
</script>
<style lang="scss">

@import '../../../static/css/room/_mixin.scss';
.page-view-room {
  display: flex;
  height: 100%;
  margin: 0 auto;

  .main-area {
    @include wh(100%, 100%);
    @include flex-column();
    flex-grow: 1;
    position: relative;
    .main-top {
      // height: 40px !important;
      width: 100%;
    }
    .main-top,
    .main-bottom {
      @include flex-center();
    }
    .main-mid {
      flex: 1;
      position: relative;
      height: 0;
      video {
        height: 100%;
        width: 100%;
      }
    }
    .main-bottom {
      background-color: #ffffff;
    }
  }

  .page-left {
    flex: 1;
  }

  .page-right {
    @include wh(256px, 100%);
  }
}
</style>
