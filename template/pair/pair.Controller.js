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
