<!--
 * @Description: 成员列表组件
-->
<template>
  <div class="room-dialog-members">
    <el-dialog
      :title="`已加入的成员(${userList.length})`"
      :visible.sync="dialogVisible"
      width="460px"
      height="314px"
      custom-class="dialog"
      @close="$emit('handleClose')"
    >
      <div class="dialog-content">
        <ul class="member-list">
          <li class="member-item" v-for="item in userList" :key="item.uid">
            <span>{{ item.nick_name + (item.role == 1 ? '（老师）' : '') }}</span>
            <div v-if="classScene === 1"> 
              <room-controller-device v-if="role == 1 && item.role == 2" :user="item" />
            </div>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RoomControllerDevice from './room-controller-device'

export default {
  name: 'RoomDialogMembers',
  props: ['userList'],
  components: {
    RoomControllerDevice
  },
  data() {
    return {
      dialogVisible: true,
      role: 0,
      classScene: this.thisParent.liveRoomParams.classScene || 1, // 课堂场景
    }
  },
  inject: ['zegoLiveRoom', 'thisParent'],
  mounted() {
    this.role = this.zegoLiveRoom.$http.role
  }
}
</script>
<style lang="scss">
@import '../../../static/css/room/_mixin.scss';
.room-dialog-members {
  // /deep/ {
    .el-dialog__wrapper {
      margin-top: 16vh;
    }
    .el-dialog {
      border-radius: 6px;
    }
    .el-dialog__header {
      @include wh(460px, 43px);
      @include sc(12px, #585c62);
      padding: 0;
      line-height: 43px;
      text-align: center;
    }
    .el-dialog__headerbtn {
      @include wh(12px, 12px);
      @include abs-pos(16px, 16px, auto, auto);
      line-height: 12px;
    }
    .el-dialog__close {
      @include wh(12px, 12px);
    }
    .el-dialog__body {
      padding: 0;
      font-size: 12px;
    }
    .el-dialog__title {
      @include sc(14px, #18191a);
    }
    .member-item {
      @include wh(400px, 34px);
      @include sc(12px, #18191a);
      
      display: flex;
      justify-content: space-between;
      line-height: 34px;
      text-align: left;
      padding: 0 30px;
    }
    .member-list {
      @include wh(460px, 272px);
      overflow-y: auto;
      .member-item{
        span{
          padding-right: 40px;
          @include ellipsis();
        }
      }
      .member-item:hover {
        background-color: rgba(244, 245, 248, 1);
      }

      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: rgba(177, 180, 188, 0.5);
        border-radius: 2px;
      }
    }
  // }
}
</style>
