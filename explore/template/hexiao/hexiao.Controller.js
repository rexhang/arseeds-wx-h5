angular.module('exploreApp')
.controller('hexiaoController', ['$rootScope', '$scope', 'URL', 'serverConnect', '$interval', '$state', '$stateParams', function($rootScope, $scope, URL, serverConnect, $interval, $state, $stateParams){
    return hexiaoController($rootScope, $scope, URL, serverConnect, $interval, $state, $stateParams);
}]);

function hexiaoController($rootScope, $scope, URL, serverConnect, $interval, $state, $stateParams){
    $rootScope.appLog('hexiaoController init');
    $rootScope.bodyclass = 'hexiao';

    $interval.cancel($rootScope.setIntervalForJdLive); // 取消绑定的定时器

    $scope.$on('$viewContentLoaded', () => {
        //let baseURL = URL.apiUrl().online_exchange;
        //zsb
         let baseURL  ="https://interface.arseeds.com/zsb";
        let openid = URL.getUrlParams('open_id'); // openid
        let playing_id = URL.getUrlParams('playing_id'); // playing_id

        let is_key = $stateParams.key;

        serverConnect.__get(baseURL + '/wx/prizefor/get-coupon-info', {key: is_key, playing_id: playing_id}).success(function(data){
            if(data.code == 200){
                $scope.result = data.data;
            }
        })

        $scope.duijiang = function(){
            serverConnect.__get(baseURL + '/wx/prizefor/used-coupon', {key: is_key, playing_id: playing_id}).success(function(data){
                if(data.code == 200){
                    $state.reload();
                } else{
                    alert(data.msg)
                }
            })
        }

    })
}
