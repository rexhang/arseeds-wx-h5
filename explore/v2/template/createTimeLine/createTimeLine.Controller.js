angular.module('exploreApp')
.controller('createTimeLineController', ['$rootScope', '$scope', 'URL', 'serverConnect', '$interval', '$state', function($rootScope, $scope, URL, serverConnect, $interval, $state){
    return createTimeLineController($rootScope, $scope, URL, serverConnect, $interval, $state);
}]);

function createTimeLineController($rootScope, $scope, URL, serverConnect, $interval, $state){
    $rootScope.appLog('createTimeLineController init');
    $rootScope.bodyclass = 'createTimeLine';

    $scope.$on('$viewContentLoaded', () => {
        let baseURL = URL.apiUrl().online_exchange;

        let open_id = URL.getUrlParams('open_id');
        let playing_id = URL.getUrlParams('playing_id');

        // 获取当前时间
        $scope.datetime = Date.parse(new Date());

        $scope.isuploadBtn = true; // 显示上传按钮
        $scope.isuploadPreview = false; // 不显示图片预览框

        // 上传文件部分
        // ajax上传
        let postImg = (URL, DATA) => {
            jQuery.ajax({
                url: URL,
                type: 'post',
                dataType: 'json',
                data: DATA,
                async: true,
                cache: false,
                contentType: false,
                processData: false,
                success: function(data) {
                    if(data.code == 200){
                        layer.msg('上传成功', {
                            time: 1000
                        });
                        $scope.isuploadBtn = false; // 隐藏上传按钮
                        $scope.isuploadPreview = true; // 显示图片预览框
                        $scope.myfileUrl = data.data.file_url;
                        $scope.$apply();
                    } else{
                        layer.msg(data.msg, {
                            time: 1000
                        });
                    }
                    layer.closeAll('loading');
                },
                error: function(err) {
                    layer.msg('api连接错误');
                    layer.closeAll('loading');
                }
            });
        }

        jQuery('#timeFile').change(() => {
            let fileUploadUrl = baseURL + '/explore/img-show/upload';
            let fileData = document.getElementById('timeFile');
            let fileinfo = fileData.files[0];
            let fd = new FormData();
            fd.append('file', fileinfo);
            fd.append('type', 'image');
            let URL = baseURL + '/explore/img-show/upload'
            let DATA = fd;
            let fileSIZE = fileinfo.size /  1024 / 1024;
            let fileTYPE = fileinfo.type.split('/');
            if( fileSIZE > 2 ){
                layer.msg('请上传小于2M的图片', {
                    time: 1000
                });
            } else{
                if(fileTYPE[0] != 'image'){
                    layer.msg('非法文件类型!!建议上传jpg或png等格式的图片', {
                        time: 1000
                    });
                } else{
                    layer.load(1, {
                        shade: [0.5, '#000'] //0.1透明度的白色背景
                    });
                    postImg(URL, DATA); // 上传
                }
            }
        });

        /*高德地图获取当前地点*/
        var mapObj,
        geolocation,
        jdu,
        wdu
        ;
        mapObj = new AMap.Map('containerCreate');
        mapObj.plugin('AMap.Geolocation', function () {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: false,        //显示定位按钮，默认：true
                buttonPosition: 'RT',    //定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
                showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
                useNative: true,          // 是否使用安卓定位sdk用来进行定位，默认：false
                GeoLocationFirst: true,   // 默认为false，设置为true的时候可以调整PC端为优先使用浏览器定位，失败后使用IP定位
                zoomToAccuracy: false      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });
            mapObj.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
            AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
        });
        function onComplete(data){
            jdu = data.position.getLng(); // 经度 大
            wdu = data.position.getLat(); // 纬度 小
            // alert(`jdu${jdu}`);
            // alert(`wdu${wdu}`);
            jQuery.getJSON(`https://restapi.amap.com/v3/geocode/regeo?key=53cfa77aca5e30a58fc8615b7f58b84a&location=${jdu},${wdu}&radius=1000`, function(data){
                if(data.info == 'OK'){
                    jQuery('#AmapPutaddress').text(data.regeocode.formatted_address);
                }
            });
        }
        function onError(){
            layer.msg('地点获取失败，请开启定位权限后重试！', {
                time: 1200
            });
        }

        // 保存按钮发送数据
        $scope.save = function(){
            var postData = {
                open_id: open_id,
                content: $scope.content,
                url: $scope.myfileUrl,
                lng: jdu,
                lat: wdu
            };
            serverConnect.__post(baseURL + '/wx/timeline/create', postData, {}).success(function(data){
                if(data.code == 200){
                    layer.msg('发布成功', {
                        time: 800
                    });
                    $state.go('jdActivity',{}, {reload:true});
                } else{
                    layer.msg(data.msg, {
                        time: 800
                    });
                }
                layer.closeAll('loading');
            }).error(function(data,status,headers,config){
                layer.msg('api连接错误', {
                    time: 600
                });
                layer.closeAll('loading');
            });
        }
    })
}
