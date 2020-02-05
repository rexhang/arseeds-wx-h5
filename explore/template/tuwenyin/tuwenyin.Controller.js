angular.module('exploreApp')
.controller('tuwenyinController', ['$rootScope', '$scope', 'serverConnect', 'URL', 'h5locals', '$sce', function($rootScope, $scope, serverConnect, URL, h5locals, $sce) {
    return tuwenyinController($rootScope, $scope, serverConnect, URL, h5locals, $sce);
}]);

function tuwenyinController($rootScope, $scope, serverConnect, URL, h5locals, $sce) {
    $rootScope.appLog('tuwenyinController init');
    $rootScope.bodyclass = 'tuwenyin';

    $scope.$on('$viewContentLoaded', () => {
        layer.load(1); // 读取用户资料 开启动画
        let baseURL = URL.apiUrl().online_exchange;
        /*console.log(URL.getUrlParams('key'));
        let is_key = decodeURI(URL.getUrlParams('key')); // decodeURIComponent - 解码 // 传过来的key
        console.log(baseURL, is_key);*/
        /*is_key = '216142628156684310-16-083159_873';*/

        function getQueryString(key){
            var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
            var result = window.location.search.substr(1).match(reg);
            return result?decodeURIComponent(result[2]):null;
        }
        let is_key = getQueryString('key');
        console.log(is_key);

        // 发起请求
        serverConnect.__get(baseURL + '/explore/img-show/get-recognition', {key: is_key}).success(function(data){
            if(data.code == 200){
                let htmlResource = data.data[0].result; // 获取html标签代码
                $scope.text = $sce.trustAsHtml(htmlResource);
                $scope.audioResource = data.data[0].result_description.audio; // 获取音频地址
                jQuery('#audio').attr('src', $scope.audioResource);
                let AudioDom = document.getElementById('audio'); // audio dom
                var is_play = false; // 是否播放的全局变量
                // 当可以播放的时候点击触发按钮的事件

                jQuery('#audioImage').click(function(){
                    if(is_play){
                        // 开始播放了
                        jQuery('#audio')[0].pause();
                        is_play = false;
                        jQuery('#audioImage').attr('src', './img/tuwenyin/openVoice.png');
                    } else{
                        // 点击开始播放
                        jQuery('#audio')[0].play();
                        is_play = true;
                        jQuery('#audioImage').attr('src', './img/tuwenyin/closeVoice.png');
                    }
                })

            } else{
                layer.msg(data.msg, {
                    time: 500
                });
            }
            layer.closeAll('loading');
        }).error(function(data,status,headers,config){
            layer.msg('api连接错误');
            layer.closeAll('loading');
        });
    });
}