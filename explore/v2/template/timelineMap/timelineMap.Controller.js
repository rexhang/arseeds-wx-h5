angular.module('exploreApp')
.controller('timelineMapController', ['$rootScope', '$scope', 'URL', 'serverConnect', '$interval', '$state', function($rootScope, $scope, URL, serverConnect, $interval, $state){
    return timelineMapController($rootScope, $scope, URL, serverConnect, $interval, $state);
}]);

function timelineMapController($rootScope, $scope, URL, serverConnect, $interval, $state){
    $rootScope.appLog('timelineMapController init');
    $rootScope.bodyclass = 'timelineMap';
    layer.load(1, {
      shade: [0.5,'#000'] //0.1透明度的白色背景
    });
    $interval.cancel($rootScope.setIntervalForJdLive); // 取消绑定的定时器

    $scope.$on('$viewContentLoaded', () => {
        let baseURL = URL.apiUrl().online_exchange;

        let open_id = URL.getUrlParams('open_id');

        // 地图容器height
        jQuery('#containerTimeline').css('height', sys.webAllHeight);

        var geolocation;
        var map = new AMap.Map('containerTimeline', {
                resizeEnable: true,
                zoom: 12,
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
            alert("对不起，需要浏览器支持HTML5！");
        }
        // 获取点坐标
        var mapObj,
        geolocation,
        jdu,
        wdu
        ;
        // map.plugin('AMap.Geolocation', function () {
        //     geolocation = new AMap.Geolocation({
        //         enableHighAccuracy: true,//是否使用高精度定位，默认:true
        //         timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        //         maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        //         convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        //         showButton: true,        //显示定位按钮，默认：true
        //         buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
        //         buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        //         showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
        //         showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
        //         panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
        //         useNative: true,          // 是否使用安卓定位sdk用来进行定位，默认：false
        //         GeoLocationFirst: true,   // 默认为false，设置为true的时候可以调整PC端为优先使用浏览器定位，失败后使用IP定位
        //         zoomToAccuracy: false      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        //     });
        //     map.addControl(geolocation);
        //     geolocation.getCurrentPosition();
        //     AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        //     AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
        // });

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
            layer.closeAll('loading');
        }


        // 关闭模态框
        $scope.close = function(){
            jQuery('#timelineModal').hide();
        }
        // 创建点
        var
        markers    = [],
        provinces = [],
        getUserInfo = [],
        LAT_ = null,
        LNG_ = null
        ;


        // 获取点用户详情
        function getUserInfoFunction(id){
            /*alert(id);
            alert(getUserInfo[id].source_list.source_type)
            alert(getUserInfo[id].source_list.source_path[0])*/
            jQuery('#timelineModal').show().find('.card').addClass('animated zoomIn');
            setTimeout(function(){
                jQuery('#timelineModal').removeClass('animated fadeIn');
            }, 500);


            var trueImage = '';
            if(getUserInfo[id].source_list.source_type == 'image' ){
                trueImage = getUserInfo[id].source_list.source_path[0]
            } else{
                trueImage = '';
            }

            jQuery('#userUploadImg').attr('src', trueImage);

            $scope.user = {
                nick_name: getUserInfo[id].nick_name,
                create_time: getUserInfo[id].create_time,
                thumb_photo: getUserInfo[id].thumb_photo,
                content: getUserInfo[id].content,
            }
            $scope.$apply();
        };


        function onComplete(data){
            //alert('gpsdata')





            LAT_ = data.coords.latitude; // 纬度 小
            LNG_ = data.coords.longitude; // 经度 大

            // 转为高德坐标系
            var lngLatTotal = LNG_.toString()+','+LAT_.toString();

            var converts = new AMap.convertFrom(lngLatTotal, 'gps', function(info, result){
                LNG_ = result.locations[0].lng;
                LAT_ = result.locations[0].lat;
                jdu = LNG_; // 经度 大
                wdu = LAT_; // 纬度 小
                var get_data = {
                    open_id: open_id,
                    lng: jdu,
                    lat: wdu
                };
                // alert('lat'+LAT_);
                // alert('lng'+LNG_);
                serverConnect.__get(baseURL + '/wx/timeline/get', get_data).success(function(data){
                    if(data.code == 200){
                        //alert( JSON.stringify(data) )
                        var getMapArr = data.data.result; // 最长五条
                        getUserInfo = getMapArr;
                        jQuery.each(getMapArr, function(index, item){
                            var lat = item.location_lat;
                            var lng = item.location_lng;
                            provinces.push( {name: item.nick_name, points: lng + "," + lat, thumb_photo: item.thumb_photo} );
                        })
                        // 循环添加点到地图
                        for (var i = 0; i < provinces.length; i ++) {
                            var marker;
                                marker = new AMap.Marker({
                                    position: provinces[i].points.split(','),
                                    icon : new AMap.Icon({
                                        image: provinces[i].thumb_photo,
                                        //image: 'https://rexhang.com/img/rexhang.png',
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
                        for(var i = 0; i < markers.length; i++){
                            (function(is_indexs){
                                AMap.event.addListener(markers[is_indexs],'click', function (){
                                    getUserInfoFunction(is_indexs)
                                });
                            })(i)
                        }

                    } else{
                        layer.msg(data.msg, {
                            time: 800
                        });
                    }
                    layer.closeAll('loading');
                }).error(function(data,status,headers,config){
                    layer.msg('api连接错误', {
                       time: 600
                   });
                    layer.closeAll('loading');
                });
            })
        }
        function onError(){
            layer.closeAll('loading');
            switch(err.code) {
                case err.TIMEOUT:
                    layer.msg('发生超时！ 请再试一次！', {
                        time: 900
                    });
                    setTimeout(function(){
                        sys.reload()
                    }, 200);
                    break;
                case err.POSITION_UNAVAILABLE:
                    layer.msg('我们无法检测您的位置。抱歉！请重试', {
                        time: 900
                    });
                    setTimeout(function(){
                        sys.reload()
                    }, 200);
                    break;
                case err.PERMISSION_DENIED:
                    layer.msg('抱歉！请允许您的设备GPS是打开的，这样才能访问此功能。', {
                        time: 900
                    });
                    setTimeout(function(){
                        sys.reload()
                    }, 200);
                    break;
                case err.UNKNOWN_ERROR:
                    layer.msg('未知错误！请及时上报', {
                        time: 900
                    });
                    setTimeout(function(){
                        sys.reload()
                    }, 200);
                    break;
            }
        }





    })
}
