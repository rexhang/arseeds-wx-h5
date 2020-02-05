angular.module('exploreApp')
.controller('activityInfo_huadongController', ['$rootScope', '$scope', 'URL', '$interval', function($rootScope, $scope, URL, $interval){
    return activityInfo_huadongController($rootScope, $scope, URL, $interval);
}]);

function activityInfo_huadongController($rootScope, $scope, URL, $interval){
    $rootScope.appLog('activityInfo_huadongController init');
    $rootScope.bodyclass = 'activityInfo_huadong';

    $interval.cancel($rootScope.setIntervalForJdLive); // 取消绑定的定时器
    jQuery('#ui-view').css('width', '100%').css('height', '100%');

}
