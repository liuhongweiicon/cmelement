

export class LiveHelper {
  _client = null
  constructor({ context, client }) {
    
    // this.context = context
    this._client = client
    this.room_id = null
    this.roomUserList = []
    this.localStream = null
    this.stream_publish_state = 'NO_PUBLISH' // NO_PUBLISH-未推流状态｜PUBLISH_REQUESTING-正在请求推流状态｜PUBLISHING-正在推流状态
    this.isCreatingStream = false
    // this.proxy()
  }

  /**
   * 监听事件
   */
  on(eventName, callback) {
    console.log('监听事件: ', eventName);
    this._client && this._client.on(eventName, callback)
  }

  getProxyFunc() {
    return [
      'createStream',
      'startPreview',
      'startPublishingStream',
      'startPlayingStream',
      'mutePublishStreamAudio',
      'mutePublishStreamVideo',
      'loginRoom',
      'enumDevices',
      'useVideoDevice',
      'useAudioDevice',
      'stopPlayingStream',
      'stopPublishingStream',
      'setRoomExtraInfo',
      'sendBarrageMessage',
    ]
  }

  /**
   * 通用调底层方法, 抹平请求接口差异
   * @param {方法名称} methodName
   * @param {参数} args
   * @returns {*}
   */
  express(methodName = '', ...args) {
    const proxyFunc = this.getProxyFunc()
    if (proxyFunc.some(func => func === methodName)) {
      return this[methodName](...args)
    } else {
      console.warn('不存在该方法, methodName=', methodName)
    }
  }

  async loginRoom(roomID = '', config = {}) {

    const { token1 } = window.zg_ZegoClient.state.tokenInfo
    config = { userUpdate: true, maxMemberCount: window.zg_ZegoClient.Config.maxMemberCount, ...config }
    const { userID, userName } = window.zg_ZegoClient.state.user
   
    let res
    try {
      const args = [roomID, token1, { userID, userName }, config]
     console.log(args, 'argsargsargsargs')
      res = await this._client.loginRoom(...args);
     
      if (res) {
        console.warn('loginRoom is success!!')
        this.afterLoginRoom(roomID)
      }
      res = {
        error: false
      }
      window.zg_ZegoClient.setState({ tokenInfo: {} })
    } catch (e) {
      console.log('login error', { e })
      window.zg_ZegoClient.setState({ tokenInfo: {} })
      res = {
        error: true,
        msg: e.msg,
        code: e.code
      }
    }
    return res
  }

  afterLoginRoom(roomId) {
    this.room_id = roomId
    this.roomUserList.push(window.zg_ZegoClient.state.user)
    window.zg_ZegoClient.setState({
      isLogin: true,
      room_id: roomId
    })
  }

  async createStream(option) {
    debugger
    if (this.isCreatingStream) return;
    this.isCreatingStream = true;
    this.localStream = await this._client.createStream(option);
    return this.localStream;
  }
  

  startPublishingStream(streamID, publishOption) {
    if (!this.localStream) {
      console.warn('this.localStream is not exist！!')
      return
    }
    return this._client.startPublishingStream(streamID, this.localStream, publishOption)
  }

  // 检测浏览器是否支持共享
  async checkAnRun(checkScreen) {
    try {
        const result = await this._client.checkSystemRequirements();
        if (!result.webRTC) {
            alert('浏览器不支持webRTC协议传输流!!');
            return false;
        } else if (!result.videoCodec.H264 && !result.videoCodec.VP8) {
            alert('浏览器不支持的 H264 和 VP8 视频编码格式');
            return false;
        } else if (result.videoCodec.H264 && checkScreen && !result.screenSharing) {
          alert('浏览器不支持共享屏幕');
            return false;
        }
        return true;
    } catch (err) {
        return false;
    }


  }

  startPreview(streamID, element) {
    console.warn('startPreview')
    let $video = document.getElementById(streamID)
    this.removeElementVideo(element)
    if (!$video) {
      $video = document.createElement('video')
      $video.style.width = '100%'
      $video.style.height = '100%'
      $video.setAttribute('autoplay', true)
      $video.setAttribute('muted', true)
      $video.setAttribute('id', streamID)
      element.appendChild($video)
    }
    $video.srcObject = this.localStream
  }

  // 重写startPlayingStream
  async startPlayingStream(streamID, playOption = {}, element) {
    const stream = await this._client.startPlayingStream(streamID, playOption)
    let $video = document.getElementById(streamID)
    this.removeElementVideo(element)
    if (!$video) {
      $video = document.createElement('video')
      
      $video.style.width = '100%'
      $video.style.height = '100%'
      $video.setAttribute('autoplay', true)
      $video.setAttribute('muted', true)
      $video.setAttribute('id', streamID)
      $video.style.position = 'absolute'
      $video.style.left = 0
      $video.style.top = 0
      element.appendChild($video)
    }
    $video.srcObject = stream
  }

  removeElementVideo(element) {
    if (element.removeChild) {
      let $videos = element.getElementsByTagName('video')
      if ($videos.length) {
        for (let i = 0; i < $videos.length; i++) {
          element.removeChild($videos[i])
        }
      }
      $videos = null
    }
  }

  mutePublishStreamAudio(mute) {
    return this._client.mutePublishStreamAudio(this.localStream, mute)
  }

  mutePublishStreamVideo(mute) {
    return this._client.mutePublishStreamVideo(this.localStream, mute)
  }

  async enumDevices() {
    return await this._client.enumDevices()
  }

  async useVideoDevice(value) {
    return await this._client.useVideoDevice(this.localStream, value)
  }

  async useAudioDevice(value) {
    return await this._client.useAudioDevice(this.localStream, value)
  }

  stopPlayingStream(streamID) {
    this._client.stopPlayingStream(streamID)
  }

  stopPublishingStream(streamID) {
    this._client.stopPublishingStream(streamID)
    this.destroyStream()
    return Promise.resolve(true)
  }

  destroyStream() {
    
    this._client.destroyStream(this.localStream)
    this.localStream = null
    this.isCreatingStream = false
  }

  setRoomExtraInfo(key, value) {
    this._client.setRoomExtraInfo(this.room_id, key, value)
  }

  async sendBarrageMessage(message) {
    return await this._client.sendBarrageMessage(this.room_id, message)
  }
}
