


import $HTTP from '../service/index'

import zegoClient from '../zego/zegoClient/index'

class screencap {
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
     * 调用顺序：loginRoomBiz -> initClient -> initLiveRoom -> loginRoom | 创建房间 -> 初始化sdk -> 监听回调方法 -> 登录房间
     */
    async startCap() {
        await this.loginRoomBiz(); // 创建房间
        await this.initClient(); // 初始化ADK
        await this.initLiveRoom(); // 监听回调方法
        await this.loginRoom(); // 用户登陆房间

        await this.handleCreateStream(); // 捕获屏幕,并推流(录屏)

        await this.tryJionLive(); // 开始摄像头和麦克风,创建流并推流
    }

    /**
     * 结束录屏
     */
    async endCap() {
        await this.zegoLiveRoom.shareClient.express('stopPublishingStream', this.streamID);
        await this.zegoLiveRoom.shareClient.express('stopPublishingStream', this.streamID);

        // 后台业务-退出房间
        await this.$http.leaveRoom();
        // 退出房间
        zegoClient._client.logoutRoom(this.config.USER_INFO.roomId)
    }

    /**
     * @desc: 后台业务 - 登录房间
     */
    async loginRoomBiz() {
        const { roomId, userID, userName, role, classScene } = this.config.USER_INFO;
        const loginParams = {
            uid: Number(userID),
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
        const res = await this.client.express('loginRoom', this.thisParent.liveRoomParams.USER_INFO.roomId);
        if (res.error) {
          this.$message.error(res.msg);
        }
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
        await this.zegoLiveRoom.shareClient.express('createStream', option);
        
        this.screenStreamId = `share_` + Date.parse(new Date());
        
        await this.zegoLiveRoom.shareClient.express('startPublishingStream', this.screenStreamId, {})
    }

    /**
     * @desc {摄像头推流}
     * @param {Object} publishOption
     */
    async createPushStream(publishOption = {}) {
        console.warn('createPushStream, 开始推流！')
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
    }

    
    /**
     * @desc: 用户进入房间尝试开启摄像头和麦克风
     */
    async tryJionLive() {
        // 开启摄像头
        this.getUserMediaAuth(0, false, async () => {
            await this.createPushStream(
                { 
                    isVideoOpen: this.$http.auth.camera == this.liveRoomParams.STATE_OPEN, 
                    isAudioOpen: this.$http.auth.mic == this.liveRoomParams.STATE_OPEN 
                }
            )
        })
        // 开启麦克风
        this.getUserMediaAuth(1, false, async () => {
            
            await this.createPushStream(
                { 
                    isVideoOpen: this.$http.auth.camera == this.liveRoomParams.STATE_OPEN, 
                    isAudioOpen: this.$http.auth.mic == this.liveRoomParams.STATE_OPEN 
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

export default screencap;