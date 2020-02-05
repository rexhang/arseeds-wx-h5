jQuery(function(){
    var hosts = location.href.split('#')[0];
    console.log(hosts);
    var API = 'https://rexhang.com/wx/wx/api.php?url=' + encodeURIComponent( hosts );
    jQuery.getJSON(API, function(res){
        if(res.appid){
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
                ]
            });

            wx.ready(function(){
                // 1、分享配置
                shareConfig = {
                    title:   '闲暇之余,做了一期ES6技术分享 | 内容摘自【顾航前端】', // 分享标题
                    desc:    '顾航(Rexhang)全身心致力于Web前端编程以及java编程技术的研究包括javascript脚本，Jquery，Bootstrap等前端框架的研究，并不断完善自我争取更促进互联网与现实世界的更和谐并到更贴近的交互体验！', // 分享描述
                    link:    'http://www.rexhang.com/blog/2017/06/14/ecma6/', // 分享链接
                    imgUrl:  'http://www.rexhang.com/blog/wp-content/uploads/2017/05/d009b3de9c82d15834a6cbdd890a19d8bc3e42b2-220x150.png', // 分享图标
                    type:    '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function (res) {
                        alert('分享成功了诶!内容是：'+_jsonToStr(res));
                    },
                    cancel: function (res) {
                        alert('取消分享了诶！'+_jsonToStr(res));
                    }
                }
                // 分享到到朋友圈
                wx.onMenuShareTimeline( shareConfig );
                // 分享到到微信朋友
                wx.onMenuShareAppMessage( shareConfig );
                // 分享到到QQ
                wx.onMenuShareQQ( shareConfig );
                // 分享到到QQ空间
                wx.onMenuShareQZone( shareConfig );

                // 扫一扫
                jQuery("#scan").click(function(){
                    wx.scanQRCode({
                        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                        success: function (res) {
                            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                            alert(_jsonToStr(res));
                        }
                    })
                })
            })

            wx.error(function(res){
                alert(res.errMsg);
            })
        } else{
            console.error('接口错误');
        }
    })
})