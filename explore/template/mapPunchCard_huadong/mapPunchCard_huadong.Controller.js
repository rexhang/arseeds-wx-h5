angular.module('exploreApp')
.controller('mapPunchCard_huadongController', ['$rootScope', '$scope', 'URL', 'serverConnect', '$interval', '$state', function($rootScope, $scope, URL, serverConnect, $interval, $state){
    return mapPunchCard_huadongController($rootScope, $scope, URL, serverConnect, $interval, $state);
}]);

function mapPunchCard_huadongController($rootScope, $scope, URL, serverConnect, $interval, $state){
    $rootScope.appLog('mapPunchCard_huadongController init');
    $rootScope.bodyclass = 'mapPunchCard_huadong';

    // layer.load(1, {
    //   shade: [0.5,'#000'] //0.1透明度的白色背景
    // });
    $interval.cancel($rootScope.setIntervalForJdLive); // 取消绑定的定时器

    $scope.$on('$viewContentLoaded', () => {
       // let baseURL = URL.apiUrl().online_exchange;
       // zsb 修改
        let baseURL  ="https://interface.arseeds.com/zsb";
        let is_playing_id = URL.getUrlParams('playing_id');
        let openid = URL.getUrlParams('open_id'); // openid
        class Card{
            constructor() {}
            getCardMaps(){
                serverConnect.__get(baseURL + '/wx/jdindex/sign-point', {playing_id: is_playing_id, openid: openid }).success(function(data){
                    if (data.code == 200) {
                        // data.data.data.node_list.sign_list.forEach(function(item, index){
                        //     // if(item.is_sign == 1){
                        //     //     // 打开
                        //     //     item.icon = './img/jd/yidaka-@2x.png'
                        //     // } else{
                        //     //     item.icon = './img/jd/weidaka@2x.png';
                        //     // }
                        // });
                        $scope.list = data.data.data.node_list.sign_list;
                    } else {
                        layer.msg(data.msg, {
                            time: 800
                        });
                    }
                    layer.closeAll('loading');
                }).error(function(data,status,headers,config){
                    layer.msg('拉取列表错误', {
                        time: 800
                    });
                    layer.closeAll('loading');
                });
            }
        }
        let index = new Card();
        index.getCardMaps(); // 拉取列表信息
        // 全局变量
        $scope.dakashibai = false;
        $scope.dakachenggong = false;
        $scope.dakachenggongFunction = function(){
            $scope.dakachenggong = !$scope.dakachenggong;
            $state.reload();
        }
        $scope.getLocations = function(is_lng, is_lat, is_node_id, is_point, is_radius, is_sign, is_coupon_href){
            console.log(is_lng, is_lat, is_node_id, is_point, is_radius, is_sign, is_coupon_href)
            layer.load(1, {
              shade: [0.5,'#000'] //0.1透明度的白色背景
            });
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

            function onComplete(data){
                LAT = data.coords.latitude; // 纬度 小
                LNG = data.coords.longitude; // 经度 大
                // 转为高德坐标系
                var lngLatTotal = LNG.toString()+','+LAT.toString();
                var converts = new AMap.convertFrom(lngLatTotal, 'gps', function(info, result){
                    LNG = result.locations[0].lng;
                    LAT = result.locations[0].lat;
                    positionArr = [
                        { lat: is_lat, lng: is_lng },
                        { lat: LAT, lng: LNG }
                    ];
                    // alert(JSON.stringify(positionArr[0]));
                    // alert(JSON.stringify(positionArr[1]));
                    // 获取两个坐标之间的距离
                    // var getRice = new sys.getGreatCircleDistance({
                    //     lat1: positionArr[0].lat,
                    //     lat2: positionArr[0].lng,
                    //     lng1: positionArr[1].lat,
                    //     lng2: positionArr[1].lng
                    // });
                    // var rice = getRice.calc();

                    /**
                     * 计算2点之间的距离
                     */
                    // var EARTH_RADIUS = 6378137.0;    //单位M
                    // var PI = Math.PI;
                    // function getRad(d){
                    //     return d*PI/180.0;
                    // }
                    // function getGreatCircleDistance(lat1,lng1,lat2,lng2){
                    //     var radLat1 = getRad(lat1);
                    //     var radLat2 = getRad(lat2);
                    //     var a = radLat1 - radLat2;
                    //     var b = getRad(lng1) - getRad(lng2);
                    //     var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
                    //     s = s*EARTH_RADIUS;
                    //     s = Math.round(s*10000)/10000.0;
                    //     return s;
                    // }
                    // var rice = getGreatCircleDistance( positionArr[0].lat, positionArr[0].lng, positionArr[1].lat, positionArr[1].lng );

                    /*高德地图API计算2点之间的距离*/
                    var lnglat = new AMap.LngLat(positionArr[0].lng, positionArr[0].lat);
                    var rice = lnglat.distance([positionArr[1].lng, positionArr[1].lat]);

                    if(parseInt(rice) > parseInt(is_radius)){
                        // 弹窗部分
                        // 打卡失败
                        // layer.msg(`您现在距离打卡点的距离是${parseInt(rice)}米,请靠近点儿再试试吧~`, {
                        //     time: 1200
                        // });
                        $scope.dakashibai = true; // 显示打卡失败
                        layer.closeAll('loading');
                        $scope.$apply();
                    } else{
                        // alert('打卡成功');
                        if( is_sign == 1 ){
                            // 多次打卡
                            layer.closeAll('loading');
                            layer.msg('该点已打过卡');
                        } else{
                            var getJson = {
                                openid: openid,
                                playing_id: is_playing_id,
                                location_name: is_node_id
                            }
                            // 打卡接口
                            serverConnect.__get(baseURL + '/wx/jdindex/add-sign', getJson).success(function(data){
                                if( data.code == 200 ){
                                    $scope.dakachenggong = true;
                                    $scope.sucIcon = data.data.icon;
                                    $scope.icon_name = data.data.icon_name;
                                } else{
                                    alert(data.msg)
                                }
                                layer.closeAll('loading');
                            }).error(function(data,status,headers,config){
                                layer.msg('用户打卡接口 连接错误', {
                                    time: 600
                                });
                                layer.closeAll('loading');
                            });
                        }
                    }
                })
            }
            //解析定位错误信息
            function onError(err) {
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
        }
    })
}
