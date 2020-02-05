<?php
header("Content-type: text/html; charset=utf-8"); 
/**
  * wechat php test
  */
//define your token
// define("TOKEN", "my_wx");
// $wechatObj = new wechatCallbackapiTest();
// $wechatObj->valid();
// class wechatCallbackapiTest
// {
// public function valid()
//     {
//         $echoStr = $_GET["echostr"];
//         //valid signature1 , option
//         if($this->checkSignature()){
//         echo $echoStr;
//         exit;
//         }
//     }
//     public function responseMsg()
//     {
// //get post data, May be due to the different environments
// $postStr = $GLOBALS["HTTP_RAW_POST_DATA"];
//       //extract post data
// if (!empty($postStr)){

//               $postObj = simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
//                 $fromUsername = $postObj->FromUserName;
//                 $toUsername = $postObj->ToUserName;
//                 $keyword = trim($postObj->Content);
//                 $time = time();
//                 $textTpl = "<xml>
// <ToUserName><![CDATA[%s]]></ToUserName>
// <FromUserName><![CDATA[%s]]></FromUserName>
// <CreateTime>%s</CreateTime>
// <MsgType><![CDATA[%s]]></MsgType>
// <Content><![CDATA[%s]]></Content>
// <FuncFlag>0</FuncFlag>
// </xml>";
// if(!empty( $keyword ))
//                 {
//               $msgType = "text";
//                 $contentStr = "Welcome to wechat world!";
//                 $resultStr = sprintf($textTpl, $fromUsername, $toUsername, $time, $msgType, $contentStr);
//                 echo $resultStr;
//                 }else{
//                 echo "Input something...";
//                 }
//         }else {
//         echo "";
//         exit;
//         }
//     }
// private function checkSignature()
// {
//         $signature = $_GET["signature"];
//         $timestamp = $_GET["timestamp"];
//         $nonce = $_GET["nonce"];

// $token = TOKEN;
// $tmpArr = array($token, $timestamp, $nonce);
// sort($tmpArr);
// $tmpStr = implode( $tmpArr );
// $tmpStr = sha1( $tmpStr );
// if( $tmpStr == $signature ){
// return true;
// }else{
// return false;
// }
// }
// }
//coding
$time = time();
$appid = "wx493f19f303647cfb";
$nonceStr = createNoncestr();
$token1 = getAccesToekn();
if ($token1 === false) {
    echo "获取token1数据失败，请检查curl操作方法";
    exit();
}
$ticket = getTicketJs($token1);
if ($ticket === false) {
    echo "获取ticket_js数据失败，请检查curl操作方法";
    exit();
}
// $sting=['jsapi_ticket'=>$ticket,'timestamp'=>$time,'noncestr'=>$nonceStr,'url'=>'http://test.rexhang.com/wx/wx_demo.php'];
$sting = 'jsapi_ticket=' . $ticket . '&noncestr=' . $nonceStr . '&timestamp=' . $time . '&url=' . curPageURL();

$signature1 = sha1($sting);

//获取token1
function getAccesToekn()
{
    if (false !== ($token = areadFile('token.txt'))) {
        return $token;
    } else {
        $str = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx493f19f303647cfb&secret=89d145765303889d1a75b78335af7708';
        $output = file_get_contents($str);
        $token = json_decode($output, true);
        if (!empty($token)) {
            awriteFile('token.txt', $token['access_token']);
            return $token['access_token'];
        } else {
            return false;
        }
    }
}

function getTicketJs($token)
{
    if (false !== ($ticket = areadFile('ticket.txt'))) {
        return $ticket;
    } else {
        $str = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=$token&type=jsapi";
        $output = file_get_contents($str);
        $ticket = json_decode($output, true);
        if (0 == $ticket['errcode']) {
            awriteFile('ticket.txt', $ticket['ticket']);
            return $ticket['ticket'];
        } else {
            return false;
        }
    }
}

function createNoncestr($length = 32)
{
    $chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    $str = "";
    for ($i = 0; $i < $length; $i++) {
        $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
    }
    return $str;
    // echo strtoupper($str);
}

/**
 *    作用：格式化参数，签名过程需要使用
 */
function formatBizQueryParaMap($paraMap, $urlencode)
{
    $buff = "";
    ksort($paraMap);
    foreach ($paraMap as $k => $v) {
        if ($urlencode) {
            $v = urlencode($v);
        }
        //$buff .= strtolower($k) . "=" . $v . "&";
        $buff .= $k . "=" . $v . "&";
    }
    $reqPar = '';
    if (strlen($buff) > 0) {
        $reqPar = substr($buff, 0, strlen($buff) - 1);
    }
    return $reqPar;
}

