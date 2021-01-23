<!--
 * @Description: 右侧坐席区组件
-->
<template>
  <div class="room-video-list">
    <ul class="video-preview-list">
      <room-video-item :stream="teacherStream" />
      <div v-if="classScene !==2 ">
        <room-video-item v-for="stream in stuStreamList" :key="stream.streamID" :stream="stream" class="preview-list-item"/>
      </div>
    </ul>
  </div>
</template>

<script>
import RoomVideoItem from './room-video-item'
export default {
  name: 'RoomVideoList',
  components: {
    RoomVideoItem
  },
  data() {
    return {
      memberList    : [],                    // 连麦成员列表
      teacherStream : null,    // 老师流, 老师默认占一个麦位，创建一条默认无数据流
      stuStreamList : [],                     // 学生流列表
      classScene: this.thisParent.liveRoomParams.classScene || 1, // 1 => 小班课 2 => 大班课
    }
  },
  inject: ['zegoLiveRoom', 'thisParent'],
  computed: {
    streamList() {
      return this.zegoLiveRoom.streamList
    }
  },
  watch: {
    streamList: function(newList) {
      const memberList = this.memberList.slice()
      this.makeTeacherStream(newList, memberList)
      this.makeStuStreamList(newList, memberList)
    },
    memberList: function(newList) {
      const streamList = this.streamList.slice()
      this.makeTeacherStream(streamList, newList)
      this.makeStuStreamList(streamList, newList)
    }
  },
  created() {
    this.teacherStream = { 
      streamID: '', 
      user: { 
        role: this.thisParent.liveRoomParams.ROLE_TEACHER
      } 
    }
  },
  mounted() {
    BUS.$on('roomJoinLivesChange', this.onRoomJoinLivesChange)
    BUS.$on('userStateChange', this.onUserStateChange)
  },
  destroyed() {
    BUS.$off('roomJoinLivesChange', this.onRoomJoinLivesChange)
    BUS.$off('userStateChange', this.onUserStateChange)
  },
  methods: {
    /**
     * @desc 房间连麦成员列表变化监听
     */    
    onRoomJoinLivesChange(res) {
      this.$set(this, 'memberList', res)
    },
    /**
     * @desc 成员 摄像头/麦克风/共享权限 状态变化监听
     */
    onUserStateChange(users, local) {
      if (!local) {
        this.memberList.forEach(v => Object.assign(v, users[v.uid]))
        this.memberList = [...this.memberList]
      }
    },

    /**
     * @desc  获取老师流
     * @param {streamList} 音视频sdk原始成员流
     * @param {memberList} 后台返回房间连麦成员列表
     */
    makeTeacherStream(streamList, memberList) {
      if (!memberList.length) return
      if (!memberList[0].uid || !streamList.length) {
        const teacherStream = this.teacherStream
        teacherStream.user = memberList[0]
        teacherStream.isVideoOpen = false
        teacherStream.isAudioOpen = false
        teacherStream.streamID = ''
        this.$set(this, 'teacherStream', teacherStream)
        return
      }
      const id = memberList[0].uid
      const joing = memberList[0].joing
      const stream = streamList.find(v => joing && (v.user.uid == id || v.user.userID == id))
      if (!stream) {
        const teacherStream = this.teacherStream
        teacherStream.user = memberList[0]
        teacherStream.isVideoOpen = false
        teacherStream.isAudioOpen = false
        teacherStream.streamID = ''
        this.$set(this, 'teacherStream', teacherStream)
        return
      }
      stream.user = { ...stream.user, ...this.teacherStream.user, ...memberList[0] }
      this.$set(this, 'teacherStream', stream)
    },
    /**
     * @desc  获取学生流列表
     * @param {streamList} 音视频sdk原始成员流
     * @param {memberList} 后台返回成员连麦成员列表
     */
    makeStuStreamList(streamList, memberList) {
      let arr = []
      for (let i = 1; i < memberList.length; i++) {
        const id = memberList[i].uid
        const stream = streamList.find(v => v.user.uid == id || v.user.userID == id)
        if (stream) {
          stream.user = { ...stream.user, ...memberList[i] }
          arr.push(stream)
        } else {
          arr.push({ streamID: '', user: memberList[i] })
        }
      }
      this.$set(this, 'stuStreamList', arr)
      arr = null
    }
  }
}
</script>
<style lang="scss">
@import '../../../static/css/room/_mixin.scss';
.room-video-list {
  width: 100%;
  // @include wh(100%, 100%);
  overflow-y: auto;
  background: rgba(251, 252, 255, 1);

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(177, 180, 188, 0.5);
    border-radius: 2px;
  }
  .video-preview-list {
    .preview-list-item {
      margin-top: 10px;
    }
  }
}
</style>
