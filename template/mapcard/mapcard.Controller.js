// 白鹿原打卡活动页面
"use strict";
wxApp
.controller('mapcardController', ['$rootScope', '$scope', 'serverConnect', 'baseSet', 'URL', function($rootScope, $scope, serverConnect, baseSet ,URL){//×¢·½À¨ºÅÄÚµÄ²ÎÊýÒ²Ðè×¢Èë
	return mapcardController($rootScope, $scope, serverConnect, baseSet, URL);
}]);

function mapcardController($rootScope, $scope, serverConnect, baseSet, URL){
      
    clearInterval($rootScope.timer);
    function sc(){
        jQuery('body').scrollLeft(450);
        jQuery('body').scrollTop(600);
    }
    window.setTimeout(sc, 1800);

    $rootScope.set.appLog('mapcardController init');
    $rootScope.bodyclass = 'mapcard';
    $scope.msg = 'mapcard模板';

    var openid = URL.getUrlParams('openid');
    var pid = URL.getUrlParams('pid');

    $scope.close = function(){
        jQuery('.play_alert').hide();
    }
 
    /**
     * radius 打卡允许的范围
     * provinces 5个点信息的装载数组
     */
    var
    radius    = void 0,
    provinces = []
    ;
    // 初始化
    initMapData();
    function initMapData(){
        // 获取点信息
        serverConnect.__get($rootScope.online + '/v1/inner/start-playing', {playing_id: pid}).success(function(data){
            $scope.pageto = function(){
                window.location.href = res.node_list.coupon_config[0].coupon_href;
            }
            var res = data.data;
            var getMapArr = res.node_list.node_config;
            radius = getMapArr[0].location.radius;
            console.log('打卡误差范围'+radius+'米');
            jQuery.each(getMapArr, function(index, item){
                var lat = item.location.lat;
                var lng = item.location.lng;
                provinces.push({name: '点'+(parseInt(index)*1 + 1), points: lng+","+lat, node_id: item.node_id, point: item.point });
            });
            console.log(provinces);
            $scope._provinces = [
                {points: provinces[0].points, node_id: provinces[0].node_id, point: provinces[0].point},
                {points: provinces[1].points, node_id: provinces[1].node_id, point: provinces[1].point},
                {points: provinces[2].points, node_id: provinces[2].node_id, point: provinces[2].point},
                {points: provinces[3].points, node_id: provinces[3].node_id, point: provinces[3].point},
                {points: provinces[4].points, node_id: provinces[4].node_id, point: provinces[4].point}
            ];
            console.log($scope._provinces)

            // 外部测试按钮
            /*$scope.actionDo = function(params){
                var objs = params;
                console.log(objs)
            }*/

            /**
             * 计算2个坐标之间的距离
             */
            var EARTH_RADIUS = 6378137.0;    //单位M
            var PI = Math.PI;
            function getRad(d){
                return d*PI/180.0;
            }
            function getGreatCircleDistance(lat1, lng1, lat2, lng2){
                var radLat1 = getRad(lat1);
                var radLat2 = getRad(lat2);
                var a = radLat1 - radLat2;
                var b = getRad(lng1) - getRad(lng2);
                var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
                s = s*EARTH_RADIUS;
                s = Math.round(s*10000)/10000.0;
                return s;
            }
            // 点击打卡出现京东狗
            function dog(){
                jQuery('.locationDog').css('display','block');
                setTimeout(function(){
                    jQuery('.locationDog').css('display','none');
                }, 2000);
            }
            // 启动微信sdk
            wx.ready(function () {
                // marker按钮点击事件
                $scope.actionDo = function(params){
                    var objs = params; // 传递来的参数
                    wx.getLocation({
                      success: function (res) {
                        var myLat  = res.latitude;              // 微信获取的 lat
                        var myLng  = res.longitude;             // 微信获取的 lng
                        var setLat = objs.points.split(',')[1]; // 该点的 lat
                        var setLng = objs.points.split(',')[0]; // 该点的 lng
                        var rice = getGreatCircleDistance(myLat, myLng, setLat, setLng); // 点之间的距离 单位 米
                        // 判断用户距离打卡点的距离
                        if(rice > radius){ // 如果距离不再范围内
                            console.log('您距离该点'+ rice +'米，打卡失败，请靠近点儿');
                            //alert('您距离该点'+ rice +'米，打卡失败，请靠近点儿');
                            
                            var text = '打卡失败 您距离打卡点还有'+ rice +'米<br>请到打卡点附近试试^-^';
                            jQuery('.fail').html(text);

                            jQuery('#id6').show();
                            jQuery('#id1').show();

                            jQuery('#id2').hide();
                            jQuery('#id3').hide();
                            jQuery('#id4').hide();
                            jQuery('#id5').hide();
                            jQuery('#id7').hide();


                        } else{
                            var PARAMS = {
                                openid: openid,
                                playing_id: pid,
                                location_name: objs.node_id
                            };
                            // 符合距离 进行数据上报
                            serverConnect.__get($rootScope.online_exchange + '/wx/user/add-sign', PARAMS).success(function(data){
                                console.log(data);
                                if(data.code == 200){
                                    dog();

                                    jQuery('#id1').show();
                                    jQuery('#id2').show();
                                    jQuery('#id3').show();
                                    jQuery('#id4').show();
                                    jQuery('#id7').show();

                                    jQuery('#id5').hide();
                                    jQuery('#id6').hide();
                   
                                    // 情形1：第一次打卡，并且成功打卡
                                    serverConnect.__get($rootScope.online_exchange + '/wx/user/playing', {openid: openid, playing_id: pid, serial_id: objs.node_id, score: objs.point }).success(function(data){
                                        console.log(data);
                                        if(data.code == 200){
                                            //alert('已收集');
                                        }
                                    }).error(function(data,status,headers,config){
                                        alert('/wx/user/playing api connect error');
                                    });
                                } else{
                                    // 情形2：已经打过这个点的卡了
                                    jQuery('#id1').show();
                                    jQuery('#id5').show();
                                    jQuery('#id7').show();

                                    jQuery('#id2').hide();
                                    jQuery('#id3').hide();
                                    jQuery('#id4').hide();
                                    jQuery('#id6').hide();
                                }
                            }).error(function(data,status,headers,config){
                                alert('/wx/user/add-sign api connect error');
                            });
                        }
                      },
                      cancel: function (res) {
                        alert('用户拒绝授权获取地理位置');
                      }
                    });
                }

                // 分享到朋友圈参数配置
                var share_config = {
                    title: '京东吃货嘉年华-白鹿原站', // 分享标题
                    desc: '白鹿原AR寻宝，饕餮盛宴，宝藏大奖，京东优惠券，现场吃货券等你来探索！', // 分享描述
                    //link: 'https://interface.arseeds.com/wx_h5/index.html?author=guhang#/whitedeer', // 上线的时候https需要改为https
                    link: location.href.split(':')[0]+'://'+window.location.host +'/wx_h5/index.html?openid='+ openid +'&pid='+ pid +'&nTMf26hc=1#/whitedeer', // 分享链接
                    imgUrl: 'http://static.arseeds.cn/test/HEmN7mXmNx.png',
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function (res) {
                        // 用户确认分享后执行的回调函数
                        // alert('分享成功了诶!内容是：'+_jsonToStr(res));
                    },
                    cancel: function (res) {
                        // 用户取消分享后执行的回调函数
                        // alert('取消分享了诶！'+_jsonToStr(res));
                    }
                };
                //wx.onMenuShareTimeline(share_config);
                console.dir(share_config);
            });
            wx.error(function(res){
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                alert(res.errMsg);
            });
        }).error(function(data,status,headers,config){
            console.log('api connect error');
        });
    }
}