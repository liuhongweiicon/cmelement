


import $HTTP from '../service/index'

import zegoClient from '../zego/zegoClient/index'


import { getUserMedia } from '../utils/browser'

class screenCap {
    config = null; // 直播间参数
    $http = null; // 请求库
    lient = null; // 摄像头
    screenStreamId = null; // 采集屏幕流ID
    publishStreamId = null; // 摄像头流ID
    
    client =  null; // 视频流实例
    shareClient = null; // 采集屏幕流实例

    /**
     * 
     * @param {*request} request http库
     * @param {constants} constants 用户配置直播间常量
     */
    constructor(request, constants) {
        this.config = constants;
        this.$http = new $HTTP(request, constants); // 请求库实例
    }
    

    /**
     * 开始录屏
     * 调用顺序：loginRoomBiz -> initClient -> initLiveRoom -> loginRoom -> httpInit | 创建房间 -> 初始化sdk -> 监听回调方法 -> 登录房间 -> 保持登陆状态
     */
    async startCap() {
        

        await this.loginRoomBiz(); // 创建房间
        await this.initClient(); // 初始化ADK
        await this.initLiveRoom(); // 监听回调方法
        await this.loginRoom(); // 用户登陆房间

        await this.httpInit(); // 初始化,保持登陆状态

        await this.handleCreateStream(); // 捕获屏幕,并推流(录屏)

        await this.tryJionLive(); // 开始摄像头和麦克风,创建流并推流

    }

    /**
     * 结束录屏
     */
    async endCap() {
        this.$http.heartBeatId && clearInterval(this.$http.heartBeatId);
        this.$http.heartBeatId = 0
        await this.shareClient.express('stopPublishingStream', this.streamID);
        await this.shareClient.express('stopPublishingStream', this.publishStreamId);
        // 退出房间
        const res = await zegoClient._client.logoutRoom(this.config.USER_INFO.roomId);
        // 后台业务-退出房间
        await this.$http.leaveRoom();
    }

    /**
     * @desc: 后台业务 - 登录房间
     */
    async loginRoomBiz() {
        const { roomId, userID, userName, role, classScene } = this.config.USER_INFO;
        const loginParams = {
            uid: Number(userID),
            // uid: userID,
            room_id: roomId,
            nick_name: userName,
            role: role || 2,
            room_type: classScene || 1
        }
        await this.$http.loginRoom(loginParams);
    }

    
    /**
     * @desc: 初始化sdk
     */
    async initClient() {
        this.client = await zegoClient.init('live', this.config.AREA_ENV, this.config)
        this.shareClient = await zegoClient.init('screenSharing', this.config.AREA_ENV)
    }

    /**
     * @desc: sdk - 登录房间
     */
    async loginRoom() {
        const res = await this.client.express('loginRoom', this.config.USER_INFO.roomId);
        if (res.error) {
          this.$message.error(res.msg);
        }
    }

    /**
     * 初始化,监听房间人数等信息变化
     */
    
    async httpInit() {
        const { roomId, userID, userName, role } = this.config.USER_INFO;
        await this.$http.init({ roomId, uid: userID, name: userName, role }); // 初始化,监听房间人数等信息变化
    }

    
    /**
     * @desc: 监听回调方法
     */
    async initLiveRoom() {
      const _this = this;

      // 监听停止共享
      this.shareClient.on('screenSharingEnded', () => {
        _this.endCap()
      });
    }

    
    /**
     *捕获屏幕,并推流
     * 
     */
    async handleCreateStream() {
        const option = {
          screen: {
            //@ts-ignore
            audio: true,
            videoQuality: 4,
            bitRate: 6000,
            frameRate: 2,
            width: 1280,
            height: 720
          }
        }
        console.warn('createPushStream, 开始推捕获屏幕流！')
        await this.shareClient.express('createStream', option);
        
        this.screenStreamId = `share_` + Date.parse(new Date());
        
        await this.shareClient.express('startPublishingStream', this.screenStreamId, {})
        console.warn('createPushStream, 推捕获屏幕流成功！')
    }

    /**
     * @desc {摄像头推流}
     * @param {Object} publishOption
     */
    async createPushStream(publishOption = {}) {
        if (this.publishStreamId) return;
        this.publishStreamId =  `web_` + Date.parse(new Date());
        console.warn('createPushStream, 开始推摄像头流！')
        const { isVideoOpen, isAudioOpen } = publishOption
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

        await this.client.express('createStream', option)
        
        await this.client.express('startPublishingStream', this.publishStreamId, publishOption)
        console.warn('createPushStream, 推摄像头流成功！')
    }

    
    /**
     * @desc: 用户进入房间尝试开启摄像头和麦克风
     */
    async tryJionLive() {
        // 开启摄像头
        this.getUserMediaAuth(0, false, async () => {
            await this.createPushStream(
                { 
                    isVideoOpen: this.$http.auth.camera == this.config.STATE_OPEN, 
                    isAudioOpen: this.$http.auth.mic == this.config.STATE_OPEN 
                }
            )
        })
        // 开启麦克风
        this.getUserMediaAuth(1, false, async () => {
            
            await this.createPushStream(
                { 
                    isVideoOpen: this.$http.auth.camera == this.config.STATE_OPEN, 
                    isAudioOpen: this.$http.auth.mic == this.config.STATE_OPEN 
                }
            )
        })
    }

    
    /**
     * @desc: 获取设备权限
     * @param {num} 0video 1audio undefined return
     * @param {showErrorToast} 展示错误提示，默认true
     * @param {cb} 回调方法
     */
    getUserMediaAuth(num, showErrorToast = true, cb) {
        const _this = this;
        const option = {
          video: num == 0,
          audio: num == 1
        }
        /**
         * @desc: 获取设备权限
         * @param {option} 需要获取权限的设备
         * @param {success} 成功时执行的回调方法
         * @param {error} 失败时执行的回调方法
         */
  
        getUserMedia(
          option,
          stream => {
            _this.controlBtnList[num].noAuth = false
            console.warn('图标权限----',_this.controlBtnList[num])
            if (num === 0) {
              stream.getVideoTracks().forEach(track => track.stop())
            } else if (num === 1) {
              stream.getAudioTracks().forEach(track => track.stop())
            }
            console.warn(`${_this.controlBtnList[num].cnName}权限获取成功`)

            cb && cb()
          },
          error => {
            cb && cb(error)
          }
        )
    }

    

}

export default screenCap;