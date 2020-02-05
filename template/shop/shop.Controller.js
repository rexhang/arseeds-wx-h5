"use strict";
angular.module('wxApp')
.controller('shopController', ['$rootScope', '$scope', 'intervalAction', function($rootScope, $scope, intervalAction){
    return shopController($rootScope, $scope, intervalAction);
}]);

function shopController($rootScope, $scope, intervalAction){
    $rootScope.set.appLog('shopController init');
    $scope.msg = '商品内容：';
    $rootScope.bodyclass = 'shop';
    // 點擊倒計時按鈕功能DEMO
    $scope.actions = function($event){
        var dom = $event.target;
        if( angular.element(dom).text() === '你好' || angular.element(dom).text() === '點擊重發' ){
            // 執行計時方法
            intervalAction.countDown(dom, 90, '點擊重發', '#000', 100);
        } else{
            console.warn('正在計時中……請勿再次點擊！');
        }
    }

}
