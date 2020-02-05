"use strict";
angular.module('wxApp')
.controller('prizeController', ['$rootScope', '$scope', '$stateParams', function($rootScope, $scope, $stateParams){
    return prizeController($rootScope, $scope, $stateParams);
}]);


function prizeController($rootScope, $scope, $stateParams){
    $rootScope.set.appLog('prizeController init');
	$scope.msg = '关于 => 接收到的参数是: '+$stateParams.id;
    $rootScope.bodyclass = 'prize';
    console.log($stateParams);

    clearInterval($rootScope.timer);
}