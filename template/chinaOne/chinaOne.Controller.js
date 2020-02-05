"use strict";
wxApp

    .controller('chinaOneController', ['$rootScope', '$scope', 'serverConnect', 'baseSet', '$state', 'URL', 'validate', '$timeout', '$interval', 'h5locals', function($rootScope, $scope, serverConnect, baseSet, $state, URL, validate, $timeout, $interval, h5locals) {
    return chinaOneController($rootScope, $scope, serverConnect, baseSet, $state, URL, validate, $timeout, $interval, h5locals);

}]);


function chinaOneController($rootScope, $scope, serverConnect, baseSet, $state, URL, validate, $timeout, $interval, h5locals) {
    $rootScope.bodyclass = 'chinaOne';
    $scope.unionid = URL.getUrlParams("unionid")
    $scope.list = []
    $scope.count = 1
    $scope.hideHistory = false;
    function get() {
        serverConnect.__get('https://api.arseeds.com/integral/weixin/get-coupons-list', {
            unionid: $scope.unionid,
            page: $scope.count,
            perpage: '20'
        }).success(function(res) {
            angular.forEach(res.data.list, function(index, item) {
                $scope.list.push(index)
            });
            $scope.length = res.data.list.length;
        })
    }
    get()
    $scope.click = function(id) {
        $state.go('chinaTwo', {
            id: id.id
        })
    }
    $scope.more = function() {
        $scope.count++;
        get()
    }
    $scope.convert = function() {
        $state.go('convert')
    }
    serverConnect.__get('https://api.arseeds.com/integral/weixin/get-user-coupon-list', {
        unionid: $scope.unionid,
        page: $scope.count,
        perpage: '20'
    }).success(function(res) {
        $scope.count = res.data.list.length
        if(res.data.total== '0'){
            $scope.hideHistory = true;
        }
    })
}