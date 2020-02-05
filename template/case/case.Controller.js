"use strict";
angular.module('wxApp')
.controller('caseController', ['$rootScope', '$scope', '$stateParams', function($rootScope, $scope, $stateParams){
    return caseController($rootScope, $scope, $stateParams);
}]);
function caseController($rootScope, $scope, $stateParams){
    $rootScope.set.appLog('caseController init');
	$scope.msg = '关于 => 接收到的参数是: '+$stateParams.id;
    $rootScope.bodyclass = 'about';
    console.log($stateParams);
}
