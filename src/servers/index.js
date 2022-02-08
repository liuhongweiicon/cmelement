import $http from '../utils/http'
// 测试
const getPaper = (data) => {
    // return $http.post('http://lantiantest.e-edusky.com/diagnosis/protal/class/test/getTaskQuestionsByTaskCode', data)
    // return $http.post($http.submitUrl + 'paper/getPaper', data)
    // return $http.post('http://lantiantest.e-edusky.com/diagnosis/resource/evaluation/distributePaper', data)
    // return $http.post('http://tetest.e-edusky.com/diagnosis/manager/question/bank/getQuestionByKnowledge', data)
    return $http.post('http://lantiantest.e-edusky.com/diagnosis/resource/evaluation/getEvaluationAnswer', data)

}

// 单题
const getTestQuestion = (data) => {
    return $http.post($http.LAN_TIAN_URL + '/resource/question/getQuestionByKnowledgeCodes', data)
}


// 单题试卷
const getTaskQuestionsByTaskCode = (data) => {
    return $http.post('http://tetest.e-edusky.com/diagnosis/protal/class/test/getTaskQuestionsByTaskCode?requestId=0.5794041683778774', data)
}
// 单题试卷
const getEvaluationAnswer = (data) => {
    return $http.post('http://tetest.e-edusky.com/diagnosis/manager/question/bank/getQuestionByKnowledge?requestId=0.8016242538880982', data)
}
// 测试接口
const getQuestionByKnowledge = (data) => {
    return $http.post($http.lantianUrl1 + '/class/classroomTask/getTaskTeacherReportAnswerAnalysis', data)
}

// 上传文件
const liveUpload = (data) => {
    return $http.post('https://transcodinput.e-eduspace.com/liveFile/liveUpload', data)
}

export default {
    getPaper,
    getTestQuestion,
    getQuestionByKnowledge,
    liveUpload,
    getEvaluationAnswer,
    getTaskQuestionsByTaskCode
}