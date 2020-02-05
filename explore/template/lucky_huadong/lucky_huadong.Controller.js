angular.module('exploreApp')
.controller('lucky_huadongController', ['$rootScope', '$scope', 'URL', 'serverConnect', '$interval', '$state', function($rootScope, $scope, URL, serverConnect, $interval, $state){
    return lucky_huadongController($rootScope, $scope, URL, serverConnect, $interval, $state);
}]);

function lucky_huadongController($rootScope, $scope, URL, serverConnect, $interval, $state){
    $rootScope.appLog('lucky_huadongController init');
    $rootScope.bodyclass = 'lucky_huadong';

    $interval.cancel($rootScope.setIntervalForJdLive); // 取消绑定的定时器

    $scope.$on('$viewContentLoaded', () => {
        //let baseURL = URL.apiUrl().online_exchange;
        //zsb update 10.1
         let baseURL  ="https://interface.arseeds.com/zsb";
        let openid = URL.getUrlParams('open_id'); // openid
        let playing_id = URL.getUrlParams('playing_id'); // playing_id

        // 抽奖成功 直接去兑奖页面了
        $scope.suc = function($event){
            console.log($scope.is_key)
            $state.go('jiangpin_huadong',{key: $scope.is_key}, {reload:true});
            $event.stopPropagation();
        }

        // 失败就关闭模态框
        $scope.err = function($event){
            $state.reload();
            $event.stopPropagation();
        }

        // 抽奖
        $scope.coupon = function(){
            layer.load(1); // 开启动画
            serverConnect.__post(baseURL + '/wx/prizefor/coupon', {openid: openid, playing_id: playing_id}, {}).success(function(data){
                console.log('data.code=='+data.code);
                console.log('typeof data.code ='+ typeof data.code);
                switch(data.code) {
                    case 200:
                        // 获奖
                        jQuery('#needle').css('transform', 'rotate(684deg)');
                        setTimeout(function(){
                            //layer.alert('恭喜您！抽中奖品', {icon: 6});
                            $scope.modals = true;
                            $scope.modals2 = true;
                            $scope.is_key = data.data.key;
                            $scope.$apply();
                        }, 1200);
                        break;
                    case 400:
                        // 抽奖失败
                        // layer.alert('抽奖失败', {icon: 6});
                        jQuery('#needle').css('transform', 'rotate(726deg)');
                        setTimeout(function(){
                            //layer.alert('恭喜您！抽中奖品', {icon: 6});
                            $scope.modals = true;
                            $scope.modals2 = false;
                            $scope.$apply();
                        }, 1200);
                        break;
                    default:
                        // 未知错误
                        layer.msg('未知错误！', {
                            time: 600
                        });
                }
                layer.closeAll('loading');
            }).error(function(data,status,headers,config){
                layer.msg('api连接错误', {
                   time: 600
               });
                layer.closeAll('loading');
            });
        }
    })
}
