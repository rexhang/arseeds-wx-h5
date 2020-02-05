angular.module('exploreApp')
.controller('editController', ['$rootScope', '$scope', 'URL', 'serverConnect', 'h5locals', '$state', '$stateParams', 'validate', '$sce', function($rootScope, $scope, URL, serverConnect, h5locals, $state, $stateParams, validate, $sce){
    return editController($rootScope, $scope, URL, serverConnect, h5locals, $state, $stateParams, validate, $sce);
}]);

angular.module('exploreApp')
.directive('ngUpload', [function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs) {
            element.on('change', fileUpload);
            scope.$on('$destroy',function(){
                /*销毁的时候取消事件监听*/
                element.off('change', fileUpload);
            });
            /*在Controller中监听$destory事件，这个事件会在页面发生跳转的时候触发*/
            /*比如window.scroll事件在下一页scroll的时候还会继续被触发
            在这个事件的回调中，清除当前页面的监听或者一些参数保证下面的页面不会再触发当前页面的事件回调*/
            function fileUpload(event){
                scope.$evalAsync(attrs['ngUpload'], {$event: event, $value: this.files[0]});
            }
        }
    }
}]);

function editController($rootScope, $scope, URL, serverConnect, h5locals, $state, $stateParams, validate, $sce){
    $rootScope.appLog('editController init');
    $rootScope.bodyclass = 'edit';

    $scope.$on('$viewContentLoaded', () => {
        let token = h5locals.get('token');
        if ( !token ){
            $state.go('login', {}, {reload: true});
        } else{
            let editId = $stateParams.id; // 当前ID
            console.log( editId );
            let baseURL = URL.apiUrl().online_exchange;
            console.log(window.location.host);
            console.log(URL.apiUrl())
            $scope.thumb_photo_url = h5locals.get('thumb_photo_url'); // 读取缓存的头像
            if( editId == 'add' ){
                // 进入创建页面
                $rootScope.__state.current.data.pageTitle = '新建识别图';
                layer.load(1); // 资源初始化 开启动画 - 初始化完毕再关闭动画
                // 上传处理函数
                function bindUpload(){
                    var fileObj = document.getElementById('shibietu').files;
                    var true_type = fileObj[0].type.split('/')[1];
                    var true_size = fileObj[0].size / 1024 / 1024;
                    // 仅允许jpg jpeg格式图片的上传
                    if(true_type == 'jpg' || true_type == 'jpeg'){
                        if(true_size > 2){
                            var msg = `您上传的图片大小[${true_size}M],不符合规范,仅允许2M以下识别图的上传！`;
                            layer.alert(msg, {icon: 0});
                            $state.reload(); // 防止重复上传不符合格式的图片信息提示BUG
                        } else{
                            var _URL = window.URL || window.webkitURL; // 获取 window 的 URL 工具
                            var imgURL = _URL.createObjectURL( fileObj[0] ); // 通过 file 生成目标 url
                            var previewImgStatic = jQuery('#preview-box'); // 预览展示的图片对象
                            var previewImgAction = jQuery('#show-img'); // 裁剪操作的图片对象
                            previewImgAction.attr('src', imgURL); // 赋值图片路径地址
                            jQuery('#crop-wrap').show(); // 弹窗显示
                            previewImgStatic.show().attr('src', imgURL);// 赋值图片路径地址
                            previewImgAction.cropper('replace', imgURL); // 替换裁剪区域图片

                            // 裁剪初始化
                            previewImgAction.cropper({
                              aspectRatio: 1 / 1,
                              crop: function( data ) {
                                // console.log(data);
                              }
                            });

                            // 定义上传图片函数
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

                                            // 重新绑定
                                            jQuery('#shibietu').remove(); // 删除
                                            var fileDom = jQuery("<input type='file' id='shibietu' accept='image/jpeg'>");
                                            jQuery('#btn-upload-shibietu').append(fileDom);
                                            fileDom.on('change', bindUpload);
                                            layer.closeAll('loading');
                                        } else{
                                            layer.msg(data.msg, {
                                                time: 800
                                            });
                                            layer.closeAll('loading');
                                        }
                                    },
                                    error: function(err) {
                                        layer.msg('api连接错误');
                                        layer.closeAll('loading');
                                    }
                                });
                            };
                            // 获取裁剪后的图片信息
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
                                postCropImg(baseURL+'/explore/img-show/upload', cropData); // ajax开始发送
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
                        }
                    } else{
                        var msg = `您上传的图片格式为[*.${true_type}],不符合规范,仅允许jpg、jpeg格式图片的上传！`;
                        layer.alert(msg, {icon: 0});
                        $state.reload(); // 防止重复上传不符合格式的图片信息提示BUG
                    }
                }
                // 检测的有文件上传的时候处理函数
                jQuery('#shibietu').on('change', bindUpload);
                // 关闭裁剪框
                jQuery('#close').click(function(){
                    jQuery(this).parent().parent().hide();
                })
            } else{
                // 进入编辑页面
                $rootScope.__state.current.data.pageTitle = '编辑识别图';
                // layer.load(1); // 读取用户资料 开启动画
            }

            $scope.$on('$destroy',function(){
                /*销毁的时候可以取消一些本页给的全局的事件监听*/
                console.log("leave edit page")
            });


            /**
             * 通用部分
             */
            // 点击切换识别结果类型
            jQuery('#ctrl-center > .nav-item').click(function(){
                jQuery(this).addClass('sel').siblings().removeClass('sel');
            });
            // 背景音乐切换
            var is_sel = false;
            jQuery('#bgm-box').click(function(){
                if(is_sel){
                    jQuery(this).removeClass('sel');
                    jQuery('#btn-upload-font').css('color', 'rgba(255,255,255,.5)');
                    is_sel = false;
                } else{
                    jQuery(this).addClass('sel');
                    jQuery('#btn-upload-font').css('color', '#fff');
                    is_sel = true;
                }
            });

            // webUploader-音频上传初始化配置
            var uploader = WebUploader.create({
                // 选完文件后，是否自动上传。
                auto: true,
                // swf文件路径
                swf: '../../lib/webuploader/Uploader.swf',
                // 文件接收服务端。
                /*server: 'https://rexhang.com/file_upload/file2.php',*/
                server: `${baseURL}/explore/img-show/upload`,
                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: {
                    id: '#filePicker',
                    multiple: false
                },
                //限制大小10M，单文件
                fileSingleSizeLimit: 5*1024*1024,
                // 验证文件总数量, 超出则不允许加入队列
                /*fileNumLimit: 1,*/
                // 只允许选择指定类型文件。
                accept: {
                    title: '背景音乐',
                    extensions: 'mp3,wma,wav,amr',
                    mimeTypes: 'audio/mp3, audio/wma, audio/wav, audio/amr'
                },
                method:'POST'
            });
            // webUploader-视频上传初始化配置
            var uploader_video = WebUploader.create({
                // 选完文件后，是否自动上传。
                auto: true,
                // swf文件路径
                swf: '../../lib/webuploader/Uploader.swf',
                // 文件接收服务端。
                /*server: 'https://rexhang.com/file_upload/file2.php',*/
                server: `${baseURL}/explore/img-show/upload`,
                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: {
                    id: '#trigger-video',
                    multiple: false
                },
                //限制大小10M，单文件
                fileSingleSizeLimit: 10*1024*1024,
                // 验证文件总数量, 超出则不允许加入队列
                /*fileNumLimit: 1,*/
                // 只允许选择指定类型文件。
                accept: {
                    title: '视频',
                    extensions: 'mp4,mov',
                    mimeTypes: 'video/mp4, video/quicktime'
                },
                method:'POST'
            });
            var acceptData = ['mp3', 'wma', 'wav', 'amr']; // 允许的音频文件类型
            // 当有文件添加进来的时候
            uploader.on( 'fileQueued', function( file ) {
                console.log(file);
                jQuery('#fileName').show().text(file.name);
                jQuery('#upload-bgm').hide();
                jQuery('#fullName').hide();
            });
            uploader_video.on( 'fileQueued', function( file ) {
                console.log(file);
                jQuery('#uploader-video > .fileName-video').text(file.name); // 显示文件名
                jQuery('#upload-video-btn').hide(); // 隐藏上传按钮
                jQuery('#video-box > .doc').hide(); // 隐藏上传文件的文案说明

                jQuery('#uploader-video').show(); // 显示上传进度控件

                jQuery('#success-video-box').hide(); // 隐藏成功状态框
            });
            // 当出错时候的事件监听
            uploader.on('error', function(type){
                console.log(type)
                if( type == 'Q_EXCEED_SIZE_LIMIT' ){
                    layer.alert('所传的文件总数超过10MB了！1次只能选择一个文件进行上传，请按照要求进行上传');
                } else if(type == "F_EXCEED_SIZE"){
                    layer.alert('所传的文件大小超过5MB了！请按照要求进行上传', {icon: 0});
                } else if(type == "Q_TYPE_DENIED"){
                    layer.alert('请确认您上传的格式是mp3、wma、wav、amr其中的一种文件格式', {icon: 0});
                } else if(type == "F_DUPLICATE"){
                    layer.alert('请不要重复上传同一个文件', {icon: 0});
                } else{
                    console.error('未知错误');
                }
            })
            // 当出错时候的事件监听
            uploader_video.on('error', function(type){
                console.log(type)
                if( type == 'Q_EXCEED_SIZE_LIMIT' ){
                    layer.alert('所传的文件总数超过10MB了！1次只能选择一个文件进行上传，请按照要求进行上传');
                } else if(type == "F_EXCEED_SIZE"){
                    layer.alert('所传的文件大小超过10MB了！请按照要求进行上传', {icon: 0});
                } else if(type == "Q_TYPE_DENIED"){
                    layer.alert('请确认您上传的格式是mp4、mov其中的一种文件格式', {icon: 0});
                } else if(type == "F_DUPLICATE"){
                    layer.alert('请不要重复上传同一个文件', {icon: 0});
                } else{
                    console.error('未知错误');
                }
            })
            // 发送之前 修改data可以控制发送哪些携带数据。
            uploader.on( 'uploadBeforeSend', function( block, data ) {
                data.author = 'rexhang';
                data.type = 'audio';
            });
            // 发送之前 修改data可以控制发送哪些携带数据。
            uploader_video.on( 'uploadBeforeSend', function( block, data ) {
                data.author = 'rexhang';
                data.type = 'video';
            });
            // 文件上传过程中创建进度条实时显示。
            uploader.on( 'uploadProgress', function( file, percentage ) {
                var _percent = parseInt(percentage * 100);
                console.log(_percent);
                jQuery('#progress-box').show(); // 显示进度条

                jQuery('#progress-box .progress-center').css('width', 830 * percentage );
                jQuery('#progress-box .text').text(_percent - 1  + '%');
                jQuery('#cancelBtn').show();
                jQuery("#cancelBtn").click( function() {
                    uploader.cancelFile(file);
                    jQuery('#progress-box').hide();
                    jQuery('#fileName').hide();
                    uploader.reset();
                    jQuery(this).hide();
                    jQuery('#upload-bgm').show();
                });
            });
            // 文件上传过程中创建进度条实时显示。
            uploader_video.on( 'uploadProgress', function( file, percentage ) {
                var _percent = parseInt(percentage * 100);
                console.log(_percent);
                jQuery('#uploader-video > .progress-box > .progress-center').css('width', 830 * percentage );
                jQuery('#uploader-video > .progress-box .text').text(_percent - 1  + '%');

                // 为取消按钮添加功能
                jQuery("#uploader-video > .cancel-btn").click( function() {
                    uploader_video.cancelFile(file);
                    uploader_video.reset();
                    // 取消点击之后 需要隐藏 上传部分的显示
                    jQuery('#upload-video-btn').show(); // 显示上传按钮
                    jQuery('#video-box > .doc').show(); // 显示上传文件的文案说明

                    jQuery('#uploader-video').hide(); // 隐藏上传进度控件
                });


            });
            var mp3length = null; // 全局变量MP3资源时间长度
            var videolength = null; // 全局变量video资源时间长度
            // 文件上传成功
            uploader.on( 'uploadSuccess', function( file, data ) {
                if(data.code == '200'){
                    jQuery('#progress-box .progress-center').css('width', '842px');
                    jQuery('#progress-box .text').text('100%');
                    layer.msg('上传成功！', {
                        time: 1200
                    });
                    // 赋值
                    jQuery('#fullName > .music-name').text(data.data.file_name);
                    // 获取文件时长
                    function getMp3TimeLength(mp3Src){
                        var mp3 = new Audio(mp3Src);
                        mp3.oncanplay = function(){
                            if(mp3.duration <= 60){
                                mp3length = '0分' + parseInt(mp3.duration) + '秒';
                            } else{
                                var mp3Time = mp3.duration / 60; // 时间 / 分
                                var Minute = parseInt(mp3Time); // 分
                                var Second =  mp3.duration - (Minute * 60);
                                mp3length = Minute+'分'+parseInt(Second)+'秒';
                            }
                            console.log(mp3length);
                            jQuery('#fullName > .music-timer').text(mp3length);
                        }
                    }
                    // gobal -> mp3length 代表MP3的时长
                    var mp3Src = data.data.file_url;
                    $scope.isAudio = data.data.file_url;
                    $scope.isResult_extend_size_audio = data.data.file_size;
                    getMp3TimeLength(mp3Src);
                    onSuccessDo();
                } else{
                    layer.msg(data.msg, {
                        time: 1200
                    });
                    uploader.reset();
                }
                console.log(data);
            });
            // 文件上传成功
            uploader_video.on( 'uploadSuccess', function( file, data ) {
                console.log(data);
                if(data.code == '200'){
                    jQuery('#uploader-video > .progress-box .progress-center').css('width', '842px');
                    jQuery('#uploader-video > .progress-box .text').text('100%');
                    layer.msg('上传成功！', {
                        time: 1200
                    });
                    // 获取文件时长
                    function getMp3TimeLength(mp3Src){
                        var mp3 = new Audio(mp3Src);
                        mp3.oncanplay = function(){
                            if(mp3.duration <= 60){
                                videolength = '0分' + parseInt(mp3.duration) + '秒';
                            } else{
                                var mp3Time = mp3.duration / 60; // 时间 / 分
                                var Minute = parseInt(mp3Time); // 分
                                var Second =  mp3.duration - (Minute * 60);
                                videolength = Minute+'分'+parseInt(Second)+'秒';
                            }
                            console.log(videolength);
                            jQuery('#success-video-timer').text(videolength); // 视频时长赋予
                        }
                    }
                    // gobal -> mp3length 代表MP3的时长
                    var mp4Src = data.data.file_url;
                    getMp3TimeLength(mp4Src);

                    $scope.isResult_extend_size_video = data.data.file_size; // 取视频的大小
                    $scope.isVideoUrl = mp4Src; // 取视频地址

                    jQuery('#success-video-size').text(data.data.file_size); // 视频大小赋予
                    jQuery('#success-video-name').text(data.data.file_name); // 视频名称赋予
                    jQuery('#play-video').attr('src', data.data.file_url); // 视频地址的赋予

                    jQuery('#success-video-box').show(); // 显示成功状态框

                    jQuery('#uploader-video').hide(); // 隐藏上传进度控件


                    jQuery('#uploader-video > .progress-box > .progress-center').css('width', '0' ); // 进度条归位
                    jQuery('#uploader-video > .progress-box .text').text('0%'); // 百分比文字归位





                } else{
                    layer.msg(data.msg, {
                        time: 1200
                    });
                    uploader_video.reset();
                }
            });
            // 文件上传失败，显示上传出错。
            uploader.on( 'uploadError', function( file ) {
                layer.msg('上传失败！请重试', {
                    time: 1000
                });
            });
            // 文件上传失败，显示上传出错。
            uploader_video.on( 'uploadError', function( file ) {
                layer.msg('上传失败！请重试', {
                    time: 1000
                });
            });
            // 完成上传完了，成功或者失败，先删除进度条。
            uploader.on( 'uploadComplete', function( file ) {
                uploader.reset();
                //uploader.destroy();
            });
            // 完成上传完了，成功或者失败，先删除进度条。
            uploader_video.on( 'uploadComplete', function( file ) {
                uploader_video.reset();
                //uploader.destroy();
                console.warn(file)
                if(file.ext != 'mp4'){
                    $scope.extVideo = true;
                    $scope.$apply();
                } else{
                    $scope.extVideo = false;
                    $scope.$apply();
                }
            });
            // 上传成功处理函数
            function onSuccessDo(){
                uploader.reset();
                jQuery('#progress-box').hide(); // 隐藏进度dom
                jQuery('#fileName').hide(); // 隐藏显示预览文件名dom
                jQuery('#cancelBtn').hide(); // 隐藏取消按钮

                jQuery('#fullName').show(); // 显示成功DOM树

                jQuery('#progress-box .progress-center').css('width', '0'); // 归0
                jQuery('#progress-box .text').text('0%'); // 归0

            }
            // 代理上传按钮事件
            function triggerUpload(){
                var _hasSel = jQuery('#bgm-box').hasClass('sel');
                if(_hasSel){
                    jQuery("#filePicker input[type='file']").trigger('click');
                } else{
                    layer.msg('请先勾选背景音乐才可上传', {
                        time: 1000
                    });
                }
            }
            // 代理视频上传按钮事件
            function triggerUpload_video(){
                jQuery("#trigger-video input[type='file']").trigger('click');
            }
            // 视频代理按钮
            jQuery('#upload-video-btn').click(function(){
                triggerUpload_video();
            })

            jQuery('#uploader-video-again').click(function(){
                triggerUpload_video();
            })

            // 上传额外的Mov对应的mp4视频字段
            $scope.uploadMovmp4 = (fileInfo) => {
                // 显示模态框
                layer.msg('文件上传中, 请稍候……', {
                  icon: 16
                  ,shade: [0.5,'#000']
                  ,time: 500000
                });
                console.log(fileInfo)
                // ajax文件上传
                let postVideo = (_URL, _DATA) => {
                    jQuery.ajax({
                        url: _URL,
                        type: 'post',
                        dataType: 'json',
                        data: _DATA,
                        async: true,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function(data) {
                            if(data.code == 200){
                                layer.msg('上传成功', {
                                    time: 900
                                });
                                jQuery('#upload-movmp4 font').text('重新上传');
                                $scope.uploadMovmp4FileTime = jQuery('#success-video-timer').text();
                                $scope.uploadMovmp4FileSrc  = $sce.trustAsResourceUrl(data.data.file_url);
                                $scope.uploadMovmp4FileName = data.data.file_name;
                                $scope.uploadMovmp4FileSize = data.data.file_size;
                                $scope.$apply();
                            } else{
                                layer.msg(data.msg, {
                                    time: 900
                                });
                            }
                            layer.closeAll('loading');
                        },
                        error: function(err) {
                            layer.msg('api连接错误');
                            layer.closeAll('loading');
                        }
                    });
                }

                let fileSize = fileInfo.size / 1024 / 1024;
                let ext = fileInfo.type.split('/')[1];
                let MaxSize = 10;
                let AllowType = 'mp4';
                if(fileSize > MaxSize){
                    layer.closeAll('loading');
                    layer.alert(`所传的文件大小超过${MaxSize}MB了！请按照要求进行上传`, {icon: 0});
                } else if(ext != AllowType){
                    layer.closeAll('loading');
                    layer.alert(`请上传${AllowType}格式的视频`, {icon: 0});
                } else{
                    var videoData = new FormData(); // 发送的数据对象
                    videoData.append('type', 'video');
                    videoData.append('file', fileInfo);
                    videoData.append('is_recognition', '0');
                    postVideo(baseURL+'/explore/img-show/upload', videoData);
                }
            }

            // 视频播放按钮
            var VIDEOis_play = false;
            jQuery('#play-video').click(function(){
                if(VIDEOis_play){
                    jQuery('#play-video')[0].pause(); // 暂停
                    VIDEOis_play = false;
                } else{
                    jQuery('#play-video')[0].play(); // 播放
                    VIDEOis_play = true;
                }

            })

            // 音频代理按钮
            jQuery('#btn-upload-font').click(function(){
                triggerUpload();
            })
            jQuery('#btn-upload-font2').click(function(){
                triggerUpload();
            })

            // 切换图文音&视频
            jQuery('#ctrl-center > .nav-item').click(function(){
                let _index = jQuery(this).index();
                if(_index == 0){
                    // 图文音
                    jQuery('#video-box').hide();
                    jQuery('#mix-box').show();
                } else if(_index == 1){
                    // 视频
                    jQuery('#mix-box').hide();
                    jQuery('#video-box').show();
                }
            });


            // 富文本编辑器
            let E = require('wangeditor');
            let editor = new E('#e-menu', '#e-content'); // 分离式
            //let editor = new E('#editor');
            // 自定义菜单配置
            editor.customConfig.menus = [
                'head',  // 标题
                'bold',  // 粗体
                'italic',  // 斜体
                'underline',  // 下划线
                'strikeThrough',  // 删除线
                'foreColor',  // 文字颜色
                'backColor',  // 背景颜色
                'link',  // 插入链接
                'list',  // 列表
                'justify',  // 对齐方式
                'quote',  // 引用
                'emoticon',  // 表情
                'image',  // 插入图片
                'table',  // 表格
                'video',  // 插入视频
                'code',  // 插入代码
                'undo',  // 撤销
                'redo'  // 重复
            ];
            editor.customConfig.menus = [
                'image',  // 插入图片
                'undo',  // 撤销
                'redo'  // 重复
            ];
            // 将图片大小限制为 2M
            editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024;
            // 限制一次最多上传 1 张图片
            editor.customConfig.uploadImgMaxLength = 1;
            editor.customConfig.uploadImgParams = {
                from: 'wangEditor',   // 属性值会自动进行 encode ，此处无需 encode
                type: 'image'
            };
            editor.customConfig.uploadFileName = 'file';
            // 将 timeout 时间改为 6s
            editor.customConfig.uploadImgTimeout = 10000;
            editor.customConfig.uploadImgServer = baseURL + '/explore/img-show/upload';
            //editor.customConfig.uploadImgServer = 'https://rexhang.com/file_upload/file2.php';
            editor.customConfig.uploadImgHooks = {
                before: function (xhr, editor, files) {
                    // 图片上传之前触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
                    layer.load(1, {
                      shade: [0.5,'#000'] //0.1透明度的白色背景
                    });
                },
                success: function (xhr, editor, result) {
                    // 图片上传并返回结果，图片插入成功之后触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                    layer.closeAll('loading');
                },
                fail: function (xhr, editor, result) {
                    // 图片上传并返回结果，但图片插入错误时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                    layer.closeAll('loading');
                },
                error: function (xhr, editor) {
                    // 图片上传出错时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                    layer.closeAll('loading');
                },
                timeout: function (xhr, editor) {
                    // 图片上传超时时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                    layer.closeAll('loading');
                },
                // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
                customInsert: function (insertImg, result, editor) {
                    var url = result.data.file_url;
                    insertImg(url)
                }
            };
            // 文本改变触发事件
            editor.customConfig.onchange = function (html) {
                // html 即变化之后的内容
                console.log(html)
            }
            editor.create();
            // 设置内容
            // editor.txt.html("");
            // 获取文本内容
            $scope.getContents = function(){
                console.log(editor.txt.html());
            }
            // 禁止粘贴
            jQuery("#e-content div[contenteditable='true']").on('paste', function(){
                layer.msg('不允许粘贴！！！', {
                    time: 800
                })
                editor.txt.html('<p><br></p>');
            });
            /*更多配置查看 https://www.kancloud.cn/wangfupeng/wangeditor3/332599*/

            // 保存按钮
            $scope.createNew = function(){
                layer.load(1, {
                    shade: [0.5, '#000']
                });

                let isType = ''; // mix video
                if(jQuery('#ctrl-center > .nav-item:first').hasClass('sel')){
                    isType = 'mix';
                } else{
                    isType = 'video';
                }

                let isAudio = ''; // mix-audio-url
                if (jQuery('#bgm-box').hasClass('sel')){
                    if($scope.isAudio){
                        isAudio = $scope.isAudio; // mix-audio-url
                    }
                }

                let isResult = ''; // mix的标签数据或者video链接
                if(isType == 'mix'){
                    // 如果是识别图就必须有标题
                    if($scope.resultTitle){
                        isResult = encodeURIComponent('<h2>' + $scope.resultTitle + '</h2>' + editor.txt.html()); // 取图文混排的标签数据
                    } else{
                        // layer.alert('请填写标题', {icon: 0});
                    }
                } else{
                    isResult = $scope.isVideoUrl; // 取视频地址
                }

                let isRecognition_img = jQuery('#img-preview img').attr('src'); // 裁剪过后的识别图

                let isRedirect_title = $scope.linkName; // 链接名称

                let isRedirect_content = $scope.linkContent; // 协议地址
                /**
                    // url认证
                    let isRedirect_content = ''; // 协议地址
                    if( validate.url($scope.linkContent) ){
                        // 验证网址通过
                        isRedirect_content = $scope.linkContent;
                    } else{
                        layer.alert('链接地址不正确', {icon: 0});
                    }
                 */

                let isResult_extend_size = ''; // 扩展数据大小
                if(isType == 'mix'){
                    // 取音频的大小
                    isResult_extend_size = $scope.isResult_extend_size_audio;
                } else{
                    // 取视频的大小
                    isResult_extend_size = $scope.isResult_extend_size_video;
                }

                let isResult_extend_time = ''; // 扩展数据的时长
                if(isType == 'mix'){
                    isResult_extend_time = mp3length; // 音频时长
                } else{
                    isResult_extend_time = videolength; // 视频时长
                }

                let isResult_extend_cover = 'https://illuminate.oss-cn-shanghai.aliyuncs.com/explore/image/SMw5TbZxNE.png'; // 扩展数据的封面图

                let isTrans_video = ''; // 当视频为mov格式扩展的mp4视频
                if(isType != 'mix'){
                    if($scope.extVideo){
                        isTrans_video = jQuery('#uploadMovmp4').attr('src');
                    } else{
                        isTrans_video = jQuery('#play-video').attr('src');
                    }
                }

                // 发送的数据
                let postData = {
                    token: token,
                    type: isType,
                    audio: isAudio,
                    result: isResult,
                    recognition_img: isRecognition_img,
                    redirect_title: isRedirect_title,
                    redirect_content: isRedirect_content,
                    result_extend_size: isResult_extend_size,
                    result_extend_time: isResult_extend_time,
                    result_extend_cover: isResult_extend_cover,
                    trans_video: isTrans_video
                };
                console.warn(postData);
                let posttingData = ()=> {
                    serverConnect.__post(`${baseURL}/explore/img-show/create`, postData, {}).success(function(data){
                        if(data.code == '200'){
                            layer.msg('恭喜!!数据新建成功', {
                                time: 1100
                            });
                            // 跳转到列表页
                            $state.go('list', {}, {reload: true});
                        } else{
                            layer.msg(data.msg, {
                                time: 800
                            });
                        }
                        layer.closeAll('loading');
                    }).error(function(data,status,headers,config){
                        layer.msg('api连接错误');
                        layer.closeAll('loading');
                    });
                }
                // 必传识别图 && 类型捕捉正确 && token正确 && 图文结果或者视频有结果
                if(isRecognition_img && isType && token && isResult){
                    if(isType != 'mix'){
                        if($scope.extVideo){
                            if(!isTrans_video){
                                layer.closeAll('loading');
                                layer.alert('请检查是代替mov展示的mp4是否上传', {icon: 0});
                            } else{
                                posttingData();
                            }
                        } else{
                            posttingData();
                        }
                    } else{
                        posttingData();
                    }
                } else{
                    layer.alert('请检查是否有相关信息未填写完整的', {icon: 0});
                    layer.closeAll('loading');
                }
            }

            /*
            // 获取媒体时长
            function getMp3TimeLength(mp3Src){
                var mp3 = new Audio(mp3Src);
                mp3.oncanplay = function(){
                    var mp3Time = mp3.duration / 60; // 时间 / 分
                    var Minute = parseInt(mp3Time); // 分
                    var Second = mp3Time.toString().split('.')[1].split('')[0] / 10 * 60; // 秒
                    mp3length = Minute+'分'+Second+'秒';
                    console.log(mp3length);
                }
            }
            // use:
            var mp3length = null; // 全局变量MP3资源时间长度
            var mp3Src = 'https://rexhang.com/webtask/audio/gaobaiqiqiu.mp3';
            getMp3TimeLength(mp3Src);
            */



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

            layer.closeAll('loading'); // 初始化完毕 关闭动画
        }
    });

}
