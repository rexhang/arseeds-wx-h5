"use strict";
wxApp
    .controller('ImageTextController', ['$rootScope', '$scope', 'serverConnect', 'baseSet', 'URL', '$sce', function($rootScope, $scope, serverConnect, baseSet, URL, $sce) {
        return ImageTextController($rootScope, $scope, serverConnect, baseSet, URL, $sce);
    }]);

function ImageTextController($rootScope, $scope, serverConnect, baseSet, URL, $sce) {
    let htmlResource = '<h1>你们好</h1><p><img src="https://rexhang.com/file_upload/files/2017-06-22-09-59-36_1bb87d41d15fe27b500a4bfcde01bb0e.png" style="max-width:100%;"><br></p><p>我在这里和你们说sdjkd时代就开始几点开始是我在这里和你们说sdjkd时代就开始几点开始是<span style="font-size: 10px;">里和你们说sdjkd时代就开始几点开始是</span></p><p><img src="https://rexhang.com/file_upload/files/2017-06-22-10-09-41_4a47a0db6e60853dedfcfdf08a5ca249.png" style="max-width:100%;"><span style="font-size: 10px;"><br></span></p><p>圣诞节快圣诞节是多少<span style="font-size: 10px;">圣诞节快圣诞节是多少</span><span style="font-size: 10px;">圣诞节快圣诞节是多少</span><span style="font-size: 10px;">圣诞节快圣诞节是多少</span></p>';
    $scope.text = $sce.trustAsHtml(htmlResource);
}