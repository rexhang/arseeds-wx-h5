angular.module('exploreApp')
.controller('jdActivity_huadongController', ['$rootScope', '$scope', 'URL', 'serverConnect', '$interval', '$state', 'h5locals', 'validate', function($rootScope, $scope, URL, serverConnect, $interval, $state, h5locals, validate){
    return jdActivity_huadongController($rootScope, $scope, URL, serverConnect, $interval, $state, h5locals, validate);
}]);

function jdActivity_huadongController($rootScope, $scope, URL, serverConnect, $interval, $state, h5locals, validate){
    $rootScope.appLog('jdActivity_huadongController init');
    $rootScope.bodyclass = 'jdActivity_huadong';

    layer.load(1, {
      shade: [0.5,'#000'] //0.1透明度的白色背景
    });

    $scope.$on('$viewContentLoaded', () => {
        //let baseURL = URL.apiUrl().online_exchange;
        let baseURL  ="https://interface.arseeds.com/zsb";
        let openid = URL.getUrlParams('open_id'); // openid
        let playing_id = URL.getUrlParams('playing_id'); // playing_id


        // 地点寻宝 / 打卡
        $scope.goPunchCard = function(){
            // 点击跳转
            $state.go('mapPunchCard',{}, {reload:true});
        }

        // 构造函数
        class GetPageInfo{
            constructor() {}
            getList(is_openid, is_playing_id) {
                console.log('is_openid'+is_openid);
                console.log('playing_id'+is_playing_id);
                serverConnect.__get(baseURL + '/wx/jdindex/index', {openid: is_openid, playing_id: is_playing_id}).success(function(data){
                    if (data.code == 200) {
                        // 成功获取页面接口信息
                        $scope.clock = data.data.clock; // 地点寻宝目前进度
                        $scope.clock_total = data.data.clock_total; // 地点寻宝总进度
                        $scope.active_list = data.data.active_list;
                        $scope.isrunning = data.data.playlist.playing_status; // 活动是否结束

                        // api add
                        // data.data.is_detail = {
                        //     lucky: 1,
                        //     exchange: 1,
                        //     topArr: [
                        //         {is_get: 1},
                        //         {is_get: 1},
                        //         {is_get: 0},
                        //         {is_get: 1},
                        //         {is_get: 0}
                        //     ]
                        // }
                        // luck 1、2、3 代表[可以抽奖(每日一次)] [已中奖查看兑换码] [未中奖] 这三个状态
                        // exchange 1、2、3、 4 代表[可以兑换] [查看兑换码] [奖券发完] [未打满五个点] 这三个状态

                        $scope.topArr = data.data.is_detail.topArr; // 今日获得
                        $scope.mystatus = data.data.is_detail; // 幸运轮盘 抽奖状态




                        if($scope.active_list.length > 0){
                            // 轮播图效果 - 在接口获取成功后初始化 去别的路由页面记得注销
                            $rootScope.setJdLive = setTimeout(function(){
                               var height = jQuery('#jd_live li').height();
                                 jQuery('#activitybox').height(height * 5.8);
                                 function scroll(){
                                     jQuery("#jd_live").animate({"margin-top":-height+'px'}, function(){
                                       jQuery("#jd_live li:eq(0)").appendTo(jQuery("#jd_live"));
                                       jQuery("#jd_live").css({"margin-top":0})
                                     })
                                 }
                                 $rootScope.setIntervalForJdLive = $interval(scroll, 2000);
                                 // $interval.cancel($rootScope.setIntervalForJdLive); // 取消绑定的定时器
                             }, 100);
                        }
                    } else {
                        layer.msg(data.msg, {
                            time: 800
                        });
                    }
                    layer.closeAll('loading');
                }).error(function(data,status,headers,config){
                    layer.msg(baseURL + '/wx/user/index?openid='+is_openid+'&playing_id='+is_playing_id+' is error!!!', {
                        time: 1100
                    });
                    layer.closeAll('loading');
                });
            }
            exchangeGift(is_openid, is_playing_id){
                serverConnect.__post(baseURL + '/wx/prizefor/exchange-coupon', {openid: is_openid, playing_id: is_playing_id}, {}).success(function(data){
                    if(data.code == 200){
                        layer.msg('兑换成功', {
                            time: 800
                        });
                        $state.reload(); // 刷新当前路由
                    } else{
                        layer.msg(data.msg, {
                            time: 800
                        });
                    }
                    layer.closeAll('loading');
                }).error(function(data,status,headers,config){
                    layer.msg('兑换api连接错误', {
                       time: 600
                   });
                    layer.closeAll('loading');
                });
            }
        }
        let ajaxAction = new GetPageInfo();
        ajaxAction.getList(openid, playing_id);

        // 兑换接口
        $scope.exchangeGift = function(){
            layer.confirm('确定兑换吗?', {
              btn: ['确定','取消'] //按钮
            }, function(){
              ajaxAction.exchangeGift(openid, playing_id);
            }, function(){
            });
        }





        /**
         * 获取微信配置文件接口 | 微信jsSDK配置
         * @return {[type]} [description]
         */
        function wxConfig(){
            jQuery.getJSON('https://api.arseeds.com/wx/jdwx/share?url='+encodeURIComponent(location.href), function(response){
                var data = response.data.sign;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.appId, // 必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature,// 必填，签名，见附录1
                    jsApiList: data.config_list
                });
                wx.ready(function () {
                    // 分享参数配置
                    var shareConfig = {
                        title: '打卡的方式简单点，简单生活音乐节！', // 分享标题
                        desc: '如果打卡失败，那请再靠近些打卡点，换个姿势~', // 分享描述
                        //link: 'https://interface.arseeds.com/wx_h5/index.html?author=guhang#/whitedeer', // 上线的时候https需要改为https
                        link: "https://interface.arseeds.com/h5/jdhd/entry/index/index.html", // 分享链接
                        imgUrl: 'https://illuminate.oss-cn-shanghai.aliyuncs.com/explore/image/huadong.jpg',
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
                    wx.onMenuShareTimeline(shareConfig);
                    // 分享给朋友
                    wx.onMenuShareAppMessage(shareConfig);
                    // 分享到QQ
                    wx.onMenuShareQQ(shareConfig);
                    // 分享到QQ空间
                    wx.onMenuShareQZone(shareConfig);
                });
                wx.error(function(res){
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                    layer.alert(res.errMsg);
                });
            })
        }
        wxConfig();




    })
}
