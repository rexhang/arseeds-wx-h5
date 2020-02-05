// 活动排行榜
"use strict";
wxApp
.controller('rankingController', ['$rootScope', '$scope', 'serverConnect', 'baseSet', 'URL', function($rootScope, $scope, serverConnect, baseSet ,URL){//×¢·½À¨ºÅÄÚµÄ²ÎÊýÒ²Ðè×¢Èë
	return rankingController($rootScope, $scope, serverConnect, baseSet, URL);
}]);
function rankingController($rootScope, $scope, serverConnect, baseSet, URL){

	$scope.rank = [{name:'daxin',num:'15'},{name:'daxin',num:'15'},{name:'daxin',num:'15'},{name:'daxin',num:'15'}]
	// 获取网址信息
	var openid = URL.getUrlParams('openid');
	var pid = URL.getUrlParams('pid');
	//获取活动排行榜接口调用
	serverConnect.__get($rootScope.online_exchange+'/wx/user/gifts-list', {'openid':openid,'playing_id':pid}).success(function(data){
	  	$scope.result = data.data.result;
			$scope.myself = data.data.myself;
			console.log($scope.myself)
	}).error(function(data,status,headers,config){
	    console.log(data);
	});
}
