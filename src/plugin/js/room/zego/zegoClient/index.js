import { ZegoClient } from './base'
import config from '../config/web'

class WebZegoClient extends ZegoClient {
  /**
   * @desc: 初始化web端sdk
   * @param {user} 用户信息
   */
  async initSDK(user) {
    debugger
    if (this._client) return
    console.warn('init web sdk start')
    const { userID } = user
    const { env = 'home' } = this.state
    const { appID, logURL, server, isTestEnv, docsviewAppID } = await this.Config.getParams(env)
    console.warn('-----env Config-----',{ appID, logURL, server, isTestEnv, docsviewAppID } )
    const zg = new window.ZegoExpressEngine(appID, server)
    const zgDocsClient = new window.ZegoExpressDocs({
      appID: docsviewAppID,
      token: this.state.tokenInfo.token2,
      userID,
      isTestEnv
    })
    if (zg) console.log('init web sdk success!')
    console.log('web sdk version ', zg.getVersion())
    if (zgDocsClient) console.log('init docs sdk success!')
    console.log('docs sdk version ', zgDocsClient.getVersion())
    this._client = zg
    const config = {
      logLevel: 3
    }
    logURL && (config.logURL = logURL)
    this.setState({ user })
    zg.setLogConfig(config)
    // 测试环境中关闭调试模式，否则任何sdk错误均会alert弹出
    zg.setDebugVerbose(false)

    this._docsClient = zgDocsClient

    console.warn('init web sdk done')
  }
}

export default new WebZegoClient(config)
