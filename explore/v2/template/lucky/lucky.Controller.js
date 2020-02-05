angular.module('exploreApp')
.controller('luckyController', ['$rootScope', '$scope', 'URL', 'serverConnect', '$interval', '$state', function($rootScope, $scope, URL, serverConnect, $interval, $state){
    return luckyController($rootScope, $scope, URL, serverConnect, $interval, $state);
}]);

function luckyController($rootScope, $scope, URL, serverConnect, $interval, $state){
    $rootScope.appLog('luckyController init');
    $rootScope.bodyclass = 'lucky';

    $interval.cancel($rootScope.setIntervalForJdLive); // 取消绑定的定时器

    $scope.$on('$viewContentLoaded', () => {
        let baseURL = URL.apiUrl().online_exchange;
        let openid = URL.getUrlParams('open_id'); // openid
        let playing_id = URL.getUrlParams('playing_id'); // playing_id

        // 抽奖
        $scope.coupon = function(){
            layer.load(1); // 开启动画
            serverConnect.__post(baseURL + '/wx/prize/coupon', {openid: openid, playing_id: playing_id}, {}).success(function(data){
                console.log('data.code=='+data.code);
                console.log('typeof data.code ='+ typeof data.code);
                switch(data.code) {
                    case 200:
                        // 获奖
                        jQuery('#needle').css('transform', 'rotate(684deg)');
                        setTimeout(function(){
                            layer.alert('恭喜您！抽中奖品', {icon: 6});
                        }, 1200);
                        break;
                    case 400:
                        // 抽奖失败
                        layer.alert('抽奖失败', {icon: 6});
                        break;
                    case 40001:
                        // 今日奖品抽完啦,明天再来...
                        jQuery('#needle').css('transform', 'rotate(726deg)');
                        setTimeout(function(){
                            layer.alert('今日奖品抽完啦！明天再来', {icon: 6});
                        }, 1200);
                        break;
                    case 40000:
                        // 您已经抽过奖
                        layer.alert('您已经抽过奖', {icon: 6});
                        break;
                    case 40003:
                        // 奖品抽完啦...
                        jQuery('#needle').css('transform', 'rotate(726deg)');
                        setTimeout(function(){
                            layer.alert('奖品抽完啦！', {icon: 6});
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
