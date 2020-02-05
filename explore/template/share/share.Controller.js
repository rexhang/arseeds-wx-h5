angular.module('exploreApp')
.controller('shareController', ['$rootScope', '$scope', 'URL', 'serverConnect', '$sce', function($rootScope, $scope, URL, serverConnect, $sce){
    return shareController($rootScope, $scope, URL, serverConnect, $sce);
}]);

function shareController($rootScope, $scope, URL, serverConnect, $sce){
    $rootScope.appLog('shareController init');
    $rootScope.bodyclass = 'share';

    layer.load(1); // 读取用户资料 开启动画

    let baseURL = URL.apiUrl().online_exchange;
    let is_id = URL.getUrlParams('id'); // 获取id
    let is_openid = URL.getUrlParams('openid'); // 获取openid
    /*is_id = 87;
    is_openid = 'o0obL1E62_afYTUvNEx3jNB1EuL0';*/


    // 获取该页信息
    serverConnect.__get(baseURL + '/explore/img-show/share', {id: is_id, openid: is_openid}).success(function(data){
        if(data.code == 200){
            $scope.is_type = data.data.result[0].type;
            $scope.user = {
                nick_name: data.data.result[0].nick_name,
                thumb_photo: data.data.result[0].thumb_photo
            }
            $scope.recognition_img = data.data.result[0].recognition_img;
            if( $scope.is_type == 'mix' ){
                $scope.resource = $sce.trustAsHtml( data.data.result[0].result );
                $scope.audioResource = data.data.result[0].result_description.audio; // 获取音频地址
                jQuery('#audio2').attr('src', $scope.audioResource);
                let AudioDom = document.getElementById('audio2'); // audio dom
                var is_play = false; // 是否播放的全局变量
                // 当可以播放的时候点击触发按钮的事件
                AudioDom.oncanplay = function(){
                    jQuery('#audioImage2').click(function(){
                        if(is_play){
                            // 开始播放了
                            jQuery('#audio2')[0].pause();
                            is_play = false;
                            jQuery('#audioImage2').attr('src', './img/tuwenyin/openVoice.png');
                        } else{
                            // 点击开始播放
                            jQuery('#audio2')[0].play();
                            is_play = true;
                            jQuery('#audioImage2').attr('src', './img/tuwenyin/closeVoice.png');
                        }
                    })
                }
            } else{
                $scope.file_name = data.data.result[0].result_description.result_extend_title;
                jQuery('#share_video').attr('src', data.data.result[0].trans_video);
                jQuery('#share_video').attr('poster', data.data.result[0].result_description.result_extend_cover);
            }


        } else{
            layer.msg(data.msg, {
                time: 1000
            });
        }
        layer.closeAll('loading');
    }).error(function(data,status,headers,config){
        layer.msg('api连接错误');
        layer.closeAll('loading');
    });
}
