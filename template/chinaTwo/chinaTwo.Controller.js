"use strict";
wxApp
.controller('chinaTwoController', ['$rootScope', '$scope', 'serverConnect', 'baseSet', '$state', 'URL', 'validate', '$timeout','$interval', 'h5locals','$stateParams',function($rootScope, $scope, serverConnect, baseSet, $state, URL, validate,$timeout,$interval,h5locals,$stateParams){
    return chinaTwoController($rootScope, $scope, serverConnect, baseSet, $state, URL, validate,$timeout,$interval,h5locals,$stateParams);

}]);
function chinaTwoController($rootScope, $scope, serverConnect, baseSet, $state, URL, validate,$timeout,$interval,h5locals,$stateParams){
    $scope.unionid  = URL.getUrlParams("unionid")
    $scope.id = $stateParams.id;
    serverConnect.__get('https://api.arseeds.com/integral/weixin/get-coupons-info',{unionid:$scope.unionid,id:$scope.id}).success(function(res){
        $scope.list = res.data;

        setTimeout(function(){
            var mySwiper = new Swiper('.swiper-container', {
                        loop : false,
                        pagination : '.swiper-pagination',
                        paginationType : 'bullets'
                    })
            var goodsNeedScore = parseInt($scope.list.coupon_need_score);
            if( goodsNeedScore > 0 ){
                // 请求个人信息
                serverConnect.__get('https://api.arseeds.com/integral/user/get-user-info', {unionId: $scope.unionid}).success(function(data){
                    var iamScore = parseInt(data.data.user_total_score);
                    console.log(iamScore, goodsNeedScore)
                    if(iamScore < goodsNeedScore){
                        // 如果我的分数小于商品所需的分数则不可点
                        $scope.isDis = true;
                        $scope.disa = 'disa';
                    }
                }).error(function(data,status,headers,config){
                    console.log(data);
                });
            }
        },100)

    })




$scope.click = function(){
    $state.go('address',{id:$scope.id})
}
$scope.expression = function(url){
    var result = confirm("确定领取吗?");
    if(result){
        // 扣积分
        // 扣分成功跳转
        var DATA = {
            type: 2,
            id: $scope.id,
            unionid: $scope.unionid
        };
        serverConnect.__post('https://api.arseeds.com/integral/weixin/exchange', DATA, {}).success(function(data){
            if(data.code == 200){
                window.location.href = url;
            } else{
                alert(data.msg);
            }
        }).error(function(data,status,headers,config){
            console.log(data.msg);
        });
    }
}
 }