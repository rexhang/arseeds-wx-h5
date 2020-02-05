"use strict";
wxApp
.controller('convertController', ['$rootScope', '$scope', 'serverConnect', 'baseSet', '$state', 'URL', 'validate', '$timeout','$interval', 'h5locals','$stateParams',function($rootScope, $scope, serverConnect, baseSet, $state, URL, validate,$timeout,$interval,h5locals,$stateParams){
    return convertController($rootScope, $scope, serverConnect, baseSet, $state, URL, validate,$timeout,$interval,h5locals,$stateParams);

}]);
function convertController($rootScope, $scope, serverConnect, baseSet, $state, URL, validate,$timeout,$interval,h5locals,$stateParams){
     $scope.unionid  = URL.getUrlParams("unionid")
     serverConnect.__get('https://api.arseeds.com/integral/weixin/get-user-coupon-list',{unionid:$scope.unionid,page:$scope.count,perpage:'20'}).success(function(res){
        $scope.list = res.data.list
        console.log(res)
    })
 }