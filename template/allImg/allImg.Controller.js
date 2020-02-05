// 活动排行榜
"use strict";
wxApp
.controller('allImgController', ['$rootScope', '$scope', 'serverConnect', 'baseSet', 'URL', function($rootScope, $scope, serverConnect, baseSet ,URL){//×¢·½À¨ºÅÄÚµÄ²ÎÊýÒ²Ðè×¢Èë
	return allImgController($rootScope, $scope, serverConnect, baseSet, URL);
}]);
function allImgController($rootScope, $scope, serverConnect, baseSet, URL){

	$scope.rank = [{name:'daxin',num:'15'},{name:'daxin',num:'15'},{name:'daxin',num:'15'},{name:'daxin',num:'15'}]



}