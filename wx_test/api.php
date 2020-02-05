<?php
header("Content-type: text/html; charset=utf-8"); 

// 获取前端传来的url
$URL = $_GET['url'];
$BASE_URL = @$_GET['base_url'];
if(!$BASE_URL){
    $BASE_URL = "http://60.205.148.16";
}

 // 请求token信息
function getAcToken($BASE_URL){
    $token_str = $BASE_URL."/wx/user/get-wx";
    $output = file_get_contents($token_str);
    $token = json_decode($output, true);
    return array(
        "access_token"=> $token['data']['access_token'],
        "app_id"=> $token['data']['app_id']
    );
}
if(!getAcToken($BASE_URL)){
    exit('token接口错误');
};
$getAcTokenRES = getAcToken($BASE_URL);

$tokken = $getAcTokenRES['access_token']; // 得到token

$time = time();

$appid = $getAcTokenRES['app_id'];

$nonceStr = createNoncestr();
// 创建随机字符串
function createNoncestr($length = 32){
    $chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    $str = "";
    for ($i = 0; $i < $length; $i++) {
        $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
    }
    return $str;
}

$ticket = getTicketJs($tokken);
//获取ticket
function getTicketJs($tokken)
{
    $str = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=$tokken&type=jsapi";
    $output = file_get_contents($str);
    $ticket = json_decode($output, true);
    return $ticket['ticket'];
}

$sting = 'jsapi_ticket=' . $ticket . '&noncestr=' . $nonceStr . '&timestamp=' . $time . '&url=' . $URL;

$signature1 = sha1($sting);

if($time && $nonceStr && $signature1){
    $arr = array
      (
       'code'=> '200',
       'timestamp'=> $time,
       'nonceStr'=> $nonceStr,
       'appid'=> $appid,
       "signature"=> $signature1
      );
      $jsonencode = json_encode($arr);
      echo $jsonencode;
      exit();
  } else{
    $arr = array
      (
       'code'=> '400',
       'timestamp'=> $time,
       'nonceStr'=> $nonceStr,
       'appid'=> $appid,
       "signature"=> $signature1
      );
      $jsonencode = json_encode($arr);
      echo $jsonencode;
      exit();
  }

?>

