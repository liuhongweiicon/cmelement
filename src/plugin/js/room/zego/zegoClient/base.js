// import { storage } from '@/utils/tool'
import LiveHelper from '../helper/LiveHelper/index'
import WhiteboardHelper from '../helper/WhiteboardHelper'
import DocsHelper from '../helper/DocsHelper'
import Config from '../config/index'

export class ZegoClient {
  _client = null
  _docsClient = null
  liveClient = null
  shareClient = null
  docsClient = null
  screenCapture = null
  whiteboardClient = null
  protectList = ['liveClient', 'whiteboardClient', 'docsClient', 'shareClient']
  isElectron = false
  Config = null

  constructor() {
    this.state = {
      room_id: null,
      env: 'home',
      user: {},
      tokenInfo: {},
      isInit: false
    }
  }

  /**
   *
   * @param {初始化的client} client
   * @param {string} env
   * @param { Object | null } user
   * @returns {Promise<WhiteboardHelper|LiveHelper|DocsHelper>}
   */
  async init(client, env = 'home', constant = {}) {
    // 设置常量
    if (!this.Config) {
      this.Config = new Config(constant)
    }
    this.initConfig && (await this.initConfig(env))


    if (!this._client) {
      await this.initSDK(constant.USER_INFO)
    }
    // livingroom
    if (client === 'live') {
      const $client = this._client
      return (
        this.liveClient || (this.liveClient = new LiveHelper({ context: this, client: $client }))
      )
    }
    // 共享屏幕
    if (client === 'screenSharing') {
      const $client = this._client
      return (
        this.shareClient || (this.shareClient = new LiveHelper({ context: this, client: $client }))
      )
    }
    // 互动白板
    if (client === 'whiteboard') {
      return (
        this.whiteboardClient ||
        (this.whiteboardClient = new WhiteboardHelper({ context: this, client: this._client }))
      )
    }
    // 文件转码
    if (client === 'docs') {
      return (
        this.docsClient ||
        (this.docsClient = new DocsHelper({ context: this, client: this._docsClient }))
      )
    }
    
    

    this.lockProperty && this.lockProperty()
  }

  async initConfig(env) {
    if (!this.state.tokenInfo.token1) {
      await this.createZegoContext(env)
    }
    this.setState({ isInit: true, env }, () => {
      this.initConfig = null
    })
  }

  // 正式环境请调用自己的后台接口，token 生成方法请参考 ZEGO 开发者中心
  getToken = (appID, userID, tokenUrl) => {
    const url = `${tokenUrl}?app_id=${appID}&id_name=${userID}`
    return new Promise((resolve, reject) => {
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = e => {
        if (xmlhttp.readyState == 4) {
          if (xmlhttp.status == 200) {
            const info = JSON.parse(xmlhttp.response).data
            resolve(info);
          } else {
            reject(e);
          }
        }
      };
      xmlhttp.open(
        "GET",
        url,
        true
      );
      xmlhttp.send(null);
    });
  }

  async createZegoContext(roomEnv) {
    const { appID, userID, isTestEnv, docsviewAppID, tokenUrl } = await this.Config.getParams(roomEnv)
    const token1 = await this.getToken(appID, userID, tokenUrl)
    let token2 = token1
    if (docsviewAppID != appID && !isTestEnv) {
      token2 = await this.getToken(docsviewAppID, userID, tokenUrl)
    }
    this.setState({
      env: roomEnv,
      tokenInfo: { token1, token2 }
    })
  }

  /**
   * @desc: 初始化web端sdk
   * @param {user} 用户信息
   */
  async initSDK(user) {
  }

  lockProperty() {
    this.protectList.forEach(key => {
      const temp = this[key]
      Object.defineProperty(this, key, {
        get: () => {
          return temp
        },
        set: () => {
          console.warn(`受保护的属性: ${key}，禁止修改！`)
          return temp
        }
      })
    })
    this.lockProperty = null
  }

  /**
   * @desc 状态更新
   * @param {Object} state
   * @param {function | none} cb
   */
  setState(state, cb = null) {
    if (Object.prototype.toString.call(state) !== '[object Object]') return
    const keys = Object.keys(state)
    keys.reduce((acc, key) => {
      acc[key] = state[key]
      return acc
    }, this.state)
    cb && cb()
  }

  getState(...args) {
    return args.reduce((acc, k) => {
      acc[k] = this.state[k]
      return acc
    }, {})
  }
}
