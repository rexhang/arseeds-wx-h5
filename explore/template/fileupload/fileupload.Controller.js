angular.module('exploreApp')
.controller('fileuploadController', ['$rootScope', '$scope', function($rootScope, $scope){
    return fileuploadController($rootScope, $scope);
}]);

function fileuploadController($rootScope, $scope){
    $rootScope.appLog('fileuploadController init');
    $rootScope.bodyclass = 'fileupload';

    jQuery('.addFiles').click(function(){
        jQuery("#filePicker input[type='file']").trigger('click');
    })

    /*init webuploader apiDOC 地址: http://fex.baidu.com/webuploader/doc*/
    var $btn = jQuery("#ctlBtn");   //开始上传

    var uploader = WebUploader.create({
        // 选完文件后，是否自动上传。
        auto: false,
        // swf文件路径
        swf: '../../lib/webuploader/Uploader.swf',
        // 文件接收服务端。
        /*server: 'https://rexhang.com/file_upload/file2.php',*/
        server: 'http://60.205.148.16/explore/img-show/upload',
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: {
            id: '#filePicker',
            multiple: false
        },
        thumb: {
            width: 110,
            height: 110,
            // 图片质量，只有type为`image/jpeg`的时候才有效。
            quality: 70,
            // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
            allowMagnify: false,
            // 是否允许裁剪。
            crop: true,
            // 为空的话则保留原有图片格式。
            // 否则强制转换成指定的类型。
            type: 'image/jpeg'
        },
        //限制大小4M，单文件
        fileSingleSizeLimit: 10*1024*1024,
        // 验证文件总数量, 超出则不允许加入队列
        fileNumLimit: 1,
        // 只允许选择图片文件。
        /*accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        },*/
        method:'POST'
    });

    // 当有文件添加进来的时候
    uploader.on( 'fileQueued', function( file ) {
        // webuploader事件.当选择文件后，文件被加载到文件队列中，触发该事件。等效于 uploader.onFileueued = function(file){...} ，类似js的事件定义。
        var $li = jQuery(
            '<div id="' + file.id + '" class="file-item thumbnail">' +
            '<img>' +
            '<div class="info">' + file.name + '</div>' +
            '</div>'
        );
        var $img = $li.find('img');
        jQuery("#thelist").append( $li );
        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        uploader.makeThumb( file, function( error, src ) {  //webuploader方法
            if ( error ) {
                $img.replaceWith('<span>不能预览 只有图片和视频才能预览</span>');
                return;
            }
            $img.attr( 'src', src );
            $img.attr( 'id', 'test' );
        });
    });

    // 发送之前 修改data可以控制发送哪些携带数据。
    uploader.on( 'uploadBeforeSend', function( block, data ) {
        data.author = 'rexhang';
        data.type = 'image';
    });

    var _percent = jQuery("#upload_progress");
    var _percent_bg = jQuery('#upload_progress_bg');
    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = jQuery( '#'+file.id );
        _percent.show();
        _percent_bg.show();
        _percent.css( 'width', percentage * 100 + '%' );
        _percent.text(parseInt(percentage * 100) + '%');
        console.log(percentage)

        jQuery("#cancelBtn").click( function() {
            uploader.cancelFile(file);
        });
    });
    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on( 'uploadSuccess', function( file ) {
        jQuery( '#'+file.id ).append('<p>上传成功！</p>');
        layer.msg('上传成功！', {
            time: 1000
        });
    });
    // 文件上传失败，显示上传出错。
    uploader.on( 'uploadError', function( file ) {
        jQuery( '#'+file.id ).append('<p>上传失败！</p>');
        layer.msg('上传失败！', {
            time: 1000
        });
    });
    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on( 'uploadComplete', function( file ) {
        _percent.hide();
        _percent_bg.hide();
        uploader.reset();
        //layer.closeAll('loading');
    });
    uploader.on('error', function(type){
        if( type = 'Q_EXCEED_SIZE_LIMIT' ){
            console.error('所传的文件超大了');
            layer.alert('所传的文件超大了');
        } else if(type == "Q_TYPE_DENIED"){
            console.error('文件类型不满足')
        } else{
            console.error('未知错误');
        }
    })

    jQuery("#uploadBtn").click( function() {
        uploader.upload();
    });



}
