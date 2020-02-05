"use strict";
angular.module('wxApp')
.controller('tencentController', ['$rootScope', '$scope', '$stateParams', function($rootScope, $scope, $stateParams){
    return tencentController($rootScope, $scope, $stateParams);
}]);


function tencentController($rootScope, $scope, $stateParams){
    $rootScope.set.appLog('tencentController init');
    $rootScope.bodyclass = 'tencent';
    // 微信配置
    wx.ready(function () {
        $scope.getTencentPosition = function(){
            // 获取当前所在地理位置信息
            wx.getLocation({
                success: function (res) {
                    var str = 'lat:'+res.latitude+'=====lng:'+res.longitude;
                    alert(str);
                },
                cancel: function (res) {
                    alert('用户拒绝授权获取地理位置');
                }
            });
        }
    });
    wx.error(function(res){
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        alert(res.errMsg);
    });
}