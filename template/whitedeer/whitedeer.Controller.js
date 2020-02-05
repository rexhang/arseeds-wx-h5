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
