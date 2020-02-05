angular.module('exploreApp')
    .controller('settingController', ['$rootScope', '$scope', 'URL', 'serverConnect', 'h5locals', '$state', function($rootScope, $scope, URL, serverConnect, h5locals, $state) {
        return settingController($rootScope, $scope, URL, serverConnect, h5locals, $state);
    }]);

function settingController($rootScope, $scope, URL, serverConnect, h5locals, $state) {
    $rootScope.appLog('settingController init');
    $rootScope.bodyclass = 'setting';

    $scope.$on('$viewContentLoaded', () => {

        let token = h5locals.get('token');
        // 判断是否登录
        if ( !token ){
            $state.go('login', {}, {reload: true});
        } else{
            layer.load(1); // 读取用户资料 开启动画
            let baseURL = URL.apiUrl().online_exchange;
            // 创建用户类
            class User {
                constructor() {}
                getUserInfo(istoken) {
                    serverConnect.__get(baseURL + '/explore2/user/get-user-info', {token: istoken}).success(function(data){
                        if (data.code == 200) {
                            $scope.user = {
                                email: data.data.email,
                                nick_name: data.data.nick_name,
                                thumb_photo: data.data.thumb_photo
                            };
                            h5locals.set("thumb_photo_url", data.data.thumb_photo); // 进行缓存头像
                            $scope.thumb_photo_url = h5locals.get('thumb_photo_url'); // 读取缓存的头像
                        } else {
                            layer.msg(data.msg, {
                                time: 500
                            });
                        }
                        layer.closeAll('loading');
                    }).error(function(data,status,headers,config){
                        layer.msg('api连接错误');
                        layer.closeAll('loading');
                    });
                }
                updateUserInfo(isdata) {
                    serverConnect.__post(baseURL + '/explore2/user/update-user-setting', isdata, {}).success(function(data) {
                        if (data.code == 200) {
                            layer.msg(data.msg, {
                                time: 800
                            });
                            $state.reload(); // 刷新当前路由
                        } else {
                            layer.msg(data.msg, {
                                time: 800
                            });
                        }
                        layer.closeAll('loading');
                    }).error(function(data, status, headers, config) {
                        console.log(data);
                        layer.closeAll('loading');
                    });
                }
                updateUserPassword(isdata) {
                    serverConnect.__post(baseURL + '/explore2/user/update-pwd', isdata, {}).success(function(data) {
                        if (data.code == 200) {
                            layer.msg(data.msg, {
                                time: 800
                            });
                            h5locals.clear(); // 清除登录记录
                            $state.go('login', {}, {reload: true}); // 跳转到登录界面
                        } else {
                            layer.msg(data.msg, {
                                time: 800
                            });
                        }
                        layer.closeAll('loading');
                    }).error(function(data, status, headers, config) {
                        console.log(data);
                        layer.closeAll('loading');
                    });
                }
            }
            let userClass = new User();
            userClass.getUserInfo(token);

            // 用户基础设置保存
            $scope.saveUserInfo = () => {
                layer.load(1);
                let isdata = {
                    token: token,
                    nick_name: $scope.user.nick_name,
                    thumb_photo: $scope.user.thumb_photo
                };
                userClass.updateUserInfo(isdata);
            };

            // 用户密码更改
            $scope.saveUserPassword = () => {
                layer.load(1);
                let isdata = {
                    token: token,
                    password: $scope.user.password,
                    newPwd: $scope.user.newPwd,
                    newPwdComfirm: $scope.user.newPwdComfirm
                }
                if($scope.user.password && $scope.user.newPwd && $scope.user.newPwdComfirm){
                    if ($scope.user.newPwd.length >= 8 && $scope.user.newPwd.length <= 16) {
                        if ($scope.user.newPwd === $scope.user.newPwdComfirm) {
                            layer.confirm('您确认将密码改为”' + $scope.user.newPwd + '“吗?', {
                                btn: ['确认修改', '放弃修改'] //按钮
                            }, function() {
                                userClass.updateUserPassword(isdata);
                            }, function() {
                                layer.closeAll('loading');
                            });
                        } else {
                            layer.msg('请确认2次新密码输入是否相同', {
                                time: 1200
                            });
                            layer.closeAll('loading');
                        }
                    } else {
                        layer.msg('请输入新密码, 密码由8-16位数字或字母组成，区分大小写', {
                            time: 1200
                        });
                        layer.closeAll('loading');
                    }
                } else{
                    layer.msg('修改密码输入框不能为空，请确认是否有漏输选项', {
                        time: 1200
                    });
                    layer.closeAll('loading');
                }
            };

            // 退出
            $scope.exit = () => {
                h5locals.clear();
                layer.msg('退出成功！请重新登录。', {
                    time: 600
                });
                $state.go('login', {}, {reload: true});
            };

            // 用户退出菜单JS效果
            jQuery('#personal-logo').mouseenter(() => {
                jQuery('.menu').show().addClass('animated swing');
            });
            jQuery('.right').mouseleave(() => {
                jQuery('.menu').hide().removeClass('animated swing');
            });

            // 上传鼠标控制效果
            jQuery('#uploadfileimg').mouseenter(() => {
                jQuery('#upload').show();
            });
            jQuery('#isfile').mouseleave(() => {
                jQuery('#upload').hide();
            });
            // 定义上传图片函数
            let postImg = (URL, DATA) => {
                jQuery.ajax({
                    url: URL,
                    type: 'post',
                    dataType: 'json',
                    data: DATA,
                    async: true,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(data) {
                        if(data.code == 200){
                            layer.msg('头像上传成功', {
                                time: 800
                            });
                            $scope.user.thumb_photo = data.data.file_url;
                            $scope.$apply();
                        } else{
                            layer.msg(data.msg, {
                                time: 800
                            });
                        }
                        layer.closeAll('loading');
                    },
                    error: function(err) {
                        layer.msg('api连接错误');
                        layer.closeAll('loading');
                    }
                });
            };

            jQuery('#isfile').change(() => {

                let fileData = document.getElementById('isfile');
                let fileinfo = fileData.files[0];
                console.log(fileinfo);
                let fd = new FormData();
                fd.append('file', fileinfo);
                fd.append('type', 'image');
                let URL = baseURL + '/explore2/img-show/upload'
                let DATA = fd;
                let fileSIZE = fileinfo.size /  1024 / 1024;
                let fileTYPE = fileinfo.type.split('/');
                console.log(fileTYPE);
                console.log(fileSIZE);
                if( fileSIZE > 2 ){
                    layer.msg('请上传小于2M的图片', {
                        time: 800
                    });
                } else{
                    if(fileTYPE[0] != 'image'){
                        layer.msg('非法文件类型!!建议上传jpg或png等格式的图片', {
                            time: 800
                        });
                    } else{
                        layer.load(1, {
                            shade: [0.5, '#000'] //0.1透明度的白色背景
                        });
                        postImg(URL, DATA); // 上传
                    }
                }
            });
        }
    });
}