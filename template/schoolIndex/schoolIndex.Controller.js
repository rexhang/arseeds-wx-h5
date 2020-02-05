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