// 说明：获取完整URL
function curPageURL()
{
    $pageURL = 'http';
    $pageURL .= "://";

    if ($_SERVER["SERVER_PORT"] != "80") {
        $pageURL .= $_SERVER["SERVER_NAME"] . ":" . $_SERVER["SERVER_PORT"] . $_SERVER["REQUEST_URI"];
    } else {
        $pageURL .= $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
    }
    return explode('#', $pageURL)[0];
}
function awriteFile($fileName, $string)
{
    $file = fopen($fileName, 'w') or die('打开或者创建文件失败');
    fwrite($file, $string);
    fclose($file);
}

function areadFile($fileName)
{
    $file = fopen($fileName, 'r') or die('读取文件失败');
    $fileString = fread($file, filesize($fileName));
    fclose($file);
    if (empty($fileString) || (time() - filemtime($fileName)) > 7000) {
        return false;
    } else {
        return $fileString;
    }
}

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
    <title>微信公众号开发API测试</title>
    <style type="text/css">
        body{
            -webkit-tap-highlight-color: transparent;
        }
        .disable-selected{
            -moz-user-select:none;/*火狐*/
            -webkit-user-select:none;/*webkit浏览器*/
            -ms-user-select:none;/*IE10*/
            -khtml-user-select:none;/*早期浏览器*/
            user-select:none;
        }
        .power-btn{
            background-color: #ff7300;
            width: 80%;
            margin: 0 auto;
            text-align: center;
            height: 50px;
            line-height: 50px;
            color: #fff;
            border-radius: 6px;
            cursor: pointer;
        }
        .power-btn:active{
            opacity: 0.6;
        }
        .text-center{
            text-align: center;
        }
        .hide{
            display: none;
        }
    </style>
