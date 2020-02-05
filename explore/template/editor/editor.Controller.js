angular.module('exploreApp')
.controller('editorController', ['$rootScope', '$scope', 'URL', function($rootScope, $scope, URL){
    return editorController($rootScope, $scope, URL);
}]);

function editorController($rootScope, $scope, URL){
    $rootScope.appLog('editorController init');
    $rootScope.bodyclass = 'editor';

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
    ]
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
    editor.customConfig.uploadImgServer = URL.apiUrl().online_exchange + '/explore/img-show/upload';
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
    // 获取文本内容
    $scope.getContents = function(){
        console.log(editor.txt.html());
    }
    /*更多配置查看 https://www.kancloud.cn/wangfupeng/wangeditor3/332599*/

    jQuery("#e-content div[contenteditable='true']").on('paste', function(){
        editor.txt.html("<p><br></p>");
    });
}
