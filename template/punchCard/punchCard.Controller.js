// 白鹿原打卡活动页面
"use strict";
wxApp
.controller('punchCardController', ['$rootScope', '$scope', 'serverConnect', 'baseSet', 'URL', '$state', '$stateParams','$window', function($rootScope, $scope, serverConnect, baseSet ,URL, $state, $stateParams,$window){//×¢·½À¨ºÅÄÚµÄ²ÎÊýÒ²Ðè×¢Èë
	return punchCardController($rootScope, $scope, serverConnect, baseSet, URL, $state,$stateParams,$window);
}]);

function punchCardController($rootScope, $scope, serverConnect, baseSet, URL, $state,$stateParams,$window){
    $scope.$on('$viewContentLoaded', function() {
        // 判断是否需要刷新
        var is_reload = $stateParams.is_reload;
        console.log('is_reload：'+is_reload)
        if( is_reload == 1 ){
            setTimeout(function () {
                $state.go('punchCard',{is_reload: 2}, {reload:true});
            }, 1000);
        }

        // initialize core components
        map.plugin(["AMap.ToolBar"], function() {
            map.addControl(new AMap.ToolBar());
        });
        if(location.href.indexOf('&guide=1')!==-1){
            map.setStatus({scrollWheel:false})
        }

        // 点击关闭弹窗
        jQuery('.Iknow1').on('touchend', function(){
            jQuery('.popUp1').hide()
        });
        jQuery('.Iknow2').on('touchend', function(){
            jQuery('.popUp2').hide()
        });
        jQuery('.Iknow3').on('touchend', function(){
            jQuery('.popUp3').hide()
        });
		jQuery('.Iknow0').on('touchend', function(){
            jQuery('.popUp0').hide()
        });

        initMapData();

    });


        var openid = URL.getUrlParams('openid');
        var pid = URL.getUrlParams('pid');

        var geolocation;
        var map = new AMap.Map('container', {
                resizeEnable: true,
                zoom: 14,
                dragEnable: true,
                zoomEnable: true
         });

        // 创建3D图层
        if (document.createElement('canvas') && document.createElement('canvas').getContext && document.createElement('canvas').getContext('2d')) {
            // 实例化3D楼块图层
            var buildings = new AMap.Buildings();
            // 在map中添加3D楼块图层
            buildings.setMap(map);
        } else {
            document.getElementById('tip').innerHTML = "对不起，需要浏览器支持HTML5！";
        }

        var
        markers    = [],
        provinces  = [],
        radius     = void 0
        ;
        // 初始化地图标记点

        function initMapData(){
            // 请求点坐标等配置信息
            serverConnect.__get($rootScope.online + '/v1/inner/start-playing', {playing_id: pid}).success(function(data){
                // 优惠券点击跳转
                $scope.pageto = function(){
                    window.location.href = data.data.node_list.coupon_config[0].coupon_href;
                };

                var res = data.data;
                var getMapArr = res.node_list.node_config;
                radius = getMapArr[0].location.radius; // 获取打卡半径的阀值
                

                jQuery.each(getMapArr, function(index, item){
                    var lat = item.location.lat;
                    var lng = item.location.lng;
                    provinces.push({name: item.node_name, points: lng+","+lat, node_id: item.node_id, point: item.point });
                })
                console.log(provinces); // 五个点对象

                for (var i = 0; i < provinces.length; i ++) {
                    var marker;
                        marker = new AMap.Marker({
                            position: provinces[i].points.split(','),
                            icon : new AMap.Icon({
                                        image: "./img/whitedeer/clickDog.png",
                                        size: new AMap.Size(60, 60),
                                        imageSize: new AMap.Size(60, 60)
                                    }),
                            map: map,
                            title: provinces[i].name,
                            clickable : true,
                            animation: 'AMAP_ANIMATION_DROP',
                            autoRotation: true,
                            draggable: false,
                            raiseOnDrag: false
                        });
                    markers.push(marker);
                }
                map.setFitView(); // 调整合适缩放
                // 为marker添加点击事件
                AMap.event.addListener(markers[0],'click', function (){
                    getLocation( provinces[0].points, provinces[0].node_id, provinces[0].point );
                });
                AMap.event.addListener(markers[1],'click', function (){
                    getLocation( provinces[1].points, provinces[1].node_id, provinces[1].point );
                });
                AMap.event.addListener(markers[2],'click', function (){
                   getLocation( provinces[2].points, provinces[2].node_id, provinces[2].point );
                });
                AMap.event.addListener(markers[3],'click', function (){
                   getLocation( provinces[3].points, provinces[3].node_id, provinces[3].point );
                });
                AMap.event.addListener(markers[4],'click', function (){
                   getLocation( provinces[4].points, provinces[4].node_id, provinces[4].point );
                });
            }).error(function(data,status,headers,config){
                alert('/v1/inner/start-playing error');
            });
        }

        // 打卡成功显示动画
        function showDog() {
            jQuery('.locationDog').show();
             setTimeout(function () {
                 jQuery('.locationDog').hide();
             }, 2000);
        }
        // 获取当前位置的经纬度
        function getLocation(points, nodeid, point){
            var LAT = null; // 经度 小
            var LNG = null; // 纬度 大
            var positionArr = null;
            var positionConfig = {
                /*指示浏览器获取高精度的位置，默认为false*/
                enableHighAccuracy: true,
                /*指定获取地理位置的超时时间，默认不限时，单位为毫秒*/
                timeout: 5000,
                /*最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。*/
                maximumAge: 0
            }
            if( navigator.geolocation ){
                navigator.geolocation.getCurrentPosition(onComplete, onError, positionConfig);
            } else{
                alert('sorry 您的手机不支持GPS定位，请更换手机参与活动');
            }
            //解析定位结果
            function onComplete(position) {
                LAT = position.coords.latitude; // 纬度 小
                LNG = position.coords.longitude; // 经度 大
                // 转为高德坐标系
                var lngLatTotal = LNG.toString()+','+LAT.toString();
                var converts = new AMap.convertFrom(lngLatTotal, 'gps', function(info,result){
                    console.log('转换过后的坐标: '+result.locations);
                    LNG = result.locations[0].lng;
                    LAT = result.locations[0].lat;
                    var _points = points.split(',');
                    positionArr = [
                        { lat: _points[1], lng: _points[0] },
                        { lat: LAT, lng: LNG }
                    ];
                    /**
                     * 计算2点之间的距离
                     */
                    var EARTH_RADIUS = 6378137.0;    //单位M
                    var PI = Math.PI;
                    function getRad(d){
                        return d*PI/180.0;
                    }
                    function getGreatCircleDistance(lat1,lng1,lat2,lng2){
                        var radLat1 = getRad(lat1);
                        var radLat2 = getRad(lat2);
                        var a = radLat1 - radLat2;
                        var b = getRad(lng1) - getRad(lng2);
                        var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
                        s = s*EARTH_RADIUS;
                        s = Math.round(s*10000)/10000.0;
                        return s;
                    }
                    var rice = getGreatCircleDistance( positionArr[0].lat, positionArr[0].lng, positionArr[1].lat, positionArr[1].lng );

                    // 判断用户距离打卡点的距离
                    if(rice > radius){
                        // 打卡失败
                        var text = '打卡失败 您距离打卡点还有'+ rice +'米<br>请到打卡点附近试试^-^';
                        jQuery('#tips').html(text);
                        jQuery('#type3').show();
                        jQuery('#type1-1').hide();
                        jQuery('#type1-2').hide();
                        jQuery('#type2').hide();
                    } else{
                        // 打卡成功
                        var PARAMS = {
                            openid: openid,
                            playing_id: pid,
                            location_name: nodeid
                        };
                        // 打卡接口
                        serverConnect.__get($rootScope.online_exchange + '/wx/user/add-sign', PARAMS).success(function(data){
                            console.log(data);
                            if(data.code == 200){
                                // 第一次打卡成功 随机抽取一个券
                                var lucky_PARAMS = {
                                    openid: openid,
                                    playing_id: pid
                                };
                                serverConnect.__get($rootScope.online_exchange + '/wx/user/is-lucky', lucky_PARAMS).success(function (result) {
                                    if(result.code == 200){
                                        // 给抽奖机会
                                        jQuery('#type1-2').show();
                                        jQuery('#type1-1').hide();
                                        jQuery('#type2').hide();
                                        jQuery('#type3').hide();
                                        showDog();
                                        $scope.gopair = function () {
                                            $state.go('pair', {lucky: 'youareverylucky'}, {reload: true});
                                        };
                                    } else{
                                        // 给优惠券
                                        jQuery('#type1-1').show();
                                        jQuery('#type1-2').hide();
                                        jQuery('#type2').hide();
                                        jQuery('#type3').hide();
                                        showDog();
                                    }
                                }).error(function(data,status,headers,config){
                                    alert('/wx/user/is-lucky error');
                                });
                                var PARAMS2 = {
                                    openid: openid,
                                    playing_id: pid,
                                    serial_id: nodeid,
                                    score: point
                                };
                                serverConnect.__get($rootScope.online_exchange + '/wx/user/playing', PARAMS2).success(function(data_result){
                                    if(data_result.code == 200){
                                        console.log('已积分');
                                    }
                                }).error(function(data,status,headers,config){
                                    alert('/wx/user/playing error');
                                });
                            } else{
                                // 第二次打卡成功 只给优惠券
                                console.log(data.msg);
                                jQuery('#type2').show();
                                jQuery('#type1-1').hide();
                                jQuery('#type1-2').hide();
                                jQuery('#type3').hide();
                            }
                        }).error(function(data,status,headers,config){
                            alert('/wx/user/add-sign error');
                        });
                    }
                    /*计算结束*/
                });

            }
            //解析定位错误信息
            function onError(err) {
                switch(err.code) {
                    case err.TIMEOUT:
                        alert("发生超时！ 请再试一次！");
                        break;
                    case err.POSITION_UNAVAILABLE:
                        alert('我们无法检测您的位置。 抱歉!');
                        break;
                    case err.PERMISSION_DENIED:
                        alert('抱歉！请允许您的设备GPS是打开的，这样才能访问此功能。');
                        break;
                    case err.UNKNOWN_ERROR:
                        alert('出现未知错误！');
                        break;
                }
                setTimeout(function () {
                    window.location.reload();
                }, 300)
            }
        }



        // 微信配置 - 禁止查看链接等
        wx.ready(function () {
            // 禁止菜单按钮
            wx.hideAllNonBaseMenuItem({
                success: function () {
                }
            });
        });
        wx.error(function(res){
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            alert(res.errMsg);
        });
}
