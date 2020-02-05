angular.module('exploreApp')
.controller('shopController', ['$rootScope', '$scope', 'serverConnect', function($rootScope, $scope, serverConnect){
    return shopController($rootScope, $scope, serverConnect);
}]);

function shopController($rootScope, $scope, serverConnect){
    $rootScope.appLog('shopController init');
    $scope.msg = '商品内容：';
    $rootScope.bodyclass = 'shop';

    serverConnect.__get('http://192.168.1.127:9997/getinfo.node/', {}).success(function(data){
        console.log(data);
    }).error(function(data,status,headers,config){
        console.log(data);
    });

    /*var DATA = {
        name: '顾航',
        age: 25
    };
    serverConnect.__post('http://192.168.1.127:9997/sendinfo.node/', DATA, {author: 'rexhang'}).success(function(data){
        console.log(data);
    }).error(function(data,status,headers,config){
        console.log(data);
    });*/
}
