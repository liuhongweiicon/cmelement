import $http from '../utils/http'
const qs = require('qs');
// 测试
const getPaper = (data) => {
    return $http.post($http.submitUrl + 'paper/getPaper', data)
}

// 单题
const getTestQuestion = (data) => {
    return $http.post($http.LAN_TIAN_URL + '/resource/question/getQuestionByKnowledgeCodes', data)
}



// 上传文件
const liveUpload = (data) => {
    return $http.post('http://transcodinput.e-eduspace.com/liveFile/liveUpload', data)
}

export default {
    getPaper,
    getTestQuestion,
    liveUpload
}