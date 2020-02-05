"use strict";
angular.module('wxApp')
.controller('shareController', ['$rootScope', '$scope', '$stateParams', function($rootScope, $scope, $stateParams){
    return shareController($rootScope, $scope, $stateParams);
}]);


function shareController($rootScope, $scope, $stateParams){
    $rootScope.set.appLog('shareController init');
    $rootScope.bodyclass = 'share';
    console.log($stateParams);

    clearInterval($rootScope.timer);

}