</head>
<body>
    <div class="power-btn disable-selected" id="checkJsApi">1.查看是否支持API</div>
    <br>
    <div class="power-btn disable-selected" id="openLocation">2.打开指定地图地址</div>
    <br>
    <div class="power-btn disable-selected" id="getLocation">3.获得我当前位置的地图信息</div>
    <br>
    <div class="power-btn disable-selected" id="wxShare_pyq">4.分享到朋友圈</div>
    <br>
    <div class="power-btn disable-selected" id="wxSel_img">5.选择图片接口</div>
    <br>
    <div id="img-box" class="text-center hide">
        <span>显示上传的第一张图片</span>
        <hr>
        <img src="" alt="" style="max-width: 100%;">
        <br>
    </div>
    <div class="power-btn disable-selected" id="wxPreview_img">6.图片浏览器</div>
    <br>
    <div class="power-btn disable-selected" id="wxUpload_img">7.上传图片到微信服务器</div>
    <br>
    <div class="power-btn disable-selected" id="wxUpload_img2">7.2从微信服务器把图片取回到自己服务器</div>
    <br>
    <div class="power-btn disable-selected" id="wxDown_img">8.下载图片接口</div>
    <br>
    <div id="downIMG" class="hide">
        <img src="" alt="" style="max-width: 100%;">
        <br>
    </div>
    <div class="power-btn disable-selected" id="getNetworkType">9.获取网络状态</div>
    <br>
    <div class="power-btn disable-selected" id="scan">10.微信扫一扫</div>
    <br>
    <div class="power-btn disable-selected" id="chooseWXPay">★微信支付（需要开通商户）</div>

    <div id="imc">
        
    </div>



    <script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
    <script src="https://cdn.bootcss.com/jquery/1.11.1/jquery.min.js"></script>
    <script type="text/javascript">
        // 对象数据字符串化
        function _jsonToStr(res){
            return window.JSON.stringify(res);
        };
        // ID选择器
        function _selID(id){
            return document.querySelector(id);
        };
        var sting1 = '<?php echo $sting; ?>';
        var ticket = '<?php echo $ticket; ?>';
        var url = '<?php echo curPageURL(); ?>';
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wx493f19f303647cfb', // 必填，公众号的唯一标识
            timestamp:<?php echo $time;?>, // 必填，生成签名的时间戳
            nonceStr: '<?php echo "$nonceStr";?>', // 必填，生成签名的随机串
            signature: '<?php echo "$signature1";?>',// 必填，签名，见附录1
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
        wx.ready(function () {
          // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
          _selID('#checkJsApi').onclick = function () {
            wx.checkJsApi({
              jsApiList: [
                'getNetworkType',
                'previewImage'
              ],
              success: function (res) {
                alert(_jsonToStr(res));
              }
            });
          };
          // 7 地理位置接口
          // 7.1 查看地理位置
          _selID('#openLocation').onclick = function () {
            wx.openLocation({
              latitude: 23.099994,
              longitude: 113.324520,
              name: 'TIT 创意园',
              address: '广州市海珠区新港中路 397 号',
              scale: 14,
              infoUrl: 'http://weixin.qq.com'
            });
          };
          // 7.2 获取当前地理位置
          _selID('#getLocation').onclick = function () {
            wx.getLocation({
              success: function (res) {
                //alert(_jsonToStr(res));
                // 打开当前位置地图信息
                wx.openLocation({
                  latitude: res.latitude,
                  longitude: res.longitude,
                  name: '顾航的家',
                  address: '顾航路11号',
                  scale: 16,
                  infoUrl: 'http://weixin.qq.com'
                });
              },
              cancel: function (res) {
                alert('用户拒绝授权获取地理位置');
              }
            });
          };
          // 10 微信支付接口
          // 10.1 发起一个支付请求
          _selID('#chooseWXPay').onclick = function () {
            // 注意：此 Demo 使用 2.7 版本支付接口实现，建议使用此接口时参考微信支付相关最新文档。
            wx.chooseWXPay({
              timestamp: <?php echo $time;?>,
              nonceStr: '<?php echo "$nonceStr";?>',
              package: 'addition=action_id%3dgaby1234%26limit_pay%3d&bank_type=WX&body=innertest&fee_type=1&input_charset=GBK&notify_url=http%3A%2F%2F120.204.206.246%2Fcgi-bin%2Fmmsupport-bin%2Fnotifypay&out_trade_no=1414723227818375338&partner=1900000109&spbill_create_ip=127.0.0.1&total_fee=1&sign=432B647FE95C7BF73BCD177CEECBEF8D',
              signType: 'SHA1', // 注意：新版支付接口使用 MD5 加密
              paySign: 'bd5b1933cda6e9548862944836a9b52e8c9a2b69'
            });
          };
          // 分享到朋友圈
          _selID('#wxShare_pyq').onclick = function () {
            wx.onMenuShareTimeline({
                title: '微信开发测试', // 分享标题
                desc: '分享的描述信息显示区域', // 分享描述
                link: 'https://rexhang.com/blog', // 分享链接
                imgUrl: 'https://rexhang.com/img/rexhang.png', // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function (res) {
                    // 用户确认分享后执行的回调函数
                    alert('分享成功了诶!内容是：'+_jsonToStr(res));
                },
                cancel: function (res) {
                    // 用户取消分享后执行的回调函数
                    alert('取消分享了诶！'+_jsonToStr(res));
                }
            });
            alert('已注册分享到朋友圈信息');
          };
// 全局变量
var images = {
    localId: [],
    serverId: [],
    preview: []
};
var countCHOOSE = 9;
          _selID('#wxSel_img').onclick = function(){
            wx.chooseImage({
                count: countCHOOSE, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    // alert(resList);
                    var img = '';
                    for(var i = 0;i <localIds.length;i++){
                        img += "<img class='myimg' id='dom"+ [i] +"' width='100' height='50' src='"+ localIds[i] +"' />";
                        images.preview.push(localIds[i]);
                    }
                    $('#imc').append(img);
                    countCHOOSE = countCHOOSE - res.localIds.length;
                    upToWx(localIds);
                    $('#imc .myimg').on('click',function(){
                        var _index = $(this).index();
                        wx.previewImage({
                            current: images.preview[_index], // 当前显示图片的http链接
                            urls: images.preview
                        });
                    })
                }
            });
          };
          
    
          // 串行
          function postData(serverIds){
            $.ajax({
                 type: 'POST',
                 url: './index2.php' ,
                data: {
                    serverId: serverIds,
                    token: '<?php echo "$token1";?>'
                },
                success: function(data, textStatus, jqXHR){
                    alert(textStatus);
                }
            });
          }

            var upToWx = function(locals){
                var local = locals.pop();
                wx.uploadImage({
                    localId: local, // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        images.serverId.push(res.serverId); // 返回图片的服务器端ID
                        //alert('上传微信服务器成功');
                        if (locals.length > 0){
                            upToWx(locals)
                        }
                    }
                });
            }

          _selID("#wxUpload_img2").onclick = function(){
                //alert(images.serverId.join(','));
                postData(images.serverId.join(','));
          };

          _selID("#wxDown_img").onclick = function(){
            wx.downloadImage({
                serverId: images.serverId, // 需要下载的图片的服务器端ID，由uploadImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    alert('图片从服务器下载成功');
                    var localId = res.localId; // 返回图片下载后的本地ID
                    alert(_jsonToStr(res));
                    $("#downIMG").show();
                    $("#downIMG img").attr('src', localId);
                    alert(localId)
                }
            });
          };
          // 获取网络状态
          _selID("#getNetworkType").onclick = function(){
            wx.getNetworkType({
                success: function (res) {
                    var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
                    //alert(networkType);
                    alert(_jsonToStr(res));
                }
            });
          };
          // 扫一扫
          _selID("#scan").onclick = function(){
            wx.scanQRCode({
                needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                alert(_jsonToStr(res));
            }
            });
          };
      });
        wx.error(function(res){
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            alert(res.errMsg);
        });
    </script>
</body>
</html>