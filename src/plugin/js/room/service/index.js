




import zegoClient from '../zego/zegoClient/index'
class HTTP {
    url = '';
    config = null;


    
    roomId = ''
    uid = ''
    name = ''
    role = 0
    heartBeatId = 0
    attendeeListSeq = 0
    joinLiveListSeq = 0
    attendeeList = []
    joinLiveList = []
    params = {}
    auth = {}
    inited = false
    /**
     * 
     * @param {*request} request http库
     * @param {constants} constants 用户配置直播间常量
     */
    constructor(request, constants) {
        this.config = constants;
        
        this.auth = { camera: this.config.STATE_OPEN, mic: this.config.STATE_OPEN, can_share: this.config.STATE_CLOSE, share: false }
        this.$http = request;
        this.url = constants.hostMap;
    }

    postRoomHttp = async (api, data) => {
      const res = await this.$http.post(this.url + api, data);

      return new Promise((resolve, reject) => {
          if (res.ret.code !== 0) {
            Message.closeAll()
            Message({
              customClass: 'common-toast',
              type: 'error',
              message: res.ret.message
            })
          }
          resolve(res)
      });
    }
    
    // 登陆房间
    loginRoom(data) {
        return this.postRoomHttp('login_room', data);
    }

    // 离开房间
    leaveRoom() {
      return this.postRoomHttp('leave_room', this.params);
    }

    
    // 结束教学
    endTeaching() {
      return this.postRoomHttp('end_teaching', this.params);
    }

    
    // 开启共享屏幕，退出共享文件白板
    closeWhiteboard(params) {
      return this.postRoomHttp('closeWhiteboard', params);
    }

    
    // 展示白板，共享文件
    shareWhiteboard(params) {
      return this.postRoomHttp('shareWhiteboard', params);
    }
 
    init({ roomId, uid, name, role, classScene }) {
        this.roomId = roomId
        this.uid = uid
        this.name = name
        this.role = role
        this.params.room_id = roomId
        // this.params.uid = Number(uid)
        this.params.uid = uid
        this.params.room_type = classScene || 1
        if (role == this.config.ROLE_TEACHER) {
          this.auth.can_share = this.config.STATE_OPEN
          this.auth.share = true
        }
        if (!this.inited) {
          this.inited = true
          // vue组件监听事件设置完毕后才能开始
          setTimeout(() => {
            this.startHeartBeat()
            this.registerPushEvent()
            this.getAttendeeList()
              .then(this.getJoinLiveList.bind(this))
              .then(this.getControlAuth.bind(this))
          })
        }
      }
    
    registerPushEvent() {
      const socket = zegoClient._client.zegoWebRTC.socketCenter.websocket
      if (socket) {
        socket.addEventListener('message', res => {
          const reg = /custommsg.*custom_content.*cmd.*10[1-7]/
          
          if (!res.data || !reg.test(res.data)) return
          try {
            res = JSON.parse(res.data)
            res = JSON.parse(res.body.custommsg)
            res = JSON.parse(res.custom_content)
            console.log('====edu_zpush====', res, this)
            if (res.cmd == 102) {
              this.onUserStateChange(res.data)
            } else if (res.cmd == 103) {
              this.notifyAttendeeChange(res.data)
              this.getAttendeeList()
            } else if (res.cmd == 104) {
              this.getJoinLiveList()
              if (this.role == this.config.ROLE_STUDENT) {
                this.getAttendeeList()
              }
            } else if (res.cmd == 105) {
              this.onEndTeaching()
            }
          } catch (e) {
            console.error('====edu_zpush====', e)
          }
        })
      }
    }
  
    onUserStateChange(data) {
      const uid = this.uid
      if (data.type == 1 || !data.users) return
      if (this.role == this.config.ROLE_TEACHER) {
        // 老师主动改变自己状态
        if (data.oprator_uid == uid && data.users.find(v => v.uid == uid)) return
        // 学生状态改变，老师同步用户列表和连麦列表
        this.getAttendeeList()
        this.getJoinLiveList()
        return
      }
      // 学生主动改变自己状态
      console.log(this.role, this.config, this.config.ROLE_STUDENT, data.oprator_uid, uid, 'this.role, this.config, this.config.ROLE_STUDENT, data.oprator_uid, uid')
      console.log(this.role == this.config.ROLE_STUDENT && data.oprator_uid == uid, 'this.role == this.config.ROLE_STUDENT && data.oprator_uid == uid');
      // debugger
      if (this.role == this.config.ROLE_STUDENT && data.oprator_uid == uid) return
      // 学生自己状态被动改变，消息提示
      const user = data.users.find(v => v.uid == uid)
      if (this.role == this.config.ROLE_STUDENT && user) {
        let str = ''
        if (data.type == 4) {
          str = user.can_share == this.config.STATE_CLOSE ? '老师已收回你的共享权限' : '老师已允许你使用共享功能'
        } else if (data.type == 2) {
          str = user.camera == this.config.STATE_CLOSE ? '老师已关闭你的摄像头' : '老师已开启你的摄像头'
        } else if (data.type == 3) {
          str = user.mic == this.config.STATE_CLOSE ? '老师已关闭你的麦克风' : '老师已开启你的麦克风'
        }
        this.auth.camera = user.camera
        this.auth.mic = user.mic
        this.auth.can_share = user.can_share
        this.auth.share = user.can_share == this.config.STATE_OPEN
        str && Message({ customClass: 'common-toast', type: 'info', message: str })
      }
      // 同步所有人状态
      const map = data.users.reduce((s, v) => {
        s[v.uid] = v
        return s
      }, {})
      BUS.$emit('userStateChange', map)
    }
  
    onEndTeaching() {
      BUS.$emit('endTeaching', true)
    }
  

