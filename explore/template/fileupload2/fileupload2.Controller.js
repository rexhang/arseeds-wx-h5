angular.module('exploreApp')
.controller('fileupload2Controller', ['$rootScope', '$scope', function($rootScope, $scope){
    return fileupload2Controller($rootScope, $scope);
}]);

function fileupload2Controller($rootScope, $scope){
    $rootScope.appLog('fileupload2Controller init');
    $rootScope.bodyclass = 'fileupload2';

    jQuery('#upload').Huploadify({
        auto:true,
        fileTypeExts:'*.jpg;*.png;*.exe',
        multi:true,
        formData:{key:123456,key2:'vvvv'},
        fileSizeLimit:9999,
        showUploadedPercent:true,//是否实时显示上传的百分比，如20%
        showUploadedSize:true,
        removeTimeout:9999999,
        uploader:'https://rexhang.com/file_upload/file3.php',
        onUploadStart:function(){
            //alert('开始上传');
            },
        onInit:function(){
            //alert('初始化');
            },
        onUploadComplete:function(){
            //alert('上传完成');
            },
        onDelete:function(file){
            console.log('删除的文件：'+file);
            console.log(file);
        }
    });

}
