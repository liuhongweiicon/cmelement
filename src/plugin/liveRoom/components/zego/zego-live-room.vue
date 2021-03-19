<!--
 * @Description: 提供音视频sdk相关实例的组件，通过provide提供该能力，如需使用该音视频相关方法的组件可通过inject注入
-->
<template>
  <div class="zego-live">
    <div class="zego-live-room" v-if="!!client && isLogin">
      <slot></slot>
      <room-dialog-loading v-if="loading" />
      <room-dialog-error ref="errorDialog" />
    </div>

    
    <el-dialog
      class="zego-live-dialog"
      title="提示"
      :modal="false"
      :visible.sync="liveTips"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="500px"
      top="28vh"
      style="border-radius: 4px;"
    >
      <div class="live-dialog-timer">
        <div >
          
          <p class="dialog-timer-first">上课时间还有<span>&nbsp;{{courseTipsTime}}秒&nbsp;</span>结束，是否延长{{spaceTipsTime}}分钟上课时间？</p>
          <p>如不延长上课时间，系统将自动关闭并退出直播间</p>
        </div>
        
        <!-- <div v-else>
          <p class="dialog-timer-first">已超时{{extendNum * spaceTipsTime}}分钟，是否继续延长上课时间？</p>
          <p>如不延长上课时间，<span style="color: red">{{courseTipsTime}}秒</span>后系统将自动关闭并退出直播间</p>
        </div> -->
        <!-- 预定上课的时间还有1分钟结束，是否继续？
        已超时30分钟，是否继续上课？ -->
      </div>
      
    <div slot="footer" class="dialog-footer">
      <el-button @click="liveTips = false">不延长</el-button>
      <el-button type="primary" @click="extendTime">延长</el-button>
    </div>
    </el-dialog>

  </div>
</template>

<script>
import zegoClient from '../../../js/room/zego/zegoClient/index'

import RoomDialogLoading from '../room/room-dialog-loading'
import RoomDialogError from '../room/room-dialog-error'
import moment from "moment";
import $HTTP from '../../../js/room/service/index'; // 请求实例

