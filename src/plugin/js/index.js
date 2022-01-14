const S4 = () =>
  (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
const guid = () =>
  `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;

/**
 * 睡眠时间
 * 结合ES6的 async await generator
 * @param {number} time
 */
const sleep = (time) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);

      
    }, time);
  });
let clientWidth = document.body.clientWidth,
fontSizes = '30px'
if (clientWidth>=850&&clientWidth <= 1280) {
    fontSizes = '25px'
}
// 对get求情进行编码
const encodeSearchParams = (obj) => {
  const params = [];
  Object.keys(obj).forEach((key) => {
    let value = obj[key];
    // 如果值为undefined我们将其置空
    if (typeof value === "undefined") {
      value = "";
    }
    // 对于需要编码的文本（比如说中文）我们要进行编码
    params.push([key, encodeURIComponent(value)].join("="));
  });
  return params.join("&");
};

const isEmpty = (value) => {
  switch (typeof value) {
    case "undefined":
      return true;
    case "string":
      if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, "").length === 0)
        return true;
      break;
    case "boolean":
      if (!value) return true;
      break;
    case "number":
      if (value === 0 || isNaN(value)) return true;
      break;
    case "object":
      if (value === null || value.length === 0) return true;
      for (const key in value) {
        return false;
      }
      return true;
    default:
  }
  return false;
};

/**
 *
 * @param {判断是否是json字符串} val
 */

const isJSON = (str) => {
  if (isObject(str)) return true;

  if (!isString(str)) return false;

  str = str.replace(/\s/g, "").replace(/\n|\r/, "");

  if (/^\{(.*?)\}$/.test(str)) return /"(.*?)":(.*?)/g.test(str);

  if (/^\[(.*?)\]$/.test(str)) {
    return str
      .replace(/^\[/, "")
      .replace(/\]$/, "")
      .replace(/},{/g, "}\n{")
      .split(/\n/)
      .map(function(s) {
        return isJSON(s);
      })
      .reduce(function(prev, curr) {
        return !!curr;
      });
  }

  return false;
};
  
  function isString (x) {
    return Object.prototype.toString.call(x) === '[object String]';
  }
  
  function isObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

// 处理学科属于哪个学段

const gradeToStage = (val) => {
  if (!val) return;
  let tebleIndex = 0;
  if (
    val == "11" ||
    val == "12" ||
    val == "13" ||
    val == "14" ||
    val == "15" ||
    val == "16"
  ) {
    tebleIndex = 0;
  } else if (val == "21" || val == "22") {
    tebleIndex = 1;
  } else if (val == "23" || val == "24") {
    tebleIndex = 2;
  } else if (val == "31" || val == "32") {
    tebleIndex = 3;
  } else if (val == "33") {
    tebleIndex = 4;
  }

  return tebleIndex;
};

// diagnosisStatus诊断状态 0默认已发送 1已提交 2已出报告 3报告异常 4 未作答
const getDiagnosisStatus = (val) => {
  if (val == 0) {
    return "开始测评";
  } else if (val == 1) {
    return "已提交";
  } else if (val == 2) {
    return "查看报告";
  } else if (val == 3) {
    return "报告异常";
  } else if (val == 4) {
    return "未作答";
  }
};

// LocalStorage与SessionStorage封装
function StorageSet(storageString) {
  const storage = window[storageString];

  if (!window[storageString]) {
    // alert("浏览器支持"+storageString);
    return false;
  }

  const set = (key, value) => {
    storage.setItem(key, JSON.stringify(value));
  };

  const get = (key) => {
    let mydata = storage.getItem(key);

    if (!mydata) {
      return false;
    }
    try {
      mydata = JSON.parse(mydata);
    }
    catch(err) {
      return mydata;
    }
    
    return mydata;
  };

  const remove = (key) => {
    storage.removeItem(key);
  };

  const clear = () => {
    storage.clear();
  };

  return {
    set,
    get,
    remove,
    clear,
  };
}

/*图片*/
var strToUrlCmelement = (str) => {
  if (!str || typeof str != "string") return "";
  str = str.toString();
  //如果已经是html格式  直接返回
  if (/<img\b[^>]*>|<audio\b[^>]*>/.test(str)) return str;
  let string = "";
  string = str.replace(/[\r\n]{1,}/g, "");
  string = string.replace(/[\r\n]*$/g, "");
  string = string.replace(/[\r\n]/g, "<br>");
  string = string.replace(/http:\/\//g, "https:\/\/");

  return string.replace(
    /(http:\/\/|https:\/\/).*?\.(mp3|jpg|jpeg|png|gif)/gi,
    function(w) {
      if (/mp3$/i.test(w)) {
        return "<audio src=" + w + " controls />";
      } else {
        return (
          `<img style='max-width:100%;vertical-align:middle; max-width: 100%;min-height: ${fontSizes};' src=${w} />`
        );
      }
    }
  );
};
/*图片解析*/
var strUrlChangeCmelement = (str) => {
  if (!str || typeof str != "string") return "";
  str = str.toString();
  //如果已经是html格式  直接返回
  if (str.indexOf("<img") > -1) return str;

  let string = "";
  string = str.replace(/[\r\n]{1,}/g, "");
  string = string.replace(/&nbsp;/g, " ");
  string = string.replace(/[\r\n]*$/g, "");
  string = string.replace(/[\r\n]/g, "<br>");
  string = string.replace(/http:\/\//g, "https:\/\/");

  return string.replace(
    /(http:\/\/|https:\/\/).*?\.(mp3|jpg|jpeg|png|gif)/gi,
    function(w) {
      if (/mp3$/i.test(w)) {
        return '<audio src="' + w + '" controls/>';
      } else {
        return (
          `<img class="media-middle" style="vertical-align: middle; max-width: 100%;min-height: ${fontSizes};" src=${w} />`
        );
      }
    }
  );
};
const LocalStorage = StorageSet("localStorage");
const SessionStorage = StorageSet("sessionStorage");

const GrandList = {
  "11": "一年级",
  "12": "二年级",
  "13": "三年级",
  "14": "四年级",
  "15": "五年级",
  "16": "六年级",
  "21": "七年级",
  "22": "八年级",
  "23": "九年级",
  "24": "中考",
  "31": "高一",
  "32": "高二",
  "33": "高考",
};
const gredeList = [
  {
    gradeName: "一年级",
    gradeCode: "11",
  },
  {
    gradeName: "二年级",
    gradeCode: "12",
  },
  {
    gradeName: "三年级",
    gradeCode: "13",
  },
  {
    gradeName: "四年级",
    gradeCode: "14",
  },
  {
    gradeName: "五年级",
    gradeCode: "15",
  },
  {
    gradeName: "六年级",
    gradeCode: "16",
  },
  {
    gradeName: "七年级",
    gradeCode: "21",
  },
  {
    gradeName: "八年级",
    gradeCode: "22",
  },
  {
    gradeName: "九年级",
    gradeCode: "23",
  },
  {
    gradeName: "中考",
    gradeCode: "24",
  },
  {
    gradeName: "高一",
    gradeCode: "31",
  },
  {
    gradeName: "高二",
    gradeCode: "32",
  },
  {
    gradeName: "高考",
    gradeCode: "33",
  },
];

const commonSubject = {
  "1": "语文",
  "2": "数学",
  "4": "物理",
  "3": "英语",
  "5": "化学",
  "6": "生物",
  "7": "历史",
  "8": "地理",
  "9": "政治",
};

const subjectAbbreviation = {
  "1": "语",
  "2": "数",
  "4": "物",
  "3": "英",
  "5": "化",
  "6": "生",
  "7": "历",
  "8": "地",
  "9": "政",
};

// 暂时只用数学物理
const searchSubjectList = [
  // {
  //   text: "语文",
  //   code: "1",
  // },
  {
    text: "数学",
    code: "2",
  },
  // {
  //   text: "英语",
  //   code: "3",
  // },
  {
    text: "物理",
    code: "4",
  },
  // {
  //   text: "化学",
  //   code: "5",
  // },
  // {
  //   text: "生物",
  //   code: "6",
  // },
  // {
  //   text: "历史",
  //   code: "7",
  // },
  // {
  //   text: "地理",
  //   code: "8",
  // },
  // {
  //   text: "政治",
  //   code: "9",
  // },
];

/*
 * 更新微信配置
 * 在每一个需要用到微信sdk的页面中调用一下就会重新更新微信的签名
 */
const setWxConfig = () => {
  // JSSDK配置
  let WXCONFIG = window.config || {};
  // alert(window.config);
  // let url = window.WXURL;
  let url = window.location.href.split("#")[0];
  url = url.replace(new RegExp("%", "gm"), "percent");
  // let url = window.location.protocol + '//' + window.location.hostname + PATH;
  // url = encodeURIComponent(url);

  // 判断是否是微信环境
  let ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) !== "micromessenger") return;

  axios.post(agentUrlText + "/wechat/getShareLinkSign", { url }).then(
    (data) => {
      if (data.result) {
        WXCONFIG.jsApiList = [
          "updateAppMessageShareData",
          "onMenuShareAppMessage",
        ];
        WXCONFIG.appId = data.result.appId;
        WXCONFIG.debug = false;
        WXCONFIG.nonceStr = data.result.nonceStr;
        WXCONFIG.signature = data.result.signature;
        WXCONFIG.timestamp = data.result.timestamp;
        setTimeout(() => {
          wx.config(WXCONFIG);
        }, 500);
      }
    },
    (err) => {
      throw JSON.stringify(err);
    }
  );
};

// 判断是否是微信环境
const is_weixn = () => {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  } else {
    return false;
  }
};

// 判断token是否过期
const isTokenExpired = () => {
  // 获取本地时间
  const nowTime = new Date().getTime() / 1000;
  // 获取过期时间
  const ExpireTime = LocalStorage.get("accessTokenExpireTime");
  if (!ExpireTime) {
    return false;
  }
  // 校验本地时间
  const difftime = 10;
  // 如果 < 10分钟，则说明即将过期
  return ExpireTime - nowTime < difftime * 60;
};

// 禁止用户修改字体大小
const banUserReviseFontSize = () => {
  if (
    typeof WeixinJSBridge == "object" &&
    typeof WeixinJSBridge.invoke == "function"
  ) {
    handleFontSize();
  } else {
    if (document.addEventListener) {
      document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
    } else if (document.attachEvent) {
      document.attachEvent("WeixinJSBridgeReady", handleFontSize);
      document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
    }
  }
  function handleFontSize() {
    WeixinJSBridge.invoke("setFontSizeCallback", {
      fontSize: 0,
    });
    WeixinJSBridge.on("menu:setfont", function() {
      WeixinJSBridge.invoke("setFontSizeCallback", {
        fontSize: 0,
      });
    });
  }
};

// 将秒转化为时分秒
const formatSeconds = (value, val) => {
  let result = parseInt(value)
  let d = Math.floor(result / 86400) < 10 ? '0' + Math.floor(result / 86400) : Math.floor(result / 86400);

  let h = Math.floor(result / 3600 % 24) < 10 ? '0' + Math.floor(result / 3600 % 24) : Math.floor(result / 3600 % 24);

  let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));

  let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
 
  if (Number(d) <= 0 && Number(h) <= 0 && Number(m) <= 0) {
    result = `${s}秒`
  } else if (Number(d) <= 0 && Number(h) <= 0 && Number(m) > 0) {
    result = `${m}分${s}秒`
  } else if (Number(d) <= 0 && Number(h) > 0) {
    result = `${h}时${m}分${s}秒`
  } else {
    result = `${d}天${h}时${m}分${s}秒`
  }
  
  return result
}

//解决临界（顶部或底部）页面回弹后卡顿问题
let lastY = 0;
const touchstart = () => {
  lastY = event.changedTouches[0].clientY; // 点击屏幕时记录最后一次Y坐标
};
const touchmove = (event, classStr) => {
  let y = event.changedTouches[0].clientY;
  const dom = document.querySelector("." + classStr);
  let st = dom.scrollTop; // 滚动条高度
  if (y >= lastY && st <= 0) {
    //若滚动到顶部且为下拉情况
    lastY = y;
    event.preventDefault();
  }
  let clientHeight = dom.clientHeight;
  let scrollHeight = dom.scrollHeight;
  if (st + clientHeight === scrollHeight && y < lastY) {
    // 若滚动到底部且为上拉情况
    lastY = y;
    event.preventDefault();
  }
  lastY = y;
};

// 解决ios设备input输入页面整体被软键盘顶起无法回弹问题
const fixScroll = () => {
  let u = navigator.userAgent;
  let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isiOS) {
    window.scrollTo(0, 0);
  }
};

const appid = "wxa72daf5f7f12b731"; // 微信支付的appid

const corpId = "dingda76c88b741ca9ca35c2f4657eb6378f"; // 钉钉微应用企业ID

/**
 *
 * @param {数字转中文数字} value
 */
const ArabelToCN = (i) => {
  var arrNum = [
    "零",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
    "十",
    "佰",
  ];
  if (i <= 10) {
    return arrNum[i];
  } else if (i < 20) {
    return arrNum[10] + (i % 10 > 0 ? arrNum[parseInt(i % 10)] : "");
  } else if (i < 100) {
    return (
      arrNum[parseInt(i / 10)] +
      arrNum[10] +
      (i % 10 > 0 ? arrNum[parseInt(i % 10)] : "")
    );
  }
  return i;
};

/**
 * 题型，题型code转文字
 */
const questionType = (val) => {
  let str = "单选";
  const num = val + "";
  switch (num) {
    case "2":
      str = "多选";
      break;
    case "3":
      str = "判断";
      break;
    case "4":
      str = "填空";
      break;
    case "5":
      str = "主观";
      break;
    case "6":
      str = "复合";
      break;
    default:
      str = "单选";
  }

  return str;
};


// 判断是否是 android终端
const isAndroid = () => {
  
  const u = navigator.userAgent
  return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 
}


/**
 * 处理数据
 */
const paperDataHandler = (item) => {
  if (!item.type) {
    item.type = item.type || item.smallType
  }
  return item;
};

export {
  S4,
  guid,
  sleep,
  encodeSearchParams,
  isEmpty,
  LocalStorage,
  SessionStorage,
  isTokenExpired,
  banUserReviseFontSize,
  GrandList,
  gredeList,
  setWxConfig,
  is_weixn,
  commonSubject,
  strToUrlCmelement,
  strUrlChangeCmelement,
  formatSeconds,
  getDiagnosisStatus,
  gradeToStage,
  touchstart,
  touchmove,
  searchSubjectList,
  subjectAbbreviation,
  appid,
  corpId,
  fixScroll,
  isJSON,
  ArabelToCN,
  questionType,
  isAndroid,
  paperDataHandler
};
