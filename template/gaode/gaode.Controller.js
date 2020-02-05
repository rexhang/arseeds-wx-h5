// 白鹿原打卡活动页面
"use strict";
wxApp
.controller('gaodeController', ['$rootScope', '$scope', 'serverConnect', 'baseSet', 'URL', '$state', '$stateParams','$window', function($rootScope, $scope, serverConnect, baseSet ,URL, $state, $stateParams,$window){//×¢·½À¨ºÅÄÚµÄ²ÎÊýÒ²Ðè×¢Èë
    return gaodeController($rootScope, $scope, serverConnect, baseSet, URL, $state,$stateParams,$window);
}]);

function gaodeController($rootScope, $scope, serverConnect, baseSet, URL, $state,$stateParams,$window){
    $scope.$on('$viewContentLoaded', function() {
        
    });

        jQuery('#btns').click(function(){
            getMyPositions();
        })

        function getMyPositions(){
            var LAT = null; // 经度 小
            var LNG = null; // 纬度 大
            navigator.geolocation.getCurrentPosition(suc, err, {enableHighAccuracy: true});
            function suc(position) {
                alert('success');
                console.log(position.coords.latitude, position.coords.longitude);
                LAT = position.coords.latitude;
                LNG = position.coords.longitude;
                alert('GPS原始坐标: lat='+position.coords.latitude+'&lng='+position.coords.longitude)
                // 转换坐标系
                // var _positions = [LNG, LAT].join(',');
                // jQuery.getJSON('https://restapi.amap.com/v3/assistant/coordinate/convert?key=6ab0dff8d38b0bf88196fc7b122a96dd&locations='+ _positions +'&coordsys=gps', function(data){
                //     if(data.info == 'ok'){
                //         alert('转换后的坐标信息'+data.locations);
                //     } else{
                //         alert('amap connect error')
                //     }
                // })
                /**
                 * 第二种转换坐标系，依赖高德地图API
                 */
                
                var lngLatTotal = LNG.toString()+','+LAT.toString();
                var converts = new AMap.convertFrom(lngLatTotal,"gps",function(info,result){
                    console.log(result);
                    alert('转换过后的坐标: '+result.locations);
                    LNG = result.locations[0].lng;
                    LAT = result.locations[0].lat;
                });
            };
            function err(msg) {
              alert('请确认网络流畅，并且开启GPS定位');
              console.log(msg.code, msg.message);
            };
        }
}
