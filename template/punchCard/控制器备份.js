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
                $scope.pageto = function(){
                    window.location.href = data.data.node_list.coupon_config[0].coupon_href;
                };
                console.warn(data);
                var res = data.data;
                var getMapArr = res.node_list.node_config;
                radius = getMapArr[0].location.radius; // 获取打卡半径的阀值
                console.log('打卡误差范围'+radius+'米');
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
                AMap.event.addListener(markers[0],'touchend', function (){
                    getLocation( provinces[0].points, provinces[0].node_id, provinces[0].point );
                });
                AMap.event.addListener(markers[1],'touchend', function (){
                    getLocation( provinces[1].points, provinces[1].node_id, provinces[1].point );
                });
                AMap.event.addListener(markers[2],'touchend', function (){
                   getLocation( provinces[2].points, provinces[2].node_id, provinces[2].point );
                });
                AMap.event.addListener(markers[3],'touchend', function (){
                   getLocation( provinces[3].points, provinces[3].node_id, provinces[3].point );
                });
                AMap.event.addListener(markers[4],'touchend', function (){
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
            map.plugin('AMap.Geolocation', function() {
                geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                    convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: true,        //显示定位按钮，默认：true
                    buttonPosition: 'RT',    //定位按钮停靠位置，默认：'LB'，左下角
                    buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
                    useNative: true,          // 是否使用安卓定位sdk用来进行定位，默认：false
                    GeoLocationFirst: true,   // 默认为false，设置为true的时候可以调整PC端为优先使用浏览器定位，失败后使用IP定位
                    zoomToAccuracy: false      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                });
                map.addControl(geolocation);
                geolocation.getCurrentPosition();
                AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
                AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
            });
            //解析定位结果
            function onComplete(data) {
                //alert('定位成功')
                var jdu = data.position.getLng(); // 经度 大
                var wdu = data.position.getLat(); // 纬度 小
                var _points = points.split(',');
                var positionArr = [
                    { lat: _points[1], lng: _points[0] },
                    { lat: wdu, lng: jdu }
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
                rice = rice - 460;
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
            }
            //解析定位错误信息
            function onError(data) {
                alert('定位失败, 请检查您的网络是否畅通。');
                $window.location.reload();
            }
        }
}
