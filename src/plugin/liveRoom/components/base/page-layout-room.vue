<template>
  <div class="page-view-room">
    <div class="page-left">
      <zego-whiteboard-area parentId="whiteboardDemo" ref="zegoWhiteboardArea">
        <div class="main-area">
          <div class="main-top">
            <room-controller-whiteboard />
          </div>
          <div class="main-mid">
            <room-whiteboard-area v-show="!share"/>
          </div>
          <div class="main-bottom">
            <room-controller-feature :share="share"/>
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
      zegoWhiteboardArea: null, // 组件zego-whiteboard-area实例
    }
  },
  computed: {
    shareList() {
      return this.zegoLiveRoom.shareList ? JSON.parse(JSON.stringify(this.zegoLiveRoom.shareList)) : null
    }
  },
  provide() {
      return {
          pageLayoutRoom: this
      }
  },
  watch: {
    // 监听共享流更新
    shareList: {
      handler(val) {
        if (val) { // 开始共享
          this.shareHandler(val);
          
          
        } else { // 停止共享
          this.screenSharingEndedHandler();
          
        }
      },
      deep: true,
      immediate: true,
    }
  },
  mounted() {
    const { roomId, userID, userName, role } = this.thisParent.liveRoomParams.USER_INFO;
    this.zegoLiveRoom.$http.init({ roomId, uid: userID, name: userName, role }); // 初始化,监听房间人数等信息变化

    this.zegoWhiteboardArea = this.$refs.zegoWhiteboardArea;
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
        console.log(result, '拉流状态回调')
        if (result.state == 'NO_PLAY') {
          _this.share = false;
        } else {
          _this.share = true;
        }
        
          
      });
      // 监听开始共享
      this.zegoLiveRoom.shareClient.on('playQualityUpdate', (streamID, stats) => {
        console.log(streamID, stats, '拉流质量回调')
        _this.share = true;
          
      });

      // 监听停止共享
      this.zegoLiveRoom.shareClient.on('screenSharingEnded', (res) => {
          console.log(res, '监听停止共享监听停止共享监听停止共享')
          _this.zegoLiveRoom.shareClient.stopPublishingStream(_this.streamID);
          _this.zegoLiveRoom.shareClient.stopPlayingStream(_this.streamID);
          const dom = document.querySelector('.main-mid');
          _this.zegoLiveRoom.shareClient.removeElementVideo(dom);
          _this.share = false;
          _this.streamID = '';

          
          // 结束共享屏幕时，开始白板录制
          _this.zegoWhiteboardArea.shareWhiteboard();

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
      
      
      // 开始共享屏幕时，停止白板录制
      this.zegoWhiteboardArea.closeWhiteboard();
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
    display: flex;
    flex-direction: column;
    .room-video-list {
      flex: 1;
    }
  }
}
</style>
