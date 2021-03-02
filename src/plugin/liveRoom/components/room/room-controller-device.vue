<!--
 * @Description: 成员列表设备管理组件
-->
<template>
  <div class="room-controller-device">
    <ul class="control-btn-list">
      <li v-for="item in controlBtnList" :key="item.name" class="control-btn-item">
        <el-tooltip effect="dark" :content="getItemContent(item)" placement="bottom">
          <div
            :class="['main-btn', user[item.name] == 2 ? 'isOpen' : 'isClose']"
            @click="handleMainBtnClick_(item)"
          >
            <div class="main-icon" v-html="getItemIcon(item)"></div>
          </div>
        </el-tooltip>
      </li>
    </ul>
  </div>
</template>
<script>
const controlBtnList = [
  {
    name: 'camera',
    cnName: '摄像头',
    imgSrc: {
      open: require('../../../static/img/roomIcon/mumber_camer.svg').default,
      close: require('../../../static/img/roomIcon/mumber_camer_close.svg').default
    }
  },
  {
    name: 'mic',
    cnName: '麦克风',
    imgSrc: {
      open: require('../../../static/img/roomIcon/mumber_micophone.svg').default,
      close: require('../../../static/img/roomIcon/mumber_micophone_close.svg').default
    }
  },
  {
    name: 'can_share',
    cnName: '共享授权',
    imgSrc: {
      open: require('../../../static/img/roomIcon/mumber_share.svg').default,
      close: require('../../../static/img/roomIcon/mumber_share_close.svg').default
    }
  }
]

import { debounce } from '../../../js/room/utils/tool'

export default {
  name: 'RoomControllerDevice',
  props: ['user'],
  
  inject: ['thisParent', 'zegoLiveRoom'],
  data() {
    return {
      controlBtnList,
      constants: this.thisParent.liveRoomParams, // 直播间参数和用户信息
      roomStore: this.zegoLiveRoom.$http, // 直播间信息
    }
  },
  mounted() {
    this.roomId = roomStore.roomId // 房间id
    this.userId = roomStore.uid // 用户id
    this.role = roomStore.role  // 用户角色
    this.handleMainBtnClick_ = debounce(this.handleMainBtnClick, 500, true)
  },
  methods: {
    /**
     * @desc: 获取该设备状态
     * @param {item}  目标设备
     */
    getItemIcon(item) {
      return this.user[item.name] == this.constants.STATE_OPEN ? item.imgSrc.open : item.imgSrc.close
    },

    getItemContent(item) {
      const isOpen = this.user[item.name] == this.constants.STATE_OPEN
      let str = isOpen ? '关闭' : '打开'
      if (item.name == 'can_share') {
        str = isOpen ? '取消' : ''
      }
      return str + item.cnName
    },

    /**
     * @desc: 设备管理
     * @param {name} 目标设备名称
     */    
    async handleMainBtnClick({ name }) {
      const isOpen = this.user[name] == constants.STATE_OPEN
      if (this.role == this.constants.ROLE_TEACHER) {
        const state = isOpen ? this.constants.STATE_CLOSE : this.constants.STATE_OPEN
        await roomStore.setUserInfo({
          target_uid: this.user.uid,
          [name]: state
        })
        this.user[name] = state
      }
    }
  }
}
</script>
<style lang="scss">
.room-controller-device {
@import '../../../static/css/room/_mixin.scss';
  @include wh(86px, 34px);
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  .control-btn-list {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    width: 86px;
    margin: 0 auto;
  }
  .control-btn-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    .main-btn {
      @include wh(18px, 18px);
      position: relative;
      &:not(.isOpen):hover {
        // /deep/ {
        .hover-stroke {
          stroke: #5c5e66;
        }
        // }
      }
      &:not(.isClose):hover {
        // /deep/ {
        .hover-stroke {
          stroke: #0030ff;
        }
        // }
      }

      .main-icon {
        @include wh(18px, 18px);
        margin: 0 auto;
        svg {
          display: block;
        }
      }
    }
  }
}
</style>
