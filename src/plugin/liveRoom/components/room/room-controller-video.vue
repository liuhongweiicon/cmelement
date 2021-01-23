<!--
 * @Description: 坐席区设备管理
-->
<template>
  <div class="room-controller-video">
    <ul class="controller-btn-list">
      <li
        v-for="item in controlBtnList"
        :key="item.name"
        :class="['btn-content', getItemDisabled(item) ? 'disabled' : '']"
      >
        <el-tooltip
          :disabled="getItemDisabled(item)"
          effect="dark"
          :content="getItemContent(item)"
          placement="bottom"
          :visible-arrow="false"
        >
          <div
            :class="['main-btn', user[item.name] == 2 ? 'isOpen' : 'isClose']"
            @click="handleMainBtnClick_(item)"
          >
            <div class="main-icon" v-html="getItemIcon(item)"></div>
          </div>
        </el-tooltip>
      </li>
    </ul>
    <div class="user-name">
      <el-tooltip class="item" effect="dark" :content="userName" placement="bottom">
        <span>{{ userName }}</span>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
const controlBtnList = [
  {
    name: 'camera',
    cnName: '摄像头',
    imgSrc: {
      open: require('../../../static/img/roomIcon/seating_camer.svg').default,
      close: require('../../../static/img/roomIcon/seating_camer_close.svg').default
    }
  },
  {
    name: 'mic',
    cnName: '麦克风',
    imgSrc: {
      open: require('../../../static/img/roomIcon/seating_micophone.svg').default,
      close: require('../../../static/img/roomIcon/seating_micophone_close.svg').default
    }
  },
  {
    name: 'can_share',
    cnName: '共享授权',
    imgSrc: {
      open: require('../../../static/img/roomIcon/seating_share.svg').default,
      close: require('../../../static/img/roomIcon/seating_share_close.svg').default
    }
  }
]

import { debounce } from '../../../js/room/utils/tool'

export default {
  name: 'RoomControllerVideo',
  props: ['user', 'isTeacher'],
  data() {
    return {
      controlBtnList: this.isTeacher ? controlBtnList.slice(0, 2) : controlBtnList,
      ROLE_TEACHER: '',
      STATE_CLOSE: '',
      STATE_OPEN: '',
    }
  },
  inject: ['thisParent', 'zegoLiveRoom'],
  computed: {
    userName() {
      return this.user.userName || this.user.nick_name
    }
  },
  created() {
    const { roomId, userID, role } = this.thisParent.liveRoomParams.USER_INFO;
    this.ROLE_TEACHER = this.thisParent.liveRoomParams.ROLE_TEACHER;
    this.STATE_CLOSE = this.thisParent.liveRoomParams.STATE_CLOSE;
    this.STATE_OPEN = this.thisParent.liveRoomParams.STATE_OPEN;
    this.roomId = roomId
    this.userId = userID
    this.role = role
    this.isMe = this.userId == this.user.uid
  },
  mounted(){
    this.handleMainBtnClick_ = debounce(this.handleMainBtnClick, 500, true)
  },
  methods: {
    getItemDisabled({ name }) {
      return this.role == this.ROLE_TEACHER ? false : !(this.isMe && name !== 'can_share')
    },
    getItemIcon(item) {
      return this.user[item.name] == this.STATE_OPEN ? item.imgSrc.open : item.imgSrc.close
    },
    getItemContent(item) {
      const isOpen = this.user[item.name] == this.STATE_OPEN
      let str = isOpen ? '关闭' : '打开'
      if (item.name == 'can_share') {
        str = isOpen ? '取消' : ''
      }
      return str + item.cnName
    },
    async handleMainBtnClick({ name }) {
      debugger
      if (this.isMe && name === 'can_share') return
      if (this.role == this.ROLE_TEACHER || this.isMe) {
        const state = this.user[name] == this.STATE_OPEN ? this.STATE_CLOSE : this.STATE_OPEN
        await this.zegoLiveRoom.$http.setUserInfo({
          target_uid: this.user.uid,
          [name]: state
        })
        this.user[name] = state
        if (this.isMe) {
          BUS.$emit('userStateChange', { [this.user.uid]: { [name]: state } }, true)
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../../static/css/room/_mixin.scss';
.room-controller-video {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @include abs-pos(6px, 4px, 10px, auto);
  z-index: 100;
  .controller-btn-list {
    display: flex;
    justify-content: flex-end;
    .btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      @include wh(28px, 28px);
      margin-right: 6px;
      border-radius: 50%;
      background-color: rgba($color: #000000, $alpha: 0.6);
      &:not(.disabled):hover {
        background-color: rgba($color: #000000, $alpha: 0.8);
        cursor: pointer;
      }
    }
    .main-btn {
      @include wh(18px, 18px);
    }
    .main-icon {
      @include wh(18px, 18px);
      margin: 0 auto;
    }
  }
  .user-name {
    display: flex;
    justify-content: flex-end;
    margin-right: 6px;
    span {
      display: inline-block;
      height: 22px;
      max-width: 73px;
      padding: 0 10px;
      @include sc(12px, #ffffff);
      @include textCenter(22px);
      @include ellipsis();
      border-radius: 12px;
      background-color: rgba($color: #000000, $alpha: 0.6);
      cursor: pointer;
    }
  }
}
</style>
