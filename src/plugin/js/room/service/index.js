

class HTTP {
    /**
     * 
     * @param {*request} request http库
     * @param {url} url 请求地址
     */
    constructor({request, url}) {
        this.$http = request;
        this.url = url;
    }

 
    // 登陆房间
    loginRoom(data) {
        return $http.post('login_room', data);
    }

}