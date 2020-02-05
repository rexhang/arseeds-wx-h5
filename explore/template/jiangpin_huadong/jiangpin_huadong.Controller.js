angular.module('exploreApp')
.controller('jiangpin_huadongController', ['$rootScope', '$scope', 'URL', 'serverConnect', '$interval', '$state', '$stateParams', function($rootScope, $scope, URL, serverConnect, $interval, $state, $stateParams){
    return jiangpin_huadongController($rootScope, $scope, URL, serverConnect, $interval, $state, $stateParams);
}]);

function jiangpin_huadongController($rootScope, $scope, URL, serverConnect, $interval, $state, $stateParams){
    $rootScope.appLog('jiangpin_huadongController init');
    $rootScope.bodyclass = 'jiangpin_huadong';

    $interval.cancel($rootScope.setIntervalForJdLive); // 取消绑定的定时器

    $scope.$on('$viewContentLoaded', () => {
       // let baseURL = URL.apiUrl().online_exchange;
       // zsb
        let baseURL  ="https://interface.arseeds.com/zsb";
        let openid = URL.getUrlParams('open_id'); // openid
        let playing_id = URL.getUrlParams('playing_id'); // playing_id

        let is_key = $stateParams.key;

        // 展示奖品信息
        serverConnect.__get(baseURL + '/wx/prizefor/get-coupon-info', {key: is_key, playing_id: playing_id}).success(function(data){
            if(data.code == 200){
                $scope.result = data.data;
            }
        })

        setTimeout(function(){
            // 生成二维码
            // https://interface.arseeds.com/wx_h5/explore/index.html?playing_id=395#/hexiao/A000Gzg

            // 简单方式
            var context = "https://interface.arseeds.com/wx_h5/explore/index.html?playing_id=" + playing_id + "#/hexiao/" + is_key;
            new QRCode(document.getElementById('qrcodediv'), {
                text: context,
                width: 100,
                height: 100,
                colorDark : '#efb73e',
                colorLight : '#fff',
                correctLevel : QRCode.CorrectLevel.H
            });
        }, 100)


    })
}
