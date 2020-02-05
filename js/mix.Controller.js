"use strict";
angular.module('wxApp')
.controller('aboutController', ['$rootScope', '$scope', '$stateParams', function($rootScope, $scope, $stateParams){
    return aboutController($rootScope, $scope, $stateParams);
}]);


function aboutController($rootScope, $scope, $stateParams){
    $rootScope.set.appLog('aboutController init');
	$scope.msg = '关于 => 接收到的参数是: '+$stateParams.id;
    $rootScope.bodyclass = 'about';
    console.log($stateParams);
}
"use strict";
angular.module('wxApp')
.controller('caseController', ['$rootScope', '$scope', '$stateParams', function($rootScope, $scope, $stateParams){
    return caseController($rootScope, $scope, $stateParams);
}]);
function caseController($rootScope, $scope, $stateParams){
    $rootScope.set.appLog('caseController init');
	$scope.msg = '关于 => 接收到的参数是: '+$stateParams.id;
    $rootScope.bodyclass = 'about';
    console.log($stateParams);
}

// 活动排行榜
"use strict";
wxApp
.controller('allImgController', ['$rootScope', '$scope', 'serverConnect', 'baseSet', 'URL', function($rootScope, $scope, serverConnect, baseSet ,URL){//×¢·½À¨ºÅÄÚµÄ²ÎÊýÒ²Ðè×¢Èë
	return allImgController($rootScope, $scope, serverConnect, baseSet, URL);
}]);
function allImgController($rootScope, $scope, serverConnect, baseSet, URL){

	$scope.rank = [{name:'daxin',num:'15'},{name:'daxin',num:'15'},{name:'daxin',num:'15'},{name:'daxin',num:'15'}]



}
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

