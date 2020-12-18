import qs from 'qs';
// 拼接请求数据，公有加密方法
export function CommonData(params) {
    let timeStamp = Math.ceil(Date.now() / 1000),
        platform,
		resultData,
		localStorageData = {};
    
	if (!params.data || params.data == "{}") {
		params.data = "{}";
	} else {
		params.data = JSON.stringify(params.data);
    }
    
	if(window.localStorage.getItem('USERINFO')) {
		localStorageData = JSON.parse(window.localStorage.getItem('USERINFO'));
	}

	resultData = Object.assign({
		token: localStorageData.data.token || null,
		timestamp: timeStamp,
		platform: "chrome"
	}, params);
	return {
		method: params.method ? params.method : "POST",
		headers:{
	       "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
	    },
		body:qs.stringify(resultData)
	}
}