export default {
  name: 'ZegoLiveRoom',
  components: {
    RoomDialogLoading,
    RoomDialogError
  },
  inject: ['thisParent'],
  data() {
    return {
      roomId: '',
      userName: '',
      env: '', // 运行环境,是否是测试环境, => home 国内环境  => overseas 正式环境
      client: null, // sdk实例
      shareClient: null, // 共享屏幕实例
      captureClient: null, // 屏幕采集实例
      streamList: [], // 流
      userList: [], // 房间用户列表
      user: {}, // 用户本身
      isPushStreamList: false, // 是否正在推流
      isLogin: false, // 是否登录
      publishStreamId: '', // 推流id
      publishingFlag: '', // 判断正在推的是视频流还是音频流
      devices: null, // 音频、视频输入输出设备列表
      activeDevice: {}, // 当前使用设备
      roomState: '', // 房间当前状态
      loading: false,
      loadingTimer: null,
      loadingInterval: 30,
      confirm: false,
      roomExtraInfo: null,
      messages: [], // 房间消息
      sendLoadingTimer: null, //发送消息loading
      sendLoadingInterval: 5, //发送消息loading‘
      shareList: null, // 共享流监听

      $http: null, // 请求实例

      isquit: false, // 是否是退出

      endLiveTime: '', // 结束上课时间
      endLiveTimer: null, // 上课结束定时器
      liveTips: false, // 直播时间到提示框
      extendNum: 0, // 延长上课时间次数
      spaceTipsTime: 30, // 延长上课时长

      courseTipsTime: '60', // 上课时间的提示文案
      courseTipsTimer: null, // 上课时间提示时间定时器

            
      _beforeUnload_time:'', // 监听beforeunload执行回调时时间戳
      _gap_time:'', //  监听unload执行回调时时间戳与_beforeUnload_time的差，小于5表示关闭，否则是刷新浏览器

      
    }
  },
  
  provide() {
    return {
      zegoLiveRoom: this
    }
  },
  
  created() {
    // 延长上课时刷新页面，初始化延长次数
    this.extendNum = sessionStorage.getItem('extendNum') || 0
    // 运行环境,是否是测试环境, => home 国内环境  => overseas 正式环境
    this.env = this.thisParent.liveRoomParams.AREA_ENV;
    this.roomId = this.thisParent.liveRoomParams.USER_INFO.roomId;
    this.userName = this.thisParent.liveRoomParams.USER_INFO.userName;

    this.$http = new $HTTP(this.thisParent.request, this.thisParent.liveRoomParams);

    // 初始化，设置延长上课配置参数
    this.endLiveTime = this.thisParent.endTime ? this.thisParent.endTime.endLiveTime : this.endLiveTime;
    this.spaceTipsTime = this.thisParent.endTime ? this.thisParent.endTime.spaceTipsTime : this.spaceTipsTime;
  
    // 设置结束直播定时器
    if (this.thisParent.liveRoomParams.USER_INFO.role == 1) {
      if (!this.extendNum && this.endLiveTime && this.endLiveTime < new Date().getTime()) {
        this.thisParent.isLogin = false;
        this.thisParent.enterHtml = '直播已结束'
      } else {
        this.setLiveTime();
      }
      
    }
  },
  
  async mounted() {
    

      // 调用顺序：initClient -> initLiveRoom -> loginRoom | 初始化sdk -> 监听回调方法 -> 登录房间
      await this.initClient()
      await this.initLiveRoom() // 回调方法
      await this.loginRoom()
      
    
      // 监听浏览器刷新和关闭事件    
      window.addEventListener('beforeunload', this.beforeunloadHandler)
      window.addEventListener('unload', this.unloadHandler)
  },
  methods: {
    // 刷新关闭浏览器之前回调
    beforeunloadHandler(e){
        this._beforeUnload_time = new Date().getTime();
        // e.returnValue = '确定要退出当前课堂？'; // 弹窗
    },
    // 刷新环比卸载回调
    async unloadHandler(e){
        this._gap_time = new Date().getTime() - this._beforeUnload_time;
        alert(this._gap_time)
        if (this._gap_time <= 5) {
            this.endClass();
        }
    },

    /**
     * 直播间结束定时器
     */

    setLiveTime() {
      if (this.endLiveTime) {
        let time = Number(this.endLiveTime);
        if (this.extendNum > 0) {
          time = moment(time).add(this.extendNum * this.spaceTipsTime, 'minutes').valueOf()
        }
        this.endLiveTimer = window.setInterval(() => {
          if (new Date().getTime() >= time) {
            this.liveTips = true;
            window.clearInterval(this.endLiveTimer);
            this.setCourseTipsTimer();
          }
        }, 1000);
      }
    },

    /**
     * 上课结束提示定时器
     */
    setCourseTipsTimer() {

      this.courseTipsTime = 59;
      this.courseTipsTimer = window.setInterval(() => {
        if (this.courseTipsTime <= 0) {
          this.liveTips = false;
          // this.endClass();
          window.clearInterval(this.courseTipsTimer);
        }
        
        this.courseTipsTime--;
      }, 1000);
    },

    /**
     * 延长上课时间
     */
    extendTime() {
      const _this = this;
      _this.liveTips = false;
      _this.$nextTick(() => {
        _this.extendNum++;
        // 延长上课时刷新页面，存储延长次数
        sessionStorage.setItem('extendNum', _this.extendNum);
        window.clearInterval(_this.courseTipsTimer);
        _this.setLiveTime();
      })
    },
    
    
    /**
     * 结束教学
     */
    async endClass() {
      // 结束教学，清除存储的延长上课次数
      sessionStorage.getItem('extendNum') && sessionStorage.removeItem("extendNum");
      
      if (this.thisParent.liveRoomParams.USER_INFO.role == 1) {
        await this.$http.endTeaching()
      }
      
      await this.$http.leaveRoom()
      zegoClient._client.logoutRoom(this.$http.roomId)
      window.close();
    },
    /**
     * @desc: 初始化sdk
     */
    async initClient() {

      this.client = await zegoClient.init('live', this.env, this.thisParent.liveRoomParams)
      this.shareClient = await zegoClient.init('screenSharing', this.env)
    },
    /**
     * @desc: sdk - 登录房间
     */
    async loginRoom() {

      const res = await this.client.express('loginRoom', this.thisParent.liveRoomParams.USER_INFO.roomId);
      if (res.error) {
        this.$message.error(res.msg);
        return
      }
      this.isLogin = true
      const { user } = zegoClient.getState('user')
      
      this.$set(this, 'user', user)
      this.userList.push(user)
    },

    /**
     * @desc: 监听回调方法
     */
    async initLiveRoom() {
      // 监听房间流更新
      const _this = this;
      this.client.on('roomStreamUpdate', (roomID, updateType, streamList) => {
        console.log(streamList, '监听房间流更新')
        const shareStreamList = JSON.parse(JSON.stringify(streamList));
        let tempStreamList = []
        streamList = streamList.filter(v => !!v.streamID && v.streamID.indexOf("share") == -1);


        if (updateType === 'ADD') {
          // 共享流更新
          _this.shareList = shareStreamList.filter(v => !!v.streamID && v.streamID.indexOf("share") > -1)[0];

          streamList.map(x => (x.isVideoOpen = x.isVideoOpen || false))
          tempStreamList = [..._this.streamList, ...streamList]
        }
        if (updateType === 'DELETE') {
          // 共享流更新
          _this.shareList = null;

          tempStreamList = _this.streamList.filter(x => x.streamID !== streamList[0].streamID)
        }
        _this.$set(
          _this,
          'streamList',
          tempStreamList.filter(v => !!v.streamID)
        )

        _this.$http.getJoinLiveList()
      })
      
      // 监听房间用户变化
      _this.client.on('roomUserUpdate', (roomID, updateType, userList) => {
        console.log(updateType, userList, '监听房间用户变化')
        if (updateType === 'ADD' && userList && userList.length) {
          // 去重
          userList.forEach(user => {
            const index = this.userList.findIndex(x => x.userID === user.userID)
            index === -1 && this.userList.push(user)
          })
        }
        if (updateType === 'DELETE' && userList && userList.length) {
          const index = this.userList.findIndex(x => x.userID === userList[0].userID)
          index !== -1 && this.userList.splice(index, 1)
        }
        this.$http.getAttendeeList()
        this.$http.getJoinLiveList()
      })
      
      // 监听摄像头状态
      _this.client.on('remoteCameraStatusUpdate', (streamID, status) => {
        console.log(streamID, status, 'streamID, status');
        const streamIndex = this.streamList.findIndex(item => streamID.endsWith(item.streamID))
        streamIndex !== -1 &&
          this.$set(this.streamList[streamIndex], 'isVideoOpen', status === 'OPEN')
      })
      
      _this.client.on('publisherStateUpdate', result => {
        if (result.state === 'PUBLISHING') {
          // redo
        }
      })
      
      // 推流质量回调
      _this.client.on('publishQualityUpdate', (streamID, stats) => {
        // console.log(streamID, stats, '推流质量')
      })
      
      // 监听房间状态
      this.client.on('roomStateUpdate', (roomID, state) => {
        this.roomState = state
        
        switch (state) {
          // 连接中
          case 'CONNECTING':
            // 点击退出时，不执行重连操作
            if (!_this.isquit) {
              this.offlineHandle()
            }
            
            break
          // 已连接
          case 'CONNECTED':
            this.initLoadingTimerHandle()
            break
          // 连接失败
          case 'DISCONNECTED':
            // 点击退出时，不执行重连操作
            if (!_this.isquit) {
              this.disconnectedHandle()
            }
            
            break
          default:
            break
        }
      })
      
      // 监听房间附加信息
      this.client.on('roomExtraInfoUpdate', (roomID, roomExtraInfoList) => {
        const roomExtraInfo = {
          type: roomExtraInfoList[0].key,
          data: roomExtraInfoList[0].value
        }
        // tips: 第一次emit组件还没渲染，监听不到
        // this.roomExtraInfo && this.emitRoomExtraInfoUpdate(roomExtraInfo)
        this.$set(this, 'roomExtraInfo', roomExtraInfo)
      })
      
      // 监听IM消息接收（弹幕消息）
      this.client.on('IMRecvBarrageMessage', (roomID, chatData) => {
        let data = {
          userID: chatData[0].fromUser.userID,
          messageCategory: 1,
          messageID: chatData[0].messageID,
          messageContent: [{ messageState: 3, content: chatData[0].message }],
          nick_name: chatData[0].fromUser.userName
        }
        this.setRoomMessage(1, data)
      })
      

      window.addEventListener('offline', () => {
        this.offlineHandle()
      })

      window.addEventListener('online', () => {
        // this.initLoadingTimerHandle()
        window.location.reload()
      })
    },

    
    /**
     * @desc 获取设备列表
     */
    async getDevices() {
      const devices = await this.client.express('enumDevices')
      this.$set(this, 'devices', devices)
      return devices
    },
    /**
     * @desc 设备选择处理
     * @param {'camera'|'mic'|'speak'} type
     * @param {boolean} value
     */
    async selectDevice(value, type) {
      const { localStream } = this.client
      switch (type) {
        case 'camera':
          localStream && await this.client.express('useVideoDevice', value)
          break
        case 'mic':
          localStream && await this.client.express('useAudioDevice', value)
          break
        case 'speak':
          this.$set(this.activeDevice, 'speaker', value)
          break
      }
    },
    /**
     * @desc {设置设备id}
     * @param {Object} activeDevice
     */
    setActiveDevice(activeDevice) {
      this.$set(this, 'activeDevice', activeDevice)
    },
    /**
     * @desc {推流}
     * @param {Object} publishOption
     */
    async createPushStream(publishOption = {}) {
      console.warn('createPushStream, 开始推流！')
      const { isVideoOpen, isAudioOpen } = publishOption
      const { camera, microphone } = this.activeDevice
      const option = {
        camera: {
          videoQuality: 4,
          width: 640,
          height: 360,
          bitRate: 600,
          frameRate: 15,
          video: isVideoOpen,
          audio: isAudioOpen
        }
      }
      if (camera) option.camera.videoInput = camera
      if (microphone) option.camera.audioInput = microphone

      await this.client.express('createStream', option)

      // 创建流 更新流列表 start
      console.warn('创建流 更新流列表 start')
      const { userID } = this.user
      this.isPushStreamList = true
      this.publishStreamId = `${this.client.isElectron ? 'ec' : 'web'}_${userID}_${Date.parse(new Date())}`
      if (this.isPushStreamList) {
        this.streamList.push({
          streamID: this.publishStreamId,
          type: 'push',
          stream: this.client.localStream,
          isVideoOpen: true,
          isAudioOpen: true,
          user: this.user
        })
        this.isPushStreamList = false
      }
      console.warn('创建流 更新流列表 end')
      // 创建流 更新流列表 end

      await this.client.express('startPublishingStream', this.publishStreamId, publishOption)
    },
    /**
     * @desc - 设备状态变更
     * @param {'video'|'audio'} flag
     * @param {boolean} isVideoOpen
     * @param {boolean} isAudioOpen
     * @returns {Promise<void>}
     */
    async handleDeviceStateChange(flag, isVideoOpen, isAudioOpen) {
      const [isSendVideoStream, isSendAudioStream] = [!isVideoOpen, !isAudioOpen]
      // 摄像头/麦克风 二者之一的状态是开 则推送一条流
      if (isVideoOpen || isAudioOpen) {
        if (!this.client.localStream) {
          if (this.client.isCreatingStream) return
          this.publishingFlag = flag
          await this.createPushStream({ isVideoOpen, isAudioOpen })
          await this.client.express('mutePublishStreamVideo', isSendVideoStream)
          await this.client.express('mutePublishStreamAudio', isSendAudioStream)
        } else {
          // 更新摄像头麦克风状态
          if (flag === 'video' || (isVideoOpen && isAudioOpen)) {
            // 是否停止发送视频流 -> true-表示不发送视频流 false-表示发送视频流
            this.client.express('mutePublishStreamVideo', isSendVideoStream)
            this.handleSelfVideoToggle(isVideoOpen)
          }
          if (flag === 'audio' || (isVideoOpen && isAudioOpen)) {
            this.client.express('mutePublishStreamAudio', isSendAudioStream)
            this.handleSelfAudioToggle(isAudioOpen)
          }
        }
      } else {
        // 如果摄像头和麦克风都是关闭，则销毁流
        this.handleDestroyStream()
      }
    },
    /**
     * @desc: 更新自身流摄像头状态
     * @param {isOpen}
     */
    handleSelfVideoToggle(isOpen) {
      const index = this.streamList.findIndex(stream => stream.user.isMe === true)
      if (index !== -1) {
        this.$set(this.streamList[index], 'isVideoOpen', isOpen)
      }
    },
    /**
     * @desc: 更新自身流麦克风状态
     * @param {isOpen}
     */
    handleSelfAudioToggle(isOpen) {
      const index = this.streamList.findIndex(stream => stream.user.isMe === true)
      if (index !== -1) {
        this.$set(this.streamList[index], 'isAudioOpen', isOpen)
      }
    },
    /**
     * @desc: 销毁流
     */
    handleDestroyStream() {
      this.client.express('stopPublishingStream', this.publishStreamId)
      const idx = this.streamList.findIndex(stream => stream.streamID === this.publishStreamId)
      idx !== -1 && this.streamList.splice(idx, 1)
    },
    /**
     * @desc: 开启预览
     * @param {streamID} 流id
     * @return {element} 预览dom
     */
    startPreview(streamID, element) {
      this.client.express('startPreview', streamID, element)
    },
    /**
     * @desc: 播放流
     * @param {streamID} 需播放目标流id
     * @param {playOption}
     * @param {element}
     */
    async startPlayingStream(streamID, playOption, element) {
      return await this.client.express('startPlayingStream', streamID, playOption, element)
    },
    /**
     * @desc: 停止播放流
     * @param {streamID} 需停止播放目标流id
     */
    stopPlayingStream(streamID) {
      this.client.express('stopPlayingStream', streamID)
    },

    /**
     * @desc 扬声器开关监听
     * @param {Function} cb
     */
    onMuteSpeaker(cb) {
      this.$on('muteSpeaker', cb)
    },

    /**
     * @desc 扬声器开关
     * @param {Boolean} isOpen
     */
    muteSpeaker(isOpen) {
      this.$emit('muteSpeaker', isOpen)
    },

    /**
     * @desc: 断网重连
     */

    offlineHandle() {
      if (this.loading || this.confirm) return
      this.loading = true
      this.loadingTimer = setInterval(() => {
        if (this.loadingInterval === 0) {
          this.disconnectedHandle()
        } else {
          this.loadingInterval--
        }
      }, 1000)
    },

    // 重连失败后处理
    disconnectedHandle() {
      this.streamList = []
      this.localStream = null
      this.initLoadingTimerHandle()
      this.$refs.errorDialog.show = true
      this.handleDestroyStream()
      this.$http.close()
    },

    // 初始化loading定时器
    initLoadingTimerHandle() {
      this.loadingTimer && clearInterval(this.loadingTimer)
      this.loadingTimer = null
      this.loadingInterval = 30
      if (this.loading) {
        this.loading = false
        this.$refs.errorDialog.show = false
      }
    },

    /**
     * @desc: 维护im聊天室消息
     * @param {*} type 设置类型 1-增加 2-更新
     * @param {*} data 消息主体
     * @return {*}
     */
    setRoomMessage(type, data, targetMessageID, res) {
      let lastMessage = this.messages[this.messages.length - 1]
      let lastUserID = this.messages[this.messages.length - 1] ? this.messages[this.messages.length - 1].userID : ''
      let lastMessageCategory = this.messages[this.messages.length - 1] ? this.messages[this.messages.length - 1].messageCategory : ''
      if (type === 1) {
        // 判断信息数组里面最新到一条信息是否是系统信息并且是否是同一个用户发送的，如果不是系统信息且是同一个用户发送则是该用户连续发送消息。
        if (lastMessage && data.userID == lastUserID && lastMessageCategory !== 2) {
          this.messages[this.messages.length - 1].messageContent.push({
            messageID: new Date().getTime(),
            messageState: 1,
            content: data.messageContent[0].content,
          })
        } else{
          this.messages.push(data)
        }
      } else if (type === 2) {
        /**
         * messageState状态：
         * 1 消息发送中
         * 2 发送失败
         * 3 发送成功
         */
        this.messages[this.messages.length - 1].messageContent.find(item => {
          if(item.messageID === targetMessageID){
            if(res.errorCode === 0){
              item.messageState = 3
              item.messageID = res.messageID
            } else {
              item.messageState = 2
            }
          }
        })
      }
    },

    /**
     * @desc: 大班课通过弹幕信息发送im消息
     * @param {*} message
     * @return {*}
     */
    async sendBarrageMessage(message) {
      let data = {
        userID: this.user.userID,
        messageCategory: 1,
        messageTimestamp: new Date().getTime(),
        messageContent: [{ messageState: 1, content: message, messageID: new Date().getTime()}],
        nick_name: this.user.userName
      }
      // 需要更新的目标消息id
      let targetMessageID = data.messageContent[0].messageID
      // 用户自身发送消息默认发送中状态，后续消息状态更新根据回调重置
      this.setRoomMessage(1, data)
      try {
        let res = await this.client.express('sendBarrageMessage', message)
         var num = 0,
          max = 5,
          intervalId = null;
        intervalId = setInterval(()=>{
          num++;
          console.warn('倒计时：',num)
          if(res){
            console.warn('发送成功')
            clearInterval(intervalId);
            // 消息发送成功，更新该消息状态
            if (res.errorCode === 0) this.setRoomMessage(2, data, targetMessageID, res)
            // 消息发送不成功，更新该消息状态
            if(res.errorCode !== 0) this.setRoomMessage(2, data, targetMessageID, res)
          }
          if(num === max){
            clearInterval(intervalId)
            // 超过60s接收不到状态回调，消息发送不成功，更新该消息状态
            this.setRoomMessage(2, data,targetMessageID, res)
          }
        },1000);
      } catch (error) {
        console.warn('------error----',error)
        this.setRoomMessage(2, data, targetMessageID, {errorCode: error})
      }
     
    },
  },
  destroyed() {
    // 清除定时器
    window.clearInterval(this.courseTipsTimer);
    window.clearInterval(this.endLiveTimer);
    // 离开页面时，清除存储的延长上课次数
    sessionStorage.getItem('extendNum') && sessionStorage.removeItem("extendNum");

    // 卸载监听浏览器刷新和关闭事件  
    window.removeEventListener('beforeunload', this.beforeunloadHandler)
    window.removeEventListener('unload', this.unloadHandler)
    this.$off(['muteSpeaker', 'roomExtraInfoUpdate'])
  }
}
</script>
<style lang="scss">
@import '../../../static/css/room/_mixin.scss';
.zego-live {
  height: 100%;
  .zego-live-dialog {
    border-radius: 4px;
    .el-dialog__header {
      border-bottom: 1px solid #efefef;
    }
    .el-dialog__body {
      padding: 4px 20px;
      .live-dialog-timer {
        .dialog-timer-first {
          span {
            font-size: 20px;
            font-weight: bold;
            color: red;
          }
        }
      }
    }
    .el-dialog__footer {
      .el-button {
        padding: 8px 20px;
      }
    }

  }
  .zego-live-room {
    height: 100%;
    width: 100%;
  }
  .zego-live-enter {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
