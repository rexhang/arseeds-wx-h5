jQuery(function(){

    // 设备运动事件监听
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', deviceMotionHandler, false);
    } else{
        alert('您的手机不支持摇签');
    }
    // 获取加速度信息
    // 通过监听上一步获取到的x, y, z 值在一定时间范围内的变化率，进行设备是否有进行晃动的判断。
    // 而为了防止正常移动的误判，需要给该变化率设置一个合适的临界值。
    var SHAKE_THRESHOLD = 11000;
    var last_update = 0;
    var x, y, z, last_x = 0, last_y = 0, last_z = 0;
    function deviceMotionHandler(eventData) {
        var acceleration =eventData.accelerationIncludingGravity;
        var curTime = new Date().getTime();
        if ((curTime - last_update) > 10) {
            var diffTime = curTime - last_update;
            last_update = curTime;
            x = acceleration.x;
            y = acceleration.y;
            z = acceleration.z;
            var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
            if (speed > SHAKE_THRESHOLD) {
                window.removeEventListener('devicemotion', deviceMotionHandler, false);
                jQuery('#modal').show(); // 显示模态框
                jQuery('#sign').show(); // 显示签筒
                jQuery('#halo').show(); // 显示光环
                set3Show(); // 三秒后显示随机的签子
            }
            last_x = x;
            last_y = y;
            last_z = z;
        }
    }
    // 3秒后显示签
    function set3Show(){
        var timer = 2000;
        setTimeout(function(){
            var INDEX = parseInt( 4 * Math.random() ); // 生成0-3之间（包括0和3）的随机数
            jQuery('#sign').hide(); // 隐藏签筒
            jQuery('.random').eq(INDEX).show().addClass('showScale'); // 显示随机的签字
            jQuery('#flower').show(); // 显示彩带
            jQuery('#relieve').show(); // 显示按钮
            jQuery('#relieve').on('click', function(){
                jQuery('.random').eq(INDEX).hide(); // 关闭 签子
                jQuery('#relieve, #flower, #halo').hide(); // 关闭 按钮、光环、彩带
                jQuery('#adv, #guide').show(); // 显示更多信息
                var _index;
                if(INDEX === 0){
                    var selList = jQuery(".card[data-index='0']");
                    _index = parseInt( 5 * Math.random() );  // 生成0-4之间的随机数
                    selList.eq(_index).show();
                }
                if(INDEX === 1){
                    var selList = jQuery(".card[data-index='1']");
                    _index = parseInt( 3 * Math.random() );  // 生成0-2之间的随机数
                    selList.eq(_index).show();
                }
                if(INDEX === 2){
                    var selList = jQuery(".card[data-index='2']");
                    _index = parseInt( 4 * Math.random() );  // 生成0-3之间的随机数
                    selList.eq(_index).show();
                }
                if(INDEX === 3){
                    var selList = jQuery(".card[data-index='3']");
                    _index = parseInt( 5 * Math.random() );  // 生成0-4之间的随机数
                    selList.eq(_index).show();
                }
                jQuery('#showLucky').show();
                // 点击晒好运按钮
                jQuery('#showLucky').on('click', function(){
                    jQuery('#modal').css('z-index', 999);  // 使得模态框位居最上层
                    jQuery('#share').show(); // 显示分享提示
                    //jQuery('#showLucky').hide(); // 晒好运按钮，如果取消注释则只显示一次分享提示
                    jQuery('#modal').on('click', function(){
                        jQuery('#modal').css('z-index', 10);
                        jQuery('#share').hide(); // 显示分享提示
                    })
                })
            })
        }, timer)
    }
})