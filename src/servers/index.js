import $http from '../utils/http'
// 测试
const getPaper = (data) => {
    return $http.post($http.submitUrl + 'paper/getPaper', data)
}

// 单题
const getTestQuestion = (data) => {
    return $http.post($http.LAN_TIAN_URL + '/resource/question/getQuestionByKnowledgeCodes', data)
}

export default {
    getPaper,
    getTestQuestion
}