// 配对控制
"use strict";
wxApp
.controller('pairController', ['$rootScope', '$scope', 'serverConnect', 'baseSet', 'URL', '$state', '$stateParams', function($rootScope, $scope, serverConnect, baseSet ,URL, $state, $stateParams){//×¢·½À¨ºÅÄÚµÄ²ÎÊýÒ²Ðè×¢Èë
	return pairController($rootScope, $scope, serverConnect, baseSet, URL, $state, $stateParams);
}]);
function pairController($rootScope, $scope, serverConnect, baseSet, URL, $state, $stateParams){
    $scope.$on('$viewContentLoaded', function() {
        $scope.p1 = '你还没有获得抽奖配对的机会~';
        $scope.p2 = '缘分提示：抽奖获取电影票，等待和你配对的那个TA~和你配对成功的用户，在影厅会坐在你的旁边哦~';
        // 判断权限
        var is_lucky = $stateParams.lucky;
        if( is_lucky === 'youareverylucky' ){
            console.log('欢迎来抽奖');
            jQuery('#turn').show();
            jQuery('#commonCard').hide();
            jQuery('#our').css('display', 'none');
            $scope.p1 = '已获得抽奖机会~';

        } else{
            console.log('普通人');
        }




    });

	$scope.rank = [{name:'daxin',num:'15'},{name:'daxin',num:'15'},{name:'daxin',num:'15'},{name:'daxin',num:'15'}];

    var openid = URL.getUrlParams('openid');
    var pid = URL.getUrlParams('pid');

 	// 设置阻止手机滑屏滚动
 	function stop(){
        event.preventDefault();
    }

    $scope.my_coupon = '暂无';

    checkMyTickets();
    // type3 显示配对状态
    function checkMyTickets() {
        var lotteryDrawx = {
            playing_id: pid,
            openid: openid
        };
        serverConnect.__get($rootScope.online_exchange + '/wx/user/pair', lotteryDrawx).success(function(data){
            var res = data.data;
            if(data.code == 200){
                if( res.my_coupon ){
                    // 如果当前用户以兑换过则显示
                    $scope.p1 = '等待观影配对ing……';
                    $scope.p2 = '缘分提示：和你配对成功的用户，在影厅中会坐你旁边哦~';
                    // 如果对方存在 文案
                    if( res.other_nick_name != '' ){
                        $scope.p1 = '配对成功';
                        $scope.p2 = '缘分提示：和你配对成功的用户，在影厅中会坐你旁边哦~';
                    }
                    // 别人昵称不为空，如实显示
                    if( res.other_nick_name != '' ){
                        $scope.other_nick_name = res.other_nick_name;
                    } else{
                        $scope.other_nick_name = '等待中';
                    }
                    // 我的昵称不为空，如实显示
                    if( res.my_nick_name != '' ){
                        $scope.my_nick_name = res.my_nick_name;
                    } else{
                        $scope.my_nick_name = '';
                    }
                    // 别人头像不为空，如实显示
                    if( res.other_thumb_photo != '' ){
                        $scope.other_thumb_photo = res.other_thumb_photo;
                    } else{
                        $scope.other_thumb_photo = './img/schoolActivity/moren@2x.png';
                    }
                    // 我的头像不为空，如实显示
                    if( res.my_thumb_photo != '' ){
                        $scope.my_thumb_photo = res.my_thumb_photo;
                    } else{
                        $scope.my_thumb_photo = './img/schoolActivity/moren@2x.png';
                    }
                    $scope.my_coupon = res.my_coupon; // 我的兑换码

                    jQuery('#our').css('display', 'flex');
                    jQuery('#turn').hide();
                    jQuery('#commonCard').hide();
                } else{
                    // 普通用户
                }
            } else{
                //alert('data.code != 200');
            }
        }).error(function(data,status,headers,config){
            alert('/wx/user/pair error');
        });
    }



 	var startNum = 0;
    jQuery('#random').click(function(){
        if( startNum == 0 ){
            startNum++;
            var lotteryDraw = {
                playing_id: pid,
                openid: openid
            };
            // 抽奖接口
            serverConnect.__get($rootScope.online_exchange + '/wx/user/lottery-draw', lotteryDraw).success(function(data){
                if( data.code == 200 ){
                    //console.log('恭喜你，抽中奖品');
                    jQuery('#needle').css('transform', 'rotate(684deg)');
                    setTimeout(function () {
                        jQuery('.popUp').show();
                        // 显示弹窗之后 禁止滑动屏幕
                        document.body.addEventListener('touchmove',stop,false);
                        // 给关闭按钮添加事件
                        jQuery('.know').click(function(){
                            jQuery('.popUp').hide();
                            document.body.removeEventListener('touchmove',stop,false);
                            // 第三种类型：配对样式页面展示
                            // 用户配对信息
                            $state.reload();
                        });
                    }, 1200);
                } else{
                    //console.log('很遗憾，未抽中奖品');
                    jQuery('#needle').css('transform', 'rotate(726deg)');
                    setTimeout(function () {
                        //alert('很遗憾，未抽中奖品');
                        jQuery('#popUpNot').show();
                        document.body.addEventListener('touchmove',stop,false);
                        // 给关闭按钮添加事件
                        jQuery('.know1').click(function(){
                            jQuery('.popUpNot').hide();
                            document.body.removeEventListener('touchmove',stop,false);
                            // 第三种类型：配对样式页面展示
                            // 用户配对信息
                            $state.reload();
                        });
                    }, 1200);
                }
            }).error(function(data,status,headers,config){
                alert('/wx/user/lottery-draw error');
            });





        } else{
            alert('您已经抽过一次奖了');
        }
    });




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

"use strict";
angular.module('wxApp')
.controller('prizeController', ['$rootScope', '$scope', '$stateParams', function($rootScope, $scope, $stateParams){
    return prizeController($rootScope, $scope, $stateParams);
}]);


function prizeController($rootScope, $scope, $stateParams){
    $rootScope.set.appLog('prizeController init');
	$scope.msg = '关于 => 接收到的参数是: '+$stateParams.id;
    $rootScope.bodyclass = 'prize';
    console.log($stateParams);

    clearInterval($rootScope.timer);
}
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

// 校园配对奖品榜
"use strict";
wxApp
.controller('schoolPrizeController', ['$rootScope', '$scope', 'serverConnect', 'baseSet', '$state', 'URL', 'validate', '$timeout','$sce','h5locals',function($rootScope, $scope, serverConnect, baseSet, $state, URL, validate,$timeout,$sce,h5locals){
    return schoolPrizeController($rootScope, $scope, serverConnect, baseSet, $state, URL, validate,$timeout,$sce,h5locals);

}]);
function schoolPrizeController($rootScope, $scope, serverConnect, baseSet, $state, URL, validate,$timeout,$sce,h5locals){

}

// 白鹿原首页模板js方法注入
"use strict";
wxApp

.controller('schoolIndexController', ['$rootScope', '$scope', 'serverConnect', 'baseSet', '$state', 'URL', 'validate', '$timeout','$interval', 'h5locals',function($rootScope, $scope, serverConnect, baseSet, $state, URL, validate,$timeout,$interval,h5locals){
    return schoolIndexController($rootScope, $scope, serverConnect, baseSet, $state, URL, validate,$timeout,$interval,h5locals);

}]);
function schoolIndexController($rootScope, $scope, serverConnect, baseSet, $state, URL, validate,$timeout,$interval,h5locals){

    $scope.$on('$viewContentLoaded', function() {
        $interval.cancel($rootScope.schoolIndexTimer); // 取消绑定的定时器
    });
    $rootScope.set.appLog('schoolIndexController init');
    $rootScope.bodyclass = 'schoolIndex';

    var openid = URL.getUrlParams('openid');
    var pid = URL.getUrlParams('pid');
    // var status = URL.getUrlParams('status'); // 1已经注册 0 未注册
    var is_share = URL.getUrlParams('nTMf26hc'); // 分享标识

    var is_type = URL.getUrlParams('type');
        // 请求接口判断用户是否绑定照见
    serverConnect.__get($rootScope.online_exchange+'/wx/user/exist',{openid:openid}).success(function(res){
      $scope.status = res.data.is_exist
    })
      // 跳转打卡页
     $scope.goPunchiCard = function(){
      console.log($scope.status)
        if( $scope.status == 1 ){
            $state.go('punchCard',{is_reload: 1}, {reload:true});
        } else{
            jQuery('.popUp').show();
            jQuery('#modal').height(jQuery('#modal').width()*1.054)
            // 阻止滑动
            document.body.addEventListener('touchmove', preventDefaultAction, false);
        }
    }
    // 进度的默认变量
    $scope.progress = [
        {start: 0, end: 0},
        {start: 0, end: 0}
    ];
    // joy和排名的默认变量
    $scope.joyNum = 0,
    $scope.ranking = 0;

    // 阻止默认事件
    function preventDefaultAction(){
        event.preventDefault();
    }
    // 关闭电话绑定
    $scope.cardShow = function(){
        jQuery('.popUp').hide();
        // 开启滑动
        document.body.removeEventListener('touchmove', preventDefaultAction, false);
    }
    // 发送验证码按钮
    $scope.send_txt = '发送';
    $scope.send = function(e){
        var _this = e.target;
        var timer = 60;
        if( $scope.send_txt === '发送' ){
            if (validate.phone($scope.phone)) {
               serverConnect.__get($rootScope.online_exchange+'/wx/user/send-code',{'openid':openid,'mobile':$scope.phone}).success(function(res){
               if (res.msg == '此号码已注册') {
                   serverConnect.__get($rootScope.online_exchange+'/wx/user/bind',{'openid':openid,'mobile':$scope.phone}).success(function(res){
                    $state.go('punchCard',{is_reload: 1}, {reload:true});
               })
               } else{
                   timer --;
                   $scope.send_txt = timer;
                   _this.style.color = 'gray';
                   var setNum = $interval(function(){
                       timer--;
                       $scope.send_txt = timer;
                       if(timer < 1){
                           $interval.cancel(setNum);
                           $scope.send_txt = '发送';
                           _this.style.color = '#0e80e8';
                       }
                   }, 1000);
               }
               })
            } else {
               jQuery('.hint').css('opacity','1');
            }
        } else{
            alert('按钮不可用状态');
        }
    }

    // 点击绑定照见
    $scope.ligate = function(){

      if ($scope.num != 'undefined' && validate.phone($scope.phone)) {
        serverConnect.__get($rootScope.online_exchange+'/wx/user/bind',{'openid':openid,'mobile':$scope.phone,'code':$scope.num}).success(function(res){
          console.log(res)
            if (res.code == 200) {
                  $state.go('punchCard',{is_reload: 1}, {reload:true});
            }else{
                jQuery('.hint').css('opacity','1');
            }
        })
      } else {
          jQuery('.hint').css('opacity','1');
      }
    };
    // 点击跳转缘分配对页面
    $scope.luck = function(){
        $state.go('pair',{lucky:'ln'},{reload:true})
    };
    // 点击跳转活动排行榜页面
    $scope.runk = function(){
      if ($scope.status == 1) {
          $state.go('ranking',{},{reload:true})
      } else {
        return false;
      }
    };
    //点击跳转奖品列表页面
    $scope.prizeList = function(){
        $state.go('schoolPrize',{},{reload:true})
    };
    $scope.runs = true;
    //获取活动现场的参数
    serverConnect.__get($rootScope.online_exchange+'/wx/user/playing-locale', {'playing_id':pid}).success(function(data){
        $scope.lists = data.data;
       console.log(data);
       // 添加活动现场轮播图事件
       $rootScope.schoolIndex =  setTimeout(function(){
          var height = jQuery('.activityChild li').height();
            jQuery('.activityChild').height(height * 6);
            function scroll(){
                jQuery(".activityChild ul").animate({"margin-top":-height+'px'},function(){
                  jQuery(".activityChild ul li:eq(0)").appendTo(jQuery(".activityChild ul"));
                  jQuery(".activityChild ul").css({"margin-top":0})
                })
            }
           $rootScope.schoolIndexTimer = $interval(scroll,2000);
        },100);
    }).error(function(data,status,headers,config){
        console.log(data);
    });
    // 获取个人信息
    var nodeID,
    star = [];
    var getList1 = function (){
      // 更改后调用
      serverConnect.__get($rootScope.online+'/v1/inner/start-playing',{"playing_id":pid}).success(function(res){
        $scope.playing = res.data.playing_status;

        if(res.data.playing_status == 'running'){
            $scope.runs = true;
        } else{
            $scope.runs = false;
        }
      nodeID = res.data.node_list.node_config;
      $scope.award_remaining = res.data.award_remaining;
       $scope.length = res.data.node_list.node_config.length;

      // 更改前先调用
        serverConnect.__get($rootScope.online_exchange+'/wx/user/summary-list', {'playing_id':pid,'openid':openid}).success(function(data){
            // $scope.lists = data.data;
            console.log(data)
          // 所有操作在接口返回数据没问题的情况下进行
            if(data.code == 200){
            star = data.data.condtion[0];
            $scope.my = data.data.my;
            $scope.coupon = data.data.coupon;
             $scope.prize = data.data.coupon;
              $scope.number = data.data.condtion
              $scope.count = parseInt(data.data.my.count);
              console.log(data);
               $scope.index = 0;
               if ($scope.number.length > 0) {
                 for (var i = 0; i < $scope.length; i++) {
                     console.log()
                      var bbq = ('star'+res.data.node_list.node_config[i].node_id);
                     if ($scope.number.bbq == 1) {
                             $scope.index++
                     }
                 }
                 var arr = [];
                 jQuery.each(nodeID, function(index, item){
                     var _index = item.node_id;
                     var _im = 'star' + _index;
                     arr.push(star[_im]);
                 })
                 var num = 0;
                 jQuery.each(arr, function(index, item){
                     if(item == 1){
                         num++;
                     }
                 })
                 $scope.index = num;
               } else {
               $scope.index = 0;
               }
            }

           })
        }).error(function(data,status,headers,config){
            console.log(data);
        });
    };
    getList1();

    var urls = '';
    // 分享获取积分
    function getShare() {
        var playingObj = {
            openid: openid,
            playing_id: pid,
            from: 'share'
        };
        if( window.location.host == '60.205.148.16:8080' ){
            // 测试
            urls = 'http://60.205.148.16/wx/index/api?type=xijing&playing_id='+pid;
        } else {
            // 线上
            urls = 'http://api.arseeds.com/wx/index/api?type=xijing&playing_id='+pid;
        }
        if(h5locals.get('shares') != 1){
            serverConnect.__get($rootScope.online_exchange + '/wx/user/playing', playingObj).success(function(){
                console.log('已积分');
                h5locals.set("shares", 1);
                window.location.href = urls;
            }).error(function(data,status,headers,config){
                alert('/wx/user/playing error');
            });
        } else{
            window.location.href = urls;
        }

    }
    if( is_share == 1){
        getShare();
    }



    // 微信配置
    wx.ready(function () {
        // 分享到朋友圈参数配置
        var share_config = {
            title: '打卡赢影票 拯救单身汪', // 分享标题
            desc: '京东520送福利，照见AR打卡，赢取电影票，和幸（ji）福(you)不期而遇。', // 分享描述
            link: location.href.split(':')[0]+'://'+window.location.host +'/wx_h5/index.html?openid='+ openid +'&pid='+ pid +'&nTMf26hc=1#/schoolIndex', // 分享链接
            imgUrl: 'http://static.arseeds.cn/test/yNXNeBPCHH.png',
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
        // 分享到朋友圈
        wx.onMenuShareTimeline(share_config);
        // 分享到朋友
        wx.onMenuShareAppMessage(share_config);
        // 分享到QQ
        wx.onMenuShareQQ(share_config);
        // 分享到QQ空间
        wx.onMenuShareQZone(share_config);



    });
    wx.error(function(res){
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        alert(res.errMsg);
    });
}

"use strict";
angular.module('wxApp')
.controller('shareController', ['$rootScope', '$scope', '$stateParams', function($rootScope, $scope, $stateParams){
    return shareController($rootScope, $scope, $stateParams);
}]);


function shareController($rootScope, $scope, $stateParams){
    $rootScope.set.appLog('shareController init');
    $rootScope.bodyclass = 'share';
    console.log($stateParams);

    clearInterval($rootScope.timer);

}
"use strict";
angular.module('wxApp')
.controller('shopController', ['$rootScope', '$scope', 'intervalAction', function($rootScope, $scope, intervalAction){
    return shopController($rootScope, $scope, intervalAction);
}]);

function shopController($rootScope, $scope, intervalAction){
    $rootScope.set.appLog('shopController init');
    $scope.msg = '商品内容：';
    $rootScope.bodyclass = 'shop';
    // 點擊倒計時按鈕功能DEMO
    $scope.actions = function($event){
        var dom = $event.target;
        if( angular.element(dom).text() === '你好' || angular.element(dom).text() === '點擊重發' ){
            // 執行計時方法
            intervalAction.countDown(dom, 90, '點擊重發', '#000', 100);
        } else{
            console.warn('正在計時中……請勿再次點擊！');
        }
    }

}

"use strict";
angular.module('wxApp')
.controller('tencentController', ['$rootScope', '$scope', '$stateParams', function($rootScope, $scope, $stateParams){
    return tencentController($rootScope, $scope, $stateParams);
}]);


function tencentController($rootScope, $scope, $stateParams){
    $rootScope.set.appLog('tencentController init');
    $rootScope.bodyclass = 'tencent';
    // 微信配置
    wx.ready(function () {
        $scope.getTencentPosition = function(){
            // 获取当前所在地理位置信息
            wx.getLocation({
                success: function (res) {
                    var str = 'lat:'+res.latitude+'=====lng:'+res.longitude;
                    alert(str);
                },
                cancel: function (res) {
                    alert('用户拒绝授权获取地理位置');
                }
            });
        }
    });
    wx.error(function(res){
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        alert(res.errMsg);
    });
}
// 上传图片
"use strict";
wxApp
.controller('uploadController', ['$rootScope', '$scope', 'serverConnect', 'baseSet', 'URL', 'validate', function($rootScope, $scope, serverConnect, baseSet ,URL,validate){//×¢·½À¨ºÅÄÚµÄ²ÎÊýÒ²Ðè×¢Èë
	return uploadController($rootScope, $scope, serverConnect, baseSet, URL, validate);
}]);

function uploadController($rootScope, $scope, serverConnect, baseSet, URL, validate){
    $scope.$on('$viewContentLoaded', function() {
            
    });
    $rootScope.set.appLog('uploadController init');
    $rootScope.bodyclass = 'upload';

    var openid = URL.getUrlParams('openid');
    var pid = URL.getUrlParams('pid');


    // 微信配置
    wx.ready(function () {
        // 全局变量
        var
        selCount = 1,
        localIds = ''
        ;
        // 点击上传
        document.querySelector('#upload').onclick = function(){
            wx.chooseImage({
                count: selCount, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    alert('localIds' +  JSON.stringify(res) ); // 选择图片后的返回信息
                    // selCount = 0; // 不允许再次上传了
                    localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    jQuery('#show').show().attr('src', res.localIds); // 显示图片
                    var imgSrc = jQuery('#show').attr('src');
                    // 添加点击图片预览的功能
                    document.querySelector('#show').onclick = function(){
                        wx.previewImage({
                            current: imgSrc, // 当前显示图片的http链接
                            urls: [imgSrc] // 需要预览的图片http链接列表
                        });
                    }
                }
            });
        };
        // 上传数据接口
        function postData(_serverIds){
            jQuery.ajax({
                type: 'POST',
                url: '',
                data: {
                    media_id: _serverIds,
                    desc: 'hello'
                },
                success: function(data, textStatus, jqXHR){
                    alert(textStatus);
                }
            });
        }
        // 提交内容
        document.querySelector('#post').onclick = function(){
            var textareaVal = jQuery("#textarea-content").val();
            var checktextareaVal = validate.space(textareaVal);
            if( localIds != '' && !checktextareaVal && textareaVal.length > 0 ){
                wx.uploadImage({
                    localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        var serverId = res.serverId; // 返回图片的服务器端ID
                        alert(serverId)
                        //postData(serverId);
                    }
                });
            } else{
                alert('请检查图片和宣言，他们是必填项，宣言不能包含空格');
            }
        }
    });
    wx.error(function(res){
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        alert(res.errMsg);
    });
}
// 白鹿原首页模板js方法注入
"use strict";
wxApp

