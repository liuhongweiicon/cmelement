
/**
 * go class配置梳理:
 * 1. 构建环境分为：
 *    * 测试环境 - ZEGOENV.wb=[alpha|test]
 *    * 生产环境 - ZEGOENV.wb=
 * 2. 房间环境分为国内(home)和海外(oversea)环境；
 * 3. 目前项目要使得多个场景相同roomID不相互影响，一个场景需要一套appID配置
 * 4. 当构建环境为test时，无论当前房间环境为国内还是国外, docview appID返回test配置的appID
 * 5. 海外环境的docview取的是home的appid配置
 */

 class Config {
  constructor(constant) {
    this.constant = constant; // 自定义的常量
    this.tokenUrl = constant.getTokenUrl // 获取登陆token请求地址
    // 设置连接环境是否是测试环境,true为测试环境，false为正式环境
    this.isTestEnv = constant.ENVTYPE // 是否是测试环境, => true 测试环境 => 正式环境
    this.homeAppID = constant.APPID.home // 国内环境appID
    this.overseasAppID = constant.APPID.overseas // 海外环境appID

    this.homesServer = constant.SERVER.home // 国内环境服务器地址
    this.overseasServer = constant.SERVER.overseas // 海外环境服务器地址
    this.maxMemberCount = constant.maxMemberCount; // 房间最大连接数
    this.userID = constant.USER_INFO.userID
    // 国内环境配置
    this.home = this.createConfig(
      this.homeAppID,
      this.homesServer,
      '',
      this.userID,
      [],
    )

    // 海外环境配置
    this.overseas = this.createConfig(
      this.overseasAppID,
      this.overseasServer,
      '',
      this.userID,
      [],
    )
  }

  createConfig(appID, server, logURL, userID, fileList) {
    return {
      appID,
      docsviewAppID: appID,
      server,
      logURL,
      userID,
      fileList,
      isTestEnv: this.isTestEnv,
      tokenUrl: this.tokenUrl,
      maxMemberCount: this.maxMemberCount,
    }
  }

  async getParams(env = 'home') {
    const obj = {}
    if (this.isTestEnv) {
      obj.fileList = this.constant.DOCS_TEST
    }

    if (env === 'overseas') {
      obj.docsviewAppID = this.home.appID
    }
    Object.assign(this[env], obj)
    return this[env]
  }
}

export default Config
