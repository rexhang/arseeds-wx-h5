function login($rootScope, $scope, $http, $state) {
    function getCode() {
        $http({
            url: 'https://api.arseeds.com/integral/login/code',
            method: "GET",
            headers: {
                "Accept-Language": "zh_CN",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        }).success(function(res) {
            $scope.code = res;
            $.AMUI.progress.done();
            // 提取src 重新处理为 绝对路径
            // res.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
            //     $scope.codeSrc = 'https://api.arseeds.com' + capture;
            // });
        })
    }


    $scope.login = function() {
        goIndex()
    }

    function xcode(){
        var $container = $('#foo');
        $container.slideToUnlock({
            width: 350,
            height: 50,
            text: '向右滑动以验证',
            bgColor: '#f7f9fa',
            succText: '验证成功',
            succTextColor: '#fff',
            succColor: '#00c853',
            textColor: '#666',
            progressColor: '#00b0ff',
            successFunc: function(){
                $.AMUI.progress.start();
                getCode()
            }
        });
    }
    xcode();

    function goIndex() {
        if ($scope.name != undefined && $scope.name != '') {
            if ($scope.passWord != undefined && $scope.passWord != '') {
                if ($scope.code != undefined && $scope.code != '') {
                    var Data = {
                        username: $scope.name,
                        password: $scope.passWord,
                        code: $scope.code
                    }
                    $http({
                        url: 'https://api.arseeds.com/integral/login/login',
                        method: "POST",
                        data: jQuery.param(Data),
                        headers: {
                            "Accept-Language": "zh_CN",
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                        }
                    }).success(function(res) {
                        if (res.code == 200) {
                            localStorage.setItem("token", res.data.token)
                            localStorage.setItem("name", $scope.name)
                            $state.go('index.card');
                        } else {
                            alert(res.msg)
                        }
                    }).error(function() {
                        alert('接口挂了');
                    })
                } else {
                    alert('请确认滑动以完成验证')
                }
            } else {
                alert('请输入密码')
            }
        } else {
            alert('请输入账号')
        }
    }
}