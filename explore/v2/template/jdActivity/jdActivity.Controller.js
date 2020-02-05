angular.module('exploreApp')
.controller('jdActivityController', ['$rootScope', '$scope', 'URL', 'serverConnect', '$interval', '$state', 'h5locals', 'validate', function($rootScope, $scope, URL, serverConnect, $interval, $state, h5locals, validate){
    return jdActivityController($rootScope, $scope, URL, serverConnect, $interval, $state, h5locals, validate);
}]);

function jdActivityController($rootScope, $scope, URL, serverConnect, $interval, $state, h5locals, validate){
    $rootScope.appLog('jdActivityController init');
    $rootScope.bodyclass = 'jdActivity';

    layer.load(1, {
      shade: [0.5,'#000'] //0.1透明度的白色背景
    });

    $scope.$on('$viewContentLoaded', () => {
        let baseURL = URL.apiUrl().online_exchange;

        let openid = URL.getUrlParams('open_id'); // openid
        let status = URL.getUrlParams('status'); // 状态
        let playing_id = URL.getUrlParams('playing_id'); // playing_id
        let type = URL.getUrlParams('type');
        let is_share = URL.getUrlParams('share'); // 分享标识

        $scope.showBind = false; // 默认关闭手机绑定框
        // 地点寻宝 / 打卡
        $scope.goPunchCard = function(){
            // 点击跳转
            $state.go('mapPunchCard',{}, {reload:true});
        }

        // 绑定手机
        var timer = 60;
        // 发送验证码按钮
        $scope.send = function(){
            if( jQuery('#send-code').text() != '重发' && jQuery('#send-code').text() != '发送' ){
                return false;
            } else{
                // 发送验证码
                if( validate.phone($scope.phone) ) {
                    serverConnect.__get(baseURL + '/wx/user/send-code', {'openid': openid, 'mobile': $scope.phone}).success(function(res){
                        if(res.msg == '此号码已注册') {
                            serverConnect.__get(baseURL + '/wx/user/bind',{'openid': openid, 'mobile': $scope.phone}).success(function(res){
                                var newUrl = URL.delUrlParams(window.location.href, 'status');
                                window.location.href = newUrl;
                            })
                        }
                    });
                    var times = setInterval(function(){
                        if( timer < 0 ){
                            timer = 60;
                            clearInterval(times)
                            jQuery('#send-code').text('重发');
                        } else{
                            jQuery('#send-code').text(timer);
                            timer--;
                        }
                    }, 100)
                } else{
                    jQuery('.hint').css('opacity','1');
                }
            }
        }

        // 绑定
        $scope.binds = function(){
            serverConnect.__get(baseURL + '/wx/user/bind',{'openid': openid, 'mobile': $scope.phone,'code': $scope.num}).success(function(res){
                if (res.code == 200) {
                    var newUrl = URL.delUrlParams(window.location.href, 'status');
                    window.location.href = newUrl;
                }else{
                    jQuery('.hint').css('opacity','1');
                }
            })
        }

        // 是否分享页面
        if( is_share == 'share'){
            console.log('from share');
            getShare();
            layer.closeAll('loading');
        } else if(status == 0){
            $scope.showBind = true;
            layer.closeAll('loading');
        } else{
            class GetPageInfo{
                constructor() {}
                getList(is_openid, is_playing_id) {
                    console.log('is_openid'+is_openid);
                    console.log('playing_id'+is_playing_id);
                    serverConnect.__get(baseURL + '/wx/user/index', {openid: is_openid, playing_id: is_playing_id}).success(function(data){
                        if (data.code == 200) {
                            // 成功获取页面接口信息
                            $scope.count = data.data.my.count;
                            $scope.clock = data.data.clock;
                            $scope.clock_total = data.data.clock_total;
                            $scope.active_list = data.data.active_list;
                            $scope.coupon = data.data.coupon.state;
                            $scope.isrunning = data.data.playlist.playing_status;

                            if( data.data.gift.state == 1 ){
                                $scope.showCode = true; // 显示兑换状态
                                $scope.codeId = data.data.gift.coupon_id;
                            }

                            if( data.data.coupon.state == 1 ){
                                // 代表中奖 会有兑换码 data.data.coupon.coupon_id
                                $scope.status1 = true;
                                $scope.status_code = data.data.coupon.coupon_id;
                            } else if( data.data.coupon.state == 0 ){
                                // 可以点击进行抽奖
                                $scope.status0 = true;
                            } else{
                                // 今天抽过一次了
                                $scope.status2 = true;
                            }

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
                    serverConnect.__post(baseURL + '/wx/prize/exchange-coupon', {openid: is_openid, playing_id: is_playing_id}, {}).success(function(data){
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
                layer.confirm('确定花费20个JOY兑换吗?', {
                  btn: ['确定','取消'] //按钮
                }, function(){
                  ajaxAction.exchangeGift(openid, playing_id);
                }, function(){
                });
            }
        }

        // 分享获取积分
        function getShare() {
            // var playingObj = {
            //     openid: openid,
            //     playing_id: playing_id,
            //     from: 'share'
            // };
            if( window.location.host == '60.205.148.16:8080' ){
                // 测试
                var urls = 'http://60.205.148.16/wx/index/api?type=changyinji&playing_id='+playing_id + '&share_id=' + openid;
                window.location.href = urls;
            } else {
                // 线上
                var urls = 'https://api.arseeds.com/wx/index/api?type=changyinji&playing_id='+playing_id + '&share_id=' + openid;
                window.location.href = urls;
            }


            // alert(urls) // 授权页面 === 授权页面会自动跳转这次活动的主页
            // if(h5locals.get('shares') != 1){
            //     serverConnect.__get(baseURL + '/wx/user/playing', playingObj).success(function(data){
            //         if(data.code == 200){
            //             layer.msg('已积分', {
            //                 time: 600
            //             });
            //             h5locals.set("shares", 1);
            //             setTimeout(function(){
            //                 window.location.href = urls;
            //             }, 300);
            //         } else{
            //             layer.msg(data.msg, {
            //                time: 600
            //            });
            //         }
            //     }).error(function(data,status,headers,config){
            //         layer.msg('分享 接口 错误', {
            //            time: 600
            //        });
            //     });
            // } else{
            //     window.location.href = urls;
            // }
        }


        // 请求微信JS-SDK配置信息
        jQuery.getJSON('./api/api.php?url='+encodeURIComponent(location.href.split('#')[0])+'&base_url='+baseURL, function(data){
            if(data.code == 200){
                var res = data;
                /*成功之后配置微信*/
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: res.appid, // 必填，公众号的唯一标识
                    timestamp: res.timestamp, // 必填，生成签名的时间戳
                    nonceStr: res.nonceStr, // 必填，生成签名的随机串
                    signature: res.signature,// 必填，签名，见附录1
                    jsApiList: [
                            'checkJsApi',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'onMenuShareQZone',
                            'hideMenuItems',
                            'showMenuItems',
                            'hideAllNonBaseMenuItem',
                            'showAllNonBaseMenuItem',
                            'translateVoice',
                            'startRecord',
                            'stopRecord',
                            'onVoiceRecordEnd',
                            'playVoice',
                            'onVoicePlayEnd',
                            'pauseVoice',
                            'stopVoice',
                            'uploadVoice',
                            'downloadVoice',
                            'chooseImage',
                            'previewImage',
                            'uploadImage',
                            'downloadImage',
                            'getNetworkType',
                            'openLocation',
                            'getLocation',
                            'hideOptionMenu',
                            'showOptionMenu',
                            'closeWindow',
                            'scanQRCode',
                            'chooseWXPay',
                            'openProductSpecificView',
                            'addCard',
                            'chooseCard',
                            'openCard'
                          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            } else{
                alert('wxAPI接口错误!');
            }
        });
        wx.ready(function () {
            // alert('wx config ok');
            // 判断当前版本是否支持指定 JS 接口,支持批量判断,调试用
            // 分享到朋友圈参数配置
            var shareConfig = {
                title: '京东西北畅饮季', // 分享标题
                desc: '你的好友给你分享了京东西北畅饮季的精彩活动', // 分享描述
                //link: 'https://interface.arseeds.com/wx_h5/index.html?author=guhang#/whitedeer', // 上线的时候https需要改为https
                link: location.href.split(':')[0]+'://'+window.location.host +'/wx_h5/explore/index.html?open_id='+ openid +'&playing_id='+ playing_id +'&nTMf26hc=1&share=share&author=guhang#/jdActivity', // 分享链接
                imgUrl: 'http://arseeds-static.oss-cn-shanghai.aliyuncs.com/media/picture/20170711094223.jpg',
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
            // 分享到到朋友圈
            wx.onMenuShareTimeline( shareConfig );
            // 分享到到微信朋友
            wx.onMenuShareAppMessage( shareConfig );
            // 分享到到QQ
            wx.onMenuShareQQ( shareConfig );
            // 分享到到QQ空间
            wx.onMenuShareQZone( shareConfig );
        });
        wx.error(function(res){
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            alert(res.errMsg);
        });

    })

}
