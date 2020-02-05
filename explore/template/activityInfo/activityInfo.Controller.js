angular.module('exploreApp')
.controller('activityInfoController', ['$rootScope', '$scope', 'URL', '$interval', function($rootScope, $scope, URL, $interval){
    return activityInfoController($rootScope, $scope, URL, $interval);
}]);

function activityInfoController($rootScope, $scope, URL, $interval){
    $rootScope.appLog('activityInfoController init');
    $rootScope.bodyclass = 'activityInfo';

    $interval.cancel($rootScope.setIntervalForJdLive); // 取消绑定的定时器
    jQuery('#ui-view').css('width', '100%').css('height', '100%');

}
