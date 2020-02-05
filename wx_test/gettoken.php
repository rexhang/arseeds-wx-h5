<?php
 header("Content-type: text/html; charset=utf-8"); 


 // 请求token信息
function getAcToken(){
    $token_str = 'http://60.205.148.16/wx/user/get-wx';
    $output = file_get_contents($token_str);
    $token = json_decode($output, true);
    return $token['data']['access_token'];
}

echo getAcToken();



  ?>