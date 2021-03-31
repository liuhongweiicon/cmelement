<!--
 * @Date: 2020-10-23 10:34:32
 * @LastEditTime: 2020-11-04 15:52:38
 * @Description: 大班课场景
 * @FilePath: /work/web-go-class-demo/src/components/base/largeClass-layout-room.vue
-->
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
            <room-controller-feature :share="share" />
          </div>
        </div>
      </zego-whiteboard-area>
    </div>
    <div class="page-right">
      <room-video-list />
      <room-chatting-list />
    </div>
  </div>
</template>

<script>
import RoomWhiteboardArea from '../room/room-whiteboard-area'
import RoomVideoList from '../room/room-video-list'
import ZegoWhiteboardArea from '../zego/zego-whiteboard-area'
import RoomControllerWhiteboard from '../room/room-controller-whiteboard'
import RoomControllerFeature from '../room/room-controller-feature'
import RoomChattingList from '../room/room-chatting-list'


import zegoClient from '../../../js/room/zego/zegoClient/index'

export default {
  name: 'PageLayoutRoom',
  components: {
    RoomWhiteboardArea,
    RoomControllerFeature,
    RoomControllerWhiteboard,
    RoomVideoList,
    ZegoWhiteboardArea,
    RoomChattingList
  },
  
  inject: ['thisParent', 'zegoLiveRoom'],
  data() {
    return {
      share: false, // 是否开启共享， share => false,非共享，=> true 共享
      user: null,
      streamID: '', // 共享流ID
    }
  },
  computed: {
    shareList() {
      
      return this.zegoLiveRoom.shareList ? JSON.parse(JSON.stringify(this.zegoLiveRoom.shareList)) : null
    }
  },
  watch: {
    // 监听共享流更新
    shareList: {
      handler(val) {
        if (val) {
          this.shareHandler(val);
          
        } else {
          this.screenSharingEndedHandler();
        }
      },
      deep: true,
      immediate: true,
    }
  },
  created() {
    
  },
  mounted() {
    const { roomId, userID, userName, role } = this.thisParent.liveRoomParams.USER_INFO;
    this.zegoLiveRoom.$http.init({ roomId, uid: userID, name: userName, role }); // 初始化,监听房间人数等信息变化

    // 监听教师端开始共享
    BUS.$on('startShare', this.pullVideo);

 

  },
  methods: {
    
    /**
     * 拉流监听
     */
    playerStateUpdate() {
      const _this = this;
      // 监听开始共享
      this.zegoLiveRoom.shareClient.on('playerStateUpdate', (result) => {
        _this.share = true;
          
      });

      // 监听停止共享
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
      if (!_this.streamID) return;
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
      // tip:如果是本端拉自己的流则直接预览即可，如果是要拉对端的流则使用startPlayingStream播放流
      const dom = document.querySelector('.main-mid');
      this.streamID = streamID;
      this.zegoLiveRoom.shareClient.startPreview(streamID, dom);
      this.share = true;
      // 监听停止共享
      this.playerStateUpdate(); 
    },

    /**
     * 学生端通过流ID获取远端流
     */
    async shareHandler(item) {
      this.streamID = item.streamID;
      const dom = document.querySelector('.main-mid');
      if (!dom) {
        setTimeout(() => {
          this.shareHandler(item)
        }, 200);
        return
      }
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
      height: 0;
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
