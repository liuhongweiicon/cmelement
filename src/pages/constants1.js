/**
 * @name constants.js
 * @desc 定义常量
 *
 */

//AppID 
const APPID = {
  home: 4057099555,
  overseas: 4057099555
}

// 用于后台服务请求接口的鉴权校验
const serverSecret = 'd9ecd57052284ebcc997cadd323824ca';

// 是否是测试环境, => true 测试环境 => 正式环境
const ENVTYPE = true;

// 用户信息
const USER_INFO = {
  userID: '6a81c7ca-e923-4893-b21c-b44b001eaddd', // 用户id
  roomId: '554736907834183680', // 房间id
  userName: '刘喜喜', // 用户姓名
  role: 2, // 进入直播间的角色 1 => 教师 2 => 学生
  isMe: true, // 本身标识
}

// 国内环境或海外环境
// home => 国内环境
// overseas => 海外环境
const AREA_ENV = 'home';

// 房间最大连接数
const maxMemberCount = 20;

// 用户管理服务接口
const hostMap = 'http://tj.xinguoren.cn/g/liveroom/zego/';
// const hostMap = 'http://192.168.1.57:8192/liveroom/zego/';

/**
 * 登陆房间token请求地址
 */
const getTokenUrl = hostMap + 'thirdToken';

//构建即构示例服务器地址参数
const SERVER = {
  home: 'wss://webliveroom-test.zego.im/ws', //国内服务器地址
  overseas: 'wss://webliveroom-alpha.zego.im/ws' //海外服务器地址
}

/**
 * 大班课和小班课
 * 1 => 小班课 2 => 大班课
 */
const classScene = 1;


export default { 
  APPID, 
  SERVER, 
  serverSecret, 
  ENVTYPE, 
  getTokenUrl, 
  USER_INFO, 
  AREA_ENV, 
  maxMemberCount, 
  hostMap,
  classScene
}