.controller('whitedeerController', ['$rootScope', '$scope', 'serverConnect', 'baseSet', '$state', 'URL', 'validate', '$timeout','$sce','h5locals',function($rootScope, $scope, serverConnect, baseSet, $state, URL, validate,$timeout,$sce,h5locals){
    return whitedeerController($rootScope, $scope, serverConnect, baseSet, $state, URL, validate,$timeout,$sce,h5locals);

}]);

function whitedeerController($rootScope, $scope, serverConnect, baseSet, $state, URL, validate,$timeout,$sce,h5locals){
    $scope.index = 0;
    $scope.length = 0;

    $rootScope.set.appLog('whitedeerController init');
    $rootScope.bodyclass = 'whitedeer';
    var openid = URL.getUrlParams('openid');
    var status = URL.getUrlParams('status');
    var pid = URL.getUrlParams('pid');
    var type = URL.getUrlParams('type');

    var mockUrl = baseSet.apiSet();
    console.log(validate.phone($scope.phone))
    console.log($rootScope.online)
    var getList = function (){
        serverConnect.__get($rootScope.online_exchange+'/wx/user/playing-locale', {'playing_id':pid}).success(function(data){
            $scope.lists = data.data;
           console.log(data)
           // 添加活动现场轮播图事件
           $timeout(function(){
                var height = jQuery('.ul-live li').height() ;
                jQuery('.Go').height(height * 8);
                var height1 = height +  30;
                function scroll(){
                    jQuery(".container-inner ul").animate({"margin-top":-height1+'px'},function(){
                      jQuery(".container-inner ul li:eq(0)").appendTo(jQuery(".container-inner ul"))
                      jQuery(".container-inner ul").css({"margin-top":0})
                    })
                }
            $rootScope.timer = setInterval(scroll,2000);
            },100)
        }).error(function(data,status,headers,config){
            console.log(data);
        });
    };
    var nodeID,
    star = [];
    // 获取活动现场数据
    getList();
    var getList1 = function (){
        serverConnect.__get($rootScope.online_exchange+'/wx/user/summary-list', {'playing_id':pid,'openid':openid}).success(function(data){
            // $scope.lists = data.data;
            star = data.data.condtion[0];
           $scope.my = data.data.my;
          $scope.prize = data.data.coupon;
           $scope.number = data.data.condtion

           $scope.count = parseInt(data.data.my.count);
           console.log(data);
           serverConnect.__get($rootScope.online+'/v1/inner/start-playing',{"playing_id":pid}).success(function(res){
           nodeID = res.data.node_list.node_config;
           $scope.award_remaining = res.data.award_remaining
            $scope.length = res.data.node_list.node_config.length;
            $scope.index = 0;
            console.log(res)
            console.log($scope.number)

            for (var i = 0; i < $scope.length; i++) {
                console.log()
                 var bbq = ('star'+res.data.node_list.node_config[i].node_id);
                if ($scope.number.bbq == 1) {
                        $scope.index++
                }
            }
            console.warn(star);
            console.warn(nodeID);
            var arr = [];
            jQuery.each(nodeID, function(index, item){
                var _index = item.node_id;
                var _im = 'star' + _index;
                arr.push(star[_im]);
            })
            var num = 0;
            jQuery.each(arr, function(index, item){
                if(item == 1){
                    num++;
                }
            })
            console.log(num)
            $scope.index = num;
           })
        }).error(function(data,status,headers,config){
            console.log(data);
        });
    };

    // 获取个人信息数据
    getList1();
    // 点击实现打卡页面跳转
    // $scope.play_card = function(event){
    // }
    jQuery('.map0').click(function(event){
// 判断用户是否绑定照见
        if (status == 0 ) {
        jQuery('.popUp').css('display','block');
        jQuery('#modal').height(jQuery('#modal').width()*1.054)
        event.preventDefault()
        }else{
            // 点击跳转
            $state.go('mapcard',{}, {reload:true});
        }
    })
    // 点击实现优惠劵兑换问题
    $scope.exchange = function(){
        serverConnect.__get($rootScope.online+'/v1/inner/coupon-exchange', {'playing_id':pid,'openid':openid,score: '20'}).success(function(res){
          //alert(res.msg)
          $state.go("whitedeer",{}, {reload: true});
        })
    }
    // 点击发送验证码
    $scope.send = function(){
     if (validate.phone($scope.phone)) {
        serverConnect.__get($rootScope.online_exchange+'/wx/user/send-code',{'openid':openid,'mobile':$scope.phone}).success(function(res){
        if (res.msg == '此号码已注册') {
            serverConnect.__get($rootScope.online_exchange+'/wx/user/bind',{'openid':openid,'mobile':$scope.phone}).success(function(res){
             $state.go('mapcard',{}, {reload:true});
        })
        }
        })
     } else {
        jQuery('.hint').css('opacity','1');
     }
    }
    // 点击绑定照见
    $scope.ligate = function(){
        serverConnect.__get($rootScope.online_exchange+'/wx/user/bind',{'openid':openid,'mobile':$scope.phone,'code':$scope.num}).success(function(res){
            if (res.code == 200) {
                    $state.go('mapcard',{}, {reload:true});
            }else{
                jQuery('.hint').css('opacity','1');
            }
        })
    }
    // 点击隐藏手机
    $scope.show = function(){
        jQuery('.popUp').css('display','none');
    }

    // 启动微信sdk
    wx.ready(function () {
        // 判断当前版本是否支持指定 JS 接口,支持批量判断,调试用
        /*_selID('#checkJsApi').onclick = function () {
            wx.checkJsApi({
              jsApiList: [
                'onMenuShareTimeline',
                'chooseImage',
                'uploadImage',
                'downloadImage',
                'openLocation',
                'getLocation',
                'scanQRCode'
              ],
              success: function (res) {
                alert(_jsonToStr(res));
              }
            });
        };*/
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
        wx.onMenuShareTimeline(share_config);
        console.dir(share_config);
    });
    wx.error(function(res){
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        alert(res.errMsg);
    });

                // 分享接口判断增加积分
        var is_share = URL.getUrlParams('nTMf26hc');
        if(is_share == 1){
            if (h5locals.getObject(openid) != null){
                h5locals.setObject(openid, '1');
                serverConnect.__get($rootScope.online_exchange + '/wx/user/playing', {openid: openid, playing_id: pid}).success(function(data){
                     }).error(function(data,status,headers,config){
                });
            } else{
                h5locals.set(openid, '1');
            }
        } else{
        }
}
