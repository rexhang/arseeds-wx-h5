// 上传图片
"use strict";
wxApp
.controller('uploadController', ['$rootScope', '$scope', 'serverConnect', 'baseSet', 'URL', 'validate', function($rootScope, $scope, serverConnect, baseSet ,URL,validate){//×¢·½À¨ºÅÄÚµÄ²ÎÊýÒ²Ðè×¢Èë
	return uploadController($rootScope, $scope, serverConnect, baseSet, URL, validate);
}]);

function uploadController($rootScope, $scope, serverConnect, baseSet, URL, validate){
    $scope.$on('$viewContentLoaded', function() {
            
    });
    $rootScope.set.appLog('uploadController init');
    $rootScope.bodyclass = 'upload';

    var openid = URL.getUrlParams('openid');
    var pid = URL.getUrlParams('pid');


    // 微信配置
    wx.ready(function () {
        // 全局变量
        var
        selCount = 1,
        localIds = ''
        ;
        // 点击上传
        document.querySelector('#upload').onclick = function(){
            wx.chooseImage({
                count: selCount, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    alert('localIds' +  JSON.stringify(res) ); // 选择图片后的返回信息
                    // selCount = 0; // 不允许再次上传了
                    localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    jQuery('#show').show().attr('src', res.localIds); // 显示图片
                    var imgSrc = jQuery('#show').attr('src');
                    // 添加点击图片预览的功能
                    document.querySelector('#show').onclick = function(){
                        wx.previewImage({
                            current: imgSrc, // 当前显示图片的http链接
                            urls: [imgSrc] // 需要预览的图片http链接列表
                        });
                    }
                }
            });
        };
        // 上传数据接口
        function postData(_serverIds){
            jQuery.ajax({
                type: 'POST',
                url: '',
                data: {
                    media_id: _serverIds,
                    desc: 'hello'
                },
                success: function(data, textStatus, jqXHR){
                    alert(textStatus);
                }
            });
        }
        // 提交内容
        document.querySelector('#post').onclick = function(){
            var textareaVal = jQuery("#textarea-content").val();
            var checktextareaVal = validate.space(textareaVal);
            if( localIds != '' && !checktextareaVal && textareaVal.length > 0 ){
                wx.uploadImage({
                    localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        var serverId = res.serverId; // 返回图片的服务器端ID
                        alert(serverId)
                        //postData(serverId);
                    }
                });
            } else{
                alert('请检查图片和宣言，他们是必填项，宣言不能包含空格');
            }
        }
    });
    wx.error(function(res){
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        alert(res.errMsg);
    });
}