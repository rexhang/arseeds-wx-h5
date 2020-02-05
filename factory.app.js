var services = angular.module("app.servers", []);
services

// 使用方法：
// baseSet.apiSet().apiUrl
.factory('baseSet', function(){
    var mySet = {
        /* START local company(ar-seeds) dev */
        apiUrl  : "http://192.168.1.127:9999/rex_cms/src/local_api/",
        jsonUrl : "http://192.168.1.127:9999/mock/",
        baseurl : "http://192.168.1.127:9999/rex_cms/src/"
        /* END local company(ar-seeds) dev */

        /* START online dev */
        /*apiUrl  : "https://rexhang.com/webtask/local_api/on_line/",
        jsonUrl : "https://rexhang.com/webtask/json/",
        baseurl : "https://rexhang.com/webtask/"*/
        /* END online dev */
    };
    return {
        apiSet: function(){
            return mySet;
        }
    };
})

// 使用方法：
// 1: serverConnect.__get(URL, PARAMS).success(function(data){
//     console.log(data);
// }).error(function(data,status,headers,config){
//     console.log(data);
// });
// 2: serverConnect.__post(URL, DATA, PARAMS).success(function(data){
//     console.log(data);
// }).error(function(data,status,headers,config){
//     console.log(data);
// });

.factory('serverConnect', ['$http', function($http) { // ajax get post服务
    var __getData = function(URL, PARAMS){
        PARAMS ? PARAMS = PARAMS : PARAMS = {};
        return $http({
            url: URL,
            method: "GET",
            timeout: 10000,
            params: PARAMS,
            headers: {
                "Accept-Language": "zh-cn",
                "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
            }
        });
    };
    var __postData = function(URL, DATA, PARAMS){
        PARAMS ? PARAMS = PARAMS : PARAMS = {};
        return $http({
            url: URL,
            method: "POST",
            timeout: 10000,
            data: DATA,
            params: PARAMS,
            headers: {
                "Accept-Language": "zh-cn",
                "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
            },
            transformRequest: function (DATA) {
                //使用jQuery的param方法把JSON数据转换成字符串形式
                return jQuery.param(DATA);
            }
        });
    };
    return {
        __get: function (URL, PARAMS){
            if(URL){
                return __getData(URL, PARAMS);
            } else{
                console.warn('parameter is not define');
            }
        },
        __post: function (URL, DATA, PARAMS){
            if(URL && DATA){
                return __postData(URL, DATA, PARAMS);
            } else{
                console.warn('parameter is not define');
            }
        }
    };
}])

// 使用方法：
// h5locals.set("username",username);
// h5locals.get("username");
// h5locals.setObject('age',{a:1,b:2,c:3});
// h5locals.getObject('age');
// h5locals.remove(username);
// h5locals.clear();
.factory('h5locals',['$window',function($window){ // 本地存储服务
    return{        //存储单个属性
        set: function(key,value){
          $window.localStorage[key]=value;
        },        //读取单个属性
        get: function(key,defaultValue){
          return  $window.localStorage[key] || defaultValue;
        },        //存储对象，以JSON格式存储
        setObject: function(key,value){
          $window.localStorage[key]=JSON.stringify(value);
        },        //读取对象
        getObject: function (key) {
          return JSON.parse($window.localStorage[key] || '{}');
        },      // 清除指定元素
        remove: function(key){
            $window.localStorage.removeItem(key);
        },      // 清除全部
        clear: function(){
            $window.localStorage.clear();
        }
    };
  }])
// 使用方法：
// 1: URL.getUrlParams(params);
.factory('URL', function(){ // url相关的方法
    return {
        getUrlParams: function(params){ // 获取url参数
            var reg = new RegExp("(^|&)"+ params +"=([^&]*)(&|$)");
    		var r = window.location.search.substr(1).match(reg);
    		if(r!=null)return  unescape(r[2]); return null;
        }
    };
})
// 使用方法：
// 1: intervalAction.countDown(params);
.factory('intervalAction', function($rootScope, $interval){ // 計時相关的方法
    return {
        countDown: function(dom, is_times, is_endTxt, is_color, is_intervalTime){ // 倒計時時間，開始的文字，結束的文字
            var IS_TIME;
            var DEFAULT_CONFIG = {
                is_endTxt: '重发',
                is_color: '#999',
                is_times: 60,
                is_intervalTime: 1000
            }; // 默認配置
            var startTxt = jQuery(dom).text(); // 獲取按鈕初始文字
            var startBgColor = jQuery(dom).css('background-color'); // 獲取按鈕初始背景色
            is_endTxt?is_endTxt=is_endTxt:is_endTxt=DEFAULT_CONFIG.is_endTxt; // 默认设置字段为'重发'
            is_times?is_times=parseInt(is_times):is_times=DEFAULT_CONFIG.is_times; // 默认设置倒計時時間爲60秒
            IS_TIME = is_times;
            is_intervalTime?is_intervalTime=parseInt(is_intervalTime):is_intervalTime=DEFAULT_CONFIG.is_intervalTime; // 默认设置時間間隔爲1秒
            is_color?is_color=is_color:is_color=DEFAULT_CONFIG.is_color; // 默认设置顏色为#999
            jQuery(dom).css('background-color', is_color); // 設置背景色
            jQuery(dom).text(IS_TIME); // 設置時間
            $rootScope.countDown = $interval(function(){
                IS_TIME--;
                if( IS_TIME <= 0 ){
                    jQuery(dom).text(is_endTxt).css('background-color', startBgColor);
                    $interval.cancel($rootScope.countDown);
                    IS_TIME = is_times;
                } else{
                    jQuery(dom).text(IS_TIME);
                }
            }, is_intervalTime);
        }
    };
})
// 使用方法：
// 1: validate.badName(badname);
// 2: validate.email(email);
// 3: validate.space(space);
.factory('validate', function(){ // 正则过滤服务
    return {
        badName: function(badname){ // 验证姓名不能包含特殊字符
            var badnameReg = /[\\\/<>&\"\'\`#\*\^\~\|,:;\?\(\)\[\]%\$]/;
            if(badnameReg.test(badname)){

                return true;
            }
            return false;
        },
        email: function(email){ // 验证邮箱格式
            var emailReg =  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return emailReg.test(email);
        },
        space: function(space){ // 验证是否含空格
            var spaceReg = /\s+/;
            return spaceReg.test(space);
        },
        phone: function(phone){  //验证电话吗是否合格
            var phoneReg = /^1[3,5,7,8]\d{9}$/;
            return phoneReg.test(phone)
        }
    };
})
