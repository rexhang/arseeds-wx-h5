angular.module('exploreApp')
.controller('editShowImageController', ['$rootScope', '$scope', 'URL', 'serverConnect', 'h5locals', '$state', '$stateParams', 'validate', '$sce', function($rootScope, $scope, URL, serverConnect, h5locals, $state, $stateParams, validate, $sce){
    return editShowImageController($rootScope, $scope, URL, serverConnect, h5locals, $state, $stateParams, validate, $sce);
}]);

function editShowImageController($rootScope, $scope, URL, serverConnect, h5locals, $state, $stateParams, validate, $sce){
    $rootScope.appLog('editShowImageController init');
    $rootScope.bodyclass = 'editShowImage';

    $scope.$on('$viewContentLoaded', () => {
        let token = h5locals.get('token');
        if ( !token ){
            $state.go('login', {}, {reload: true});
        } else{
            layer.load(1, {
                shade: [0.5, '#000'] // 0.1透明度的白色背景
            });

            $scope.thumb_photo_url = h5locals.get('thumb_photo_url'); // 读取缓存的头像

            let baseURL = URL.apiUrl().online_exchange;

            let editId = $stateParams.id; // 编辑对象的ID

            // 上传图片事件
            $scope.uploads = function(info){
                var fileInfo = info;
                console.log(fileInfo)
                var true_type = fileInfo.type.split('/')[1];
                var true_size = fileInfo.size / 1024 / 1024;
                var maxSize = 2;
                if(true_type == 'jpg' || true_type == 'jpeg'){
                    if(true_size > maxSize){
                        var msg = `您上传的图片大小[${parseInt(true_size)}M],不符合规范,仅允许${maxSize}M以下识别图的上传！`;
                        layer.alert(msg, {icon: 0});
                        $state.reload(); // 防止重复上传不符合格式的图片信息提示BUG
                    } else{
                        var _URL = window.URL || window.webkitURL;
                        var imgURL = _URL.createObjectURL( fileInfo );
                        var previewImgStatic = jQuery('#preview-box');
                        var previewImgAction = jQuery('#show-img');
                        previewImgAction.attr('src', imgURL);
                        jQuery('#crop-wrap').show();
                        previewImgStatic.show().attr('src', imgURL);
                        previewImgAction.cropper('replace', imgURL);

                        // 裁剪初始化
                        previewImgAction.cropper({
                          aspectRatio: 1 / 1,
                          crop: function( data ) {
                            // console.log(data);
                          }
                        });

                        // 定义上传识别图函数
                        let postCropImg = (URL, DATA) => {
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
                                        layer.msg('图片裁剪成功', {
                                            time: 800
                                        });
                                        jQuery('#preview-box').attr('src', data.data.file_url); // 赋值给静态预览图
                                        jQuery('#crop-wrap').hide();
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

                        // 裁剪保存按钮功能
                        jQuery('#btn-save').click(function(){
                            layer.load(1, {
                                shade: [0.5, '#000'] //0.1透明度的白色背景
                            });
                            var thisFileObj = document.getElementById('shibietu').files;
                            var imgInfo = previewImgAction.cropper("getData");
                            var cropData = new FormData(); // 发送的数据对象
                            cropData.append('type', 'image');
                            cropData.append('file', thisFileObj[0]);
                            cropData.append('is_recognition', '1');
                            cropData.append('x', imgInfo.x);
                            cropData.append('y', imgInfo.y);
                            cropData.append('w', imgInfo.width);
                            cropData.append('h', imgInfo.height);
                            postCropImg(baseURL + '/explore2/img-show/upload', cropData); // ajax开始发送
                        });

                        // 当鼠标在页面上点击实现键盘控制移动背景图片
                        jQuery(document.body).on('keydown',function(e){
                            switch (e.keyCode){
                                case 37:
                                // 阻止浏览器默认事件
                                e.preventDefault();
                                previewImgAction.cropper('move',-1,0)
                                break;
                                case 38:
                                // 阻止浏览器默认事件
                                e.preventDefault();
                                previewImgAction.cropper('move',0,-1)
                                break;
                                case 39:
                                // 阻止浏览器默认事件
                                e.preventDefault();
                                previewImgAction.cropper('move',1,0)
                                break;
                                case 40:
                                // 阻止浏览器默认事件
                                e.preventDefault();
                                previewImgAction.cropper('move',0,1)
                                break;
                            }
                        });

                        // 数据交互

                    }
                } else{
                    var msg = `您上传的图片格式为[*.${true_type}],不符合规范,仅允许jpg、jpeg格式图片的上传！`;
                    layer.alert(msg, {icon: 0});
                    $state.reload(); // 防止重复上传不符合格式的图片信息提示BUG
                }
            }

            /*裁剪框关闭按钮*/
            jQuery('#close').click(function(){
                jQuery(this).parent().parent().hide();
            });

            /*定义数据连接类*/
            class Edit {
                constructor() {}
                /*获取编辑对象信息*/
                getInfo(token, id){
                    serverConnect.__get(`${baseURL}/explore2/img-show/get-img`, {token: token, id: id}).success(function(data){
                        if(data.code == 200){
                            jQuery('#preview-box').show().attr('src', data.data.recognition_img);
                            layer.closeAll('loading');
                        } else{
                            layer.msg(data.msg, {
                                time: 800
                            });
                            layer.closeAll('loading');
                        }
                    }).error(function(data,status,headers,config){
                        layer.msg('编辑详情接口连接错误', {
                            time: 800
                        });
                        layer.closeAll('loading');
                    });
                }
                /*发送对象编辑信息*/
                saveInfo(token, id, url){
                    serverConnect.__post(`${baseURL}/explore2/img-show/put-img`, {token: token, id: id, url: url}, {}).success(function(data){
                        if(data.code == 200){
                            layer.msg('修改成功', {
                                time: 800
                            });
                            $state.go('list', {}, {reload: true});
                        } else{
                            layer.msg(data.msg, {
                                time: 800
                            });
                        }
                        layer.closeAll('loading');
                    }).error(function(data,status,headers,config){
                        layer.msg('api连接错误', {
                           time: 800
                       });
                        layer.closeAll('loading');
                    });
                }
            }
            let serverAction = new Edit();
            serverAction.getInfo(token, editId);

            // 保存按钮
            $scope.save = function(){
                layer.load(1, {
                    shade: [0.5, '#000']
                });
                var url = jQuery('#preview-box').attr('src');
                serverAction.saveInfo(token, editId, url);
            }



            /*head 通用js*/
            // 用户退出菜单JS效果
            jQuery('#personal-logo').mouseenter(() => {
                jQuery('.menu').show().addClass('animated swing');
            });
            jQuery('.right').mouseleave(() => {
                jQuery('.menu').hide().removeClass('animated swing');
            });
            // 退出
            $scope.exit = () => {
                h5locals.clear();
                layer.msg('退出成功！请重新登录。', {
                    time: 600
                });
                $state.go('login', {}, {reload: true});
            };
        }
    });

}