    /**
     * 需定时调用心跳接口，间隔时长为响应参数 interval 取值，否则一段时间后用户会被自动下线
     */
    async startHeartBeat() {
      if (!this.inited) return
      const { data } = await this.postRoomHttp('heartbeat', this.params)
      if (data.interval) {
        this.attendeeListSeq = data.attendee_list_seq
        this.joinLiveListSeq = data.join_live_list_seq
        this.stopHeartBeat()
        this.heartBeatId = setInterval(async () => {
          try {
            const { data } = await this.postRoomHttp('heartbeat', this.params)
            let attendeeListSeq = data.attendee_list_seq
            let joinLiveListSeq = data.join_live_list_seq
            if (attendeeListSeq > this.attendeeListSeq) {
              this.getAttendeeList()
            }
            if (joinLiveListSeq > this.joinLiveListSeq) {
              this.getJoinLiveList()
            }
            this.attendeeListSeq = attendeeListSeq
            this.joinLiveListSeq = joinLiveListSeq
          } catch (e) {
            this.stopHeartBeat()
          }
        }, data.interval * 1000)
      }
    }
  
    stopHeartBeat() {
      this.heartBeatId && clearInterval(this.heartBeatId)
      this.heartBeatId = 0
    }
    
    //拉取教室内在线的成员信息，包括用户角色、用户 ID、用户昵称、用户摄像头和麦克风状态、用户权限等。
    async getAttendeeList() {
      if (!this.inited) return
      const res = await this.postRoomHttp('get_attendee_list', this.params)
      const list = []
      const arr = res.data.attendee_list
      if (arr && arr.length) {
        let index = arr.findIndex(v => v.uid && v.role == this.config.ROLE_TEACHER)
        // 老师排第一位
        if (index != -1) {
          list.push(arr[index])
          arr.splice(index, 1)
        }
        // 学生自己第二位
        if (this.role == this.config.ROLE_STUDENT) {
          index = arr.findIndex(v => this.uid == v.uid)
          if (index != -1) {
            list.push(arr[index])
            arr.splice(index, 1)
          }
        }
        // 加入麦位学生，按加入课堂时间，从前到后排序
        let temp = arr
          .filter(v => v.uid && v.camera + v.mic > 2)
          .sort((a, b) => a.login_time - b.login_time)
        list.push(...temp)
        // 未加入麦位学生，按加入课堂时间，从前到后排序
        temp = arr
          .filter(v => v.uid && v.camera + v.mic <= 2)
          .sort((a, b) => a.login_time - b.login_time)
        list.push(...temp)
      }
      this.attendeeList = list
      BUS.$emit('roomAttendeesChange', list)
      return list
    }
  

    // 拉取教室内连麦中的成员信息，包括用户角色、用户 ID、用户昵称、用户摄像头和麦克风状态、用户权限等。
    async getJoinLiveList() {
      if (!this.inited) return
      const res = await this.postRoomHttp('get_join_live_list', this.params)
      const teacher =
        this.attendeeList[0] && this.attendeeList[0].role == this.config.ROLE_TEACHER
          ? this.attendeeList[0]
          : {
              uid: '',
              nick_name: '',
              role: this.config.ROLE_TEACHER,
              camera: this.config.STATE_CLOSE,
              mic: this.config.STATE_CLOSE,
              can_share: this.config.STATE_OPEN,
              join_live_time: 0
            }
      const list = [teacher]
      const arr = res.data.join_live_list
      if (arr && arr.length) {
        let index = arr.findIndex(v => v.uid && v.role == this.config.ROLE_TEACHER)
        // 老师排第一位
        if (index != -1) {
          list[0] = arr[index]
          // 标志老师是否连麦
          list[0].joing = true
          arr.splice(index, 1)
        }
        // 学生按加入麦位时间先后顺序排列
        const temp = arr
          .filter(v => v.uid && v.role == this.config.ROLE_STUDENT)
          .sort((a, b) => a.join_live_time - b.join_live_time)
        list.push(...temp)
      }
      this.joinLiveList = list
      BUS.$emit('roomJoinLivesChange', list)
      return list
    }
    

    // 修改教室内某个用户的属性信息，包括用户角色、用户 ID、用户昵称、摄像头和麦克风状态、用户权限等。
    async setUserInfo(params) {
      
      if (!this.inited) return
      const res = await this.postRoomHttp('set_user_info', { ...params, ...this.params });
      
      const id = params.target_uid
      let user = this.attendeeList.find(v => v.uid == id)
      if (user) Object.assign(user, params)
      user = this.joinLiveList.find(v => v.uid == id)
      if (user) Object.assign(user, params)
      return res
    }
  
    async getControlAuth() {
      if (this.role == this.config.ROLE_STUDENT) {
        const id = this.uid
        const self = this.attendeeList.find(v => v.uid == id)
        if (this.joinLiveList.length >= 4 && !this.joinLiveList.some(v => v.uid == this.uid)) {
          this.auth.camera = this.config.STATE_CLOSE
          this.auth.mic = this.config.STATE_CLOSE
        }
        BUS.$emit('userStateChange', { [this.uid]: this.auth })
      }
    }
  
    close() {
      const id = this.uid
      this.attendeeList.some(v => {
        if (v.uid == id) {
          v.camera = this.config.STATE_CLOSE
          v.mic = this.config.STATE_CLOSE
          return true
        }
        return false
      })
      this.joinLiveList.some(v => {
        if (v.uid == id) {
          v.camera = this.config.STATE_CLOSE
          v.mic = this.config.STATE_CLOSE
          return true
        }
        return false
      })
      this.stopHeartBeat()
    }
  
    notifyAttendeeChange(res) {
      BUS.$emit('imAttendeesChange', res)
    }

}

export default HTTP