angular.module('exploreApp')
.controller('aboutController', ['$rootScope', '$scope', '$stateParams', 'validate', 'URL', 'serverConnect', function($rootScope, $scope, $stateParams, validate, URL, serverConnect){
    return aboutController($rootScope, $scope, $stateParams, validate, URL, serverConnect);
}]);

angular.module('exploreApp')
.directive('ngInput', [function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs) {
            element.on('input',oninput);
            scope.$on('$destroy',function(){//销毁的时候取消事件监听
                element.off('input',oninput);
            });
            function oninput(event){
                scope.$evalAsync(attrs['ngInput'],{$event:event,$value:this.value});
            }
        }
    }
}]);

function aboutController($rootScope, $scope, $stateParams, validate, URL, serverConnect){
    $rootScope.appLog('aboutController init');
	$scope.msg = '关于 => 接收到的参数是: '+$stateParams.id;
    $rootScope.bodyclass = 'about';
    console.log($stateParams);
    var str = 'dd@xx.com';
    console.log( validate.email(str) ) // true


    let baseURL = URL.apiUrl().online_exchange;

    let moduleFunction = require('../../js/module.js');
    let theHref = moduleFunction.getLocationHref();
    let personal = ['amliy', 24, 170, '90 60 94'];
    var beauty  = new moduleFunction.BeautifulGirl(...personal);
    var isChosen = beauty.beChosen();
    console.log(theHref);
    console.log(isChosen);

    var es6Function = () => {
        console.log('es6 function');
    }
    es6Function();

    $scope.user = {}; // 表单信息
    $scope.suc = {};  // 验证信息
    $scope.test = () =>{
        // form 验证都通过
        if( $scope.formGroup.$dirty && $scope.formGroup.$valid ){
            console.log($scope.user)
        } else{
            console.error('请检查');
        }
    }

    $scope.userChange = (v) => {
        // console.log(v); // 得到的input值

        // 验证用户名
        if ($scope.formGroup.username.$dirty && $scope.formGroup.username.$valid){
            $scope.suc.usernameSuc = true;
        } else{
            $scope.suc.usernameSuc = false;
        }

        // 验证密码
        if ($scope.formGroup.password.$dirty && $scope.formGroup.password.$valid){
            $scope.suc.passwordSuc = true;
        } else{
            $scope.suc.passwordSuc = false;
        }

        // 验证手机号
        if ($scope.formGroup.phone.$dirty && $scope.formGroup.phone.$valid){
            $scope.suc.phoneSuc = true;
        } else{
            $scope.suc.phoneSuc = false;
        }

        // 验证邮箱
        if ($scope.formGroup.email.$dirty && $scope.formGroup.email.$valid){
            $scope.suc.emailSuc = true;
        } else{
            $scope.suc.emailSuc = false;
        }

        // 验证链接
        if ($scope.formGroup.url.$dirty && $scope.formGroup.url.$valid){
            $scope.suc.urlSuc = true;
        } else{
            $scope.suc.urlSuc = false;
        }
    }

    serverConnect.__get(`${baseURL}/wx/active/ajaxs`, {}).success(function(data){
        console.log('跨域成功了接口数据是↓↓↓: ');
        console.log(data)
    }).error(function(data,status,headers,config){
        console.log(data);
    });

}