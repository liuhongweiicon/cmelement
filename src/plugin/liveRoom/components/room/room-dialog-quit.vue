<!--
 * @Description: 退出课堂弹窗组件
-->
<template>
  <div class="room-dialog-quit">
    <el-dialog
      title="退出课堂"
      :visible.sync="dialogVisible"
      :width="role == 1 ? '380px' : '250px'"
      :showClose="false"
      @close="$emit('handleClose')"
    >
      <div class="dialog-content">
        <div v-if="role == 1">
          <div>
            确定要退出当前课堂？
          </div>
          <el-button class="cancle" round @click="$emit('handleClose')">取消</el-button>
          <!-- <el-button class="quit" round @click="quitClass">离开课堂</el-button> -->
          <el-button class="end" round @click="endClass">退出</el-button>
        </div>
        <div v-else>
          确定要退出当前课堂？
        </div>
        <div v-if="role == 2">
          <el-button class="cancle" style="width:70px" round @click="$emit('handleClose')"
            >取消</el-button
          >
          <el-button class="end" style="width:70px" round @click="quitClass">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import zegoClient from '../../../js/room/zego/zegoClient/index'

export default {
  name: 'RoomDialogQuit',
  inject: ['zegoLiveRoom'],
  data() {
    return {
      dialogVisible: true,
      role: 0
    }
  },
  mounted() {
    this.role = this.zegoLiveRoom.$http.role;
    // this.registerUnloadEvent()
    
  },
  methods: {
    /**
     * 离开直播间
     */
    async quitClass() {
      // await zegoClient._client.logoutRoom(this.zegoLiveRoom.$http.roomId);
      // await this.zegoLiveRoom.$http.leaveRoom()

      await this.zegoLiveRoom.$http.leaveRoom()
      zegoClient._client.logoutRoom(this.zegoLiveRoom.$http.roomId)
      window.close();
    },

    /**
     * 结束教学
     */
    async endClass() {
      if (this.role == 1) {
        await this.zegoLiveRoom.$http.endTeaching()
      }
      
      await this.zegoLiveRoom.$http.leaveRoom()
      zegoClient._client.logoutRoom(this.zegoLiveRoom.$http.roomId)
      window.close();
    },

    /**
     * 监听页面刷新或关闭
     * 结束教学
     */
    registerUnloadEvent() {
      if (this.role == 1) {
        window.onbeforeunload = async (e) => {
          
          var e = window.event||e;  
  　　    e.returnValue=("确定离开当前页面吗？");
          //  await this.zegoLiveRoom.$http.endTeaching()
          // await this.zegoLiveRoom.$http.leaveRoom()
          // zegoClient._client.logoutRoom(this.zegoLiveRoom.$http.roomId)
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../../static/css/room/_mixin.scss';
.room-dialog-quit {
  text-align: center;
  .el-dialog__wrapper {
    margin-top: 22vh;
  }
  .el-dialog {
    border-radius: 6px;
  }
  .el-dialog__header {
    @include sc(14px, #585c62);
    // @include textCenter(43px);
    height: 38px;
    padding: 0;
  }
  .el-dialog__headerbtn {
    @include abs-pos(16px, 16px, auto, auto);
    font-size: 14px;
  }
  .el-dialog__body {
    padding: 0;
    font-size: 12px;
  }
  .el-dialog__title {
    display: inline-block;
    padding-top: 22px;
    @include sc(14px, #18191a);
  }
  .dialog-content {
    padding: 14px 25px 30px 25px;
  }
  .el-button + .el-button {
    margin-left: 14px;
  }
  .el-button.is-round {
    padding: 0;
  }
  .quit {
    @include wh(90px, 30px);
    @include sc(12px, #0044ff);
    margin-top: 16px;
    padding: 0;
    border: 1px solid #0044ff;
    border-radius: 15px;
    &:hover {
      border: 1px solid #0044ff;
      background-color: #f0f4ff;
      color: #0044ff;
    }
    &:active {
      background-color: #f0f4ff !important;
      color: #fff;
    }
    &:focus {
      background-color: #ffffff;
      border: 1px solid #0044ff;
      color: #0044ff;
    }
  }

  .end {
    @include wh(90px, 30px);
    @include sc(12px, #ffffff);
    margin-top: 16px;
    padding: 0;
    border: 0;
    border-radius: 15px;
    background-color: #1742f5;
    &:hover {
      background-color: #0030ff;
      color: #fff;
    }
    &:active {
      background-color: #0030ff !important;
      color: #fff;
    }
    &:focus {
      background-color: #1742f5;
      color: #fff;
    }
  }

  .cancle {
    @include wh(74px, 30px);
    @include sc(12px, #ffffff);
    margin-top: 24px;
    padding: 0;
    border: 0;
    border-radius: 15px;
    background-color: #b1b4bd;
    &:hover {
      background-color: #a3a6ad;
      color: #fff;
    }
  }
}
</style>
