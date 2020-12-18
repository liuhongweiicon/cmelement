import $http from '../utils/http'

// 测试
const getPaper = (data) => {
    return $http.post($http.submitUrl + 'paper/getPaper', data)
}

export default {
    getPaper
}