"use strict";
angular.module('wxApp')
.controller('aboutController', ['$rootScope', '$scope', '$stateParams', function($rootScope, $scope, $stateParams){
    return aboutController($rootScope, $scope, $stateParams);
}]);


function aboutController($rootScope, $scope, $stateParams){
    $rootScope.set.appLog('aboutController init');
	$scope.msg = '关于 => 接收到的参数是: '+$stateParams.id;
    $rootScope.bodyclass = 'about';
    console.log($stateParams);
}