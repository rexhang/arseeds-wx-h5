angular.module('exploreApp')
.controller('loginController', ['$rootScope', '$scope', 'URL', 'serverConnect', 'h5locals', '$state', function($rootScope, $scope, URL, serverConnect, h5locals, $state){
    return loginController($rootScope, $scope, URL, serverConnect, h5locals, $state);
}]);

function loginController($rootScope, $scope, URL, serverConnect, h5locals, $state){
    $rootScope.appLog('loginController init');
    $rootScope.bodyclass = 'login';
    // 视图加载完毕事件
    $scope.$on('$viewContentLoaded', () => {
        // 背景填充满图片
        let bgHeight = () => {
            let winHeight = jQuery(window).height();
            jQuery('.bg').css('height', (winHeight - 80));
        }
        bgHeight();
        jQuery(window).resize(() => {
            bgHeight();
        });

        // 登录功能函数
        let login = (loginData) => {
            let baseURL = URL.apiUrl().online_exchange;
            serverConnect.__post(baseURL + '/explore/user/pc-login', loginData, {}).success(function(data){
                if( data.code == 200 ){
                    layer.msg(data.msg, {time:800});
                    // 设置token
                    h5locals.set("token", data.data.token);
                    h5locals.set("thumb_photo_url", data.data.thumb_photo_url);
                    $state.go('list', {}, {reload: true});
                } else{
                    // 登录失败
                    jQuery('#prompt-info').text(data.msg).show().addClass('animated shake');
                    setTimeout( () => {
                        jQuery('#prompt-info').removeClass('animated shake');
                    },500 );
                }
                layer.closeAll('loading');
            }).error(function(data,status,headers,config){
                layer.msg('api连接错误');
                layer.closeAll('loading');
            });
        };
        // 点击登录
        $scope.loginin = () => {
            let loginData = {
                email: $scope.email,
                password: $scope.password
            };
            if($scope.email && $scope.password){
                layer.load(1);
                login(loginData);
            } else{
                layer.msg('请输入用户名和密码再进行登录', {time: 1200});
            }
        }
        // 回车键登录
        $scope.send = (e) => {
            var keycode = window.event?e.keyCode:e.which;
            if(keycode == 13){
                let loginData = {
                    email: $scope.email,
                    password: $scope.password
                };
                if($scope.email && $scope.password){
                    layer.load(1);
                    login(loginData);
                } else{
                    layer.msg('请输入用户名和密码再进行登录', {time: 1200});
                }
            }
        };
        let apiUrl = URL.apiUrl();
    });
}
