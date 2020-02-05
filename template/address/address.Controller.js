"use strict";
wxApp
.controller('addressController', ['$rootScope', '$scope', 'serverConnect', 'baseSet', '$state', 'URL', 'validate', '$timeout','$interval', 'h5locals','$stateParams','$http',function($rootScope, $scope, serverConnect, baseSet, $state, URL, validate,$timeout,$interval,h5locals,$stateParams,$http){
    return address($rootScope, $scope, serverConnect, baseSet, $state, URL, validate,$timeout,$interval,h5locals,$stateParams,$http);

}]);
function address($rootScope, $scope, serverConnect, baseSet, $state, URL, validate,$timeout,$interval,h5locals,$stateParams,$http){
    $scope.unionid  = URL.getUrlParams("unionid")
    $scope.sbumit = function(){
        if ($scope.userName && $scope.userName != '') {
            if (/1[3,5,7,8]\d{9}$/.test($scope.userPhone)) {
                       if ($scope.userAdderss && $scope.userAdderss != '') {
                        var APIURL = 'https://api.arseeds.com/integral/weixin/exchange';
                        var postParam = {
                            'id':$stateParams.id,
                            'unionid':$scope.unionid,
                            'username':$scope.userName,
                            'tel':$scope.userPhone,
                            'addr':$scope.userAdderss,
                            'type': 1
                        }
                        serverConnect.__post(APIURL, postParam, {}).success(function(data){

                            if(data.code == 200){
                                $state.go('convert')
                            } else{
                                alert(data.msg);
                            }
                        }).error(function(data,status,headers,config){
                            console.log(data);
                        });
                       } else {
                        alert('请输入详细地址')
                       }
                    } else {
                        alert('请输入正确电话号码')
                    }
        } else {
            alert('请输入用户名')
        }
            }
 }