"use strict";
var DEBUG = false; // 是否本地调试模式 发布上线需要改为false

var POSITION_DATA = void 0; // 本地配置数据
var CUBE_DATA = [];         // 模型对象组
var API_RESULT = void 0;    // 接口数据

/*设备判断*/
var u         = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;                               // Android
var isIos     = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);                                       // Ios
/*if(isAndroid){
    // Android
} else if(isIos){
    // Ios
}*/

/*
    URL中抓取参数的方法
 */
 function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
 }
 var baseUrl;
 var urlData = {
     'm.arseeds.com': {
         'online': 'https://interface.arseeds.com',
         'online_exchange': 'https://api.arseeds.com'
     },
     'interface.arseeds.com': {
         'online': 'https://interface.arseeds.com',
         'online_exchange': 'https://api.arseeds.com'
     },
     'www.arseeds.com': {
         'online': 'https://interface.arseeds.com',
         'online_exchange': 'https://api.arseeds.com'
     },
     '60.205.148.16:8080': {
         'online': 'http://60.205.148.16:8080',
         'online_exchange': 'http://60.205.148.16'
     },
     'localhost:9999': {
         'online': 'http://60.205.148.16:8080',
         'online_exchange': 'http://60.205.148.16'
     },
     '192.168.1.127:9999': {
         'online': 'http://60.205.148.16:8080',
         'online_exchange': 'http://60.205.148.16'
     },
     'rexhang.com': {
         'online': 'http://60.205.148.16:8080',
         'online_exchange': 'http://60.205.148.16'
     }
 }
 var host = window.location.host;
 var nowUrl = urlData[host];
 baseUrl = nowUrl.online_exchange;
 var getOnlineData_URL = baseUrl + '/v1/img-show/get-recognition?key=' + GetQueryString('key');
 if (GetQueryString('key') === null) {
    console.error('key 不能为空');
 }

/**
 * [axios的GET和POST请求及配置信息]
 * @return {[type]} [description]
 * @author {[name]} [rexhang]
 */
/*axios.defaults.baseURL = 'https://rexhang.com/api';*/
axios.defaults.headers.post['Content-Type']    = 'application/x-www-form-urlencoded; charset=UTF-8';
axios.defaults.headers.post['Accept-Language'] = "zh_CN";
axios.defaults.timeout = 6000;
(function () {
    console.warn('接口地址是: ' + getOnlineData_URL);
    function getConfig() {
        return axios.get('./position-dev.json');
    }
    function getOnlineData() {
        if(DEBUG) {
            return axios.get('./ajax.json');
        } else{
            return axios.get(getOnlineData_URL);
        }
    }
    /*并发请求*/
    axios.all([getConfig(), getOnlineData()])
        .then(axios.spread(function (acct, perms) {
            // console.log(acct.data);  // getConfig => data
            // console.log(perms.data.data); // getOnlineData => data
            /*
                =======================================
             */
            POSITION_DATA = acct.data;  // JSON格式的配置数据
            API_RESULT    = perms.data.data; // ajax回调数据

            if (API_RESULT.length > POSITION_DATA.length){
                alert('总数据大于约定值 3 * 6');
            }

            /*判断数据长度*/
            console.table(POSITION_DATA)
            console.table(API_RESULT)

            /**
             * 构建场景模型全局变量
             */
            var
                onDevice     = document.getElementById("onDevice"),
                target       = new THREE.Vector3(),
                mouse        = new THREE.Vector2(),
                raycaster    = new THREE.Raycaster(),
                scene        = void 0,
                camera       = void 0,
                renderer     = void 0,
                stats        = void 0,
                Devices      = void 0,
                touchX       = void 0,
                touchY       = void 0,
                cube         = void 0,
                cube1        = void 0,
                lon          = 270,
                lat          = 0,
                phi          = 0,
                theta        = 0,
                isDeviceing  = 0
            ;
            function initScene(){
                // 新建一个场景
                scene = new THREE.Scene();
            }
            function initCamera(){
                // 远景投影，也称之为透视投影。这个是我们人眼观察世界的模式
                camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 ); // 进行远景投影的相机。
                camera.position.x = 0;
                camera.position.y = 0;
                camera.position.z = 0;
            }
            function initRenderer() {
                // WebGL渲染器使用WebGL来绘制您的场景，如果您的设备支持的话。使用WebGL将能够利用GPU硬件加速从而提高渲染性能。
                // 这个渲染器比 Canvas渲染器(CanvasRenderer) 有更好的性能。
                renderer = new THREE.WebGLRenderer({
                    alpha: true,
                    antialias: true
                }); // 透明
                renderer.setSize(window.innerWidth, window.innerHeight); // 调整输出canvas尺寸（宽度，高度）
                renderer.setClearColor(0xFFFFFF, 0.0); // 设置背景颜色和透明度
                var canvasObject = renderer.domElement; // 获得渲染对象
                document.getElementById('photowall').appendChild(canvasObject); // 将渲染对象添加到页面中
            }
            function initObject(){
                // BoxGeometry是四边形的几何模型类。它通常用于创建具有“宽度”、“高度”和“深度”参数的立方体或不规则四边形模型。
                var sphere   = new THREE.SphereGeometry( 200, 199, 199 );    // 大球体 必须
                //var plane    = new THREE.PlaneGeometry( 0.4, 0.4, 10, 10 );  // 预设的平面

                // 从第0个开始对角度进行赋值
                POSITION_DATA[0].rotate_z  = Math.PI / 10 * Math.random();
                POSITION_DATA[1].rotate_z  = Math.PI / 10 * Math.random();
                POSITION_DATA[2].rotate_z  = Math.PI / 10 * Math.random();

                POSITION_DATA[3].rotate_y  = Math.PI / 2;
                POSITION_DATA[3].rotate_z  = Math.PI / 10 * Math.random();
                POSITION_DATA[4].rotate_y  = Math.PI / 2;
                POSITION_DATA[4].rotate_z  = Math.PI / 10 * Math.random();
                POSITION_DATA[5].rotate_y  = Math.PI / 2;
                POSITION_DATA[5].rotate_z  = Math.PI / 10 * Math.random();

                POSITION_DATA[6].rotate_y  = Math.PI;
                POSITION_DATA[6].rotate_z  = Math.PI / 10 * Math.random();
                POSITION_DATA[7].rotate_y  = Math.PI;
                POSITION_DATA[7].rotate_z  = Math.PI / 10 * Math.random();
                POSITION_DATA[8].rotate_y  = Math.PI;
                POSITION_DATA[8].rotate_z  = Math.PI / 10 * Math.random();

                POSITION_DATA[9].rotate_y  = Math.PI / 2;
                POSITION_DATA[9].rotate_z  = Math.PI / 10 * Math.random();
                POSITION_DATA[10].rotate_y = Math.PI / 2;
                POSITION_DATA[10].rotate_z  = Math.PI / 10 * Math.random();
                POSITION_DATA[11].rotate_y = Math.PI / 2;
                POSITION_DATA[11].rotate_z  = Math.PI / 10 * Math.random();

                POSITION_DATA[12].rotate_x = Math.PI / 2;
                POSITION_DATA[12].rotate_z  = Math.PI / 10 * Math.random();
                POSITION_DATA[13].rotate_x = Math.PI / 2;
                POSITION_DATA[13].rotate_z  = Math.PI / 10 * Math.random();
                POSITION_DATA[14].rotate_x = Math.PI / 2;
                POSITION_DATA[14].rotate_z  = Math.PI / 10 * Math.random();

                POSITION_DATA[15].rotate_x = Math.PI / 2;
                POSITION_DATA[16].rotate_x = Math.PI / 2;
                POSITION_DATA[17].rotate_x = Math.PI / 2;

                POSITION_DATA[15].rotate_z = Math.PI;
                POSITION_DATA[16].rotate_z = Math.PI;
                POSITION_DATA[17].rotate_z = Math.PI;

                /*根据数据构建多个模型*/
                $.each(API_RESULT, function (index, item) {
                    var MapConfig = {
                        side: THREE.DoubleSide,
                        map: THREE.ImageUtils.loadTexture(item.background),
                        transparent: true
                    };
                    CUBE_DATA[index] = new THREE.Mesh(
                        new THREE.PlaneGeometry( POSITION_DATA[index].w, POSITION_DATA[index].h, POSITION_DATA[index].w_number, POSITION_DATA[index].h_number ), new THREE.MeshBasicMaterial( MapConfig )
                    );
                    CUBE_DATA[index].name       = POSITION_DATA[index].name;     // 名字
                    CUBE_DATA[index].position.x = POSITION_DATA[index].x;        // x坐标
                    CUBE_DATA[index].position.y = POSITION_DATA[index].y;        // y坐标
                    CUBE_DATA[index].position.z = POSITION_DATA[index].z;        // z坐标
                    CUBE_DATA[index].scale.x    = POSITION_DATA[index].scale_x;  // 宽度缩放倍数
                    CUBE_DATA[index].scale.y    = POSITION_DATA[index].scale_y;  // 高度缩放倍数
                    CUBE_DATA[index].rotation.x = POSITION_DATA[index].rotate_x; // 旋转角度x
                    CUBE_DATA[index].rotation.y = POSITION_DATA[index].rotate_y; // 旋转角度y
                    CUBE_DATA[index].rotation.z = POSITION_DATA[index].rotate_z; // 旋转角度z
                });

                /*一个以简单着色（平面或线框）方式来绘制几何形状的材料。
                 默认将呈现为平面多边形。要把网孔绘制为线框，只需设置“线框（wireframe）”属性设置为true。*/
                var material_configBG = {
                    color: 0xffffff,
                    wireframe: false,
                    map: new THREE.ImageUtils.loadTexture("assets/qiu.jpg"),
                    opacity: 0.0,
                    transparent: true,
                    side: THREE.DoubleSide
                };
                var material_configPlane = {
                    color: '#ff7300',
                    wireframe: false,
                    map: THREE.ImageUtils.loadTexture('./assets/1.jpg'),
                    side: THREE.DoubleSide
                };
                var material2   = new THREE.MeshBasicMaterial( material_configBG ); // 大球体材料配置
                var material4   = new THREE.MeshBasicMaterial( material_configPlane ); // 平面材料配置
                cube            = new THREE.Mesh( sphere, material2 );             // 大球体
                //cube1           = new THREE.Mesh( plane, material4 );              // 平面
                // 平面位置信息
                //cube1.position.x = -0.25;
                //cube1.position.y = -0.6;
                //cube1.position.z = -1.8;
                //cube1.scale.x    = 1.5;
                //cube1.scale.y    = 0.65;
            }
            function initFpsStats(){
                stats = new Stats();
                stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
                document.body.appendChild( stats.domElement );
                stats.domElement.style.cssText = "position: absolute;bottom: 0;left: 0;";
            }
            function initDevices() {
                Devices = new THREE.DeviceOrientationControls(camera);
            }
            function render(){
                requestAnimationFrame(render);
                /*stats.begin();*/
                renderer.clear();
                // 物体做旋转运动
                //CUBE_DATA[0].rotation.z += 0.001;

                /*lon = Math.max(-720, Math.min(720, lon)); // 限制固定角度内旋转
                 lon += 0.1; //自动旋转*/
                lat      = Math.max(-85, Math.min(85, lat));
                phi      = THREE.Math.degToRad(90 - lat);
                theta    = THREE.Math.degToRad(lon);
                target.x = Math.sin( phi ) * Math.cos( theta );
                target.y = Math.cos( phi );
                target.z = Math.sin( phi ) * Math.sin( theta );
                camera.lookAt(target);
                camera.updateProjectionMatrix();
                if(isDeviceing !== 0) Devices.update();
                renderer.render(scene, camera); // 使用相机渲染一个场景。
                /*stats.end();*/
            }
            function init(){
                // 注册监听事件
                document.addEventListener('mousedown', onDocumentMouseDown, false);
                document.addEventListener('click', onDocumentClick, false);
                document.addEventListener('touchstart', onDocumentTouchStart, false);
                document.addEventListener('touchmove', onDocumentTouchMove, false);
                document.addEventListener('mousewheel', onDocumentMouseWheel, false);
                window.addEventListener('resize', onWindowResize, false);
                if (DEBUG) {
                    onDevice.style.display = 'block';
                    onDevice.addEventListener("touchstart", controlDevice, false);
                } else {
                    isDeviceing = 1; // 开启陀螺仪状态
                }

                /*按钮来控制陀螺仪的开关*/
                function controlDevice(event) {
                    if (isDeviceing === 0) {
                        isDeviceing = 1;
                        onDevice.value = "关闭陀螺仪";
                    } else {
                        isDeviceing = 0;
                        onDevice.value = "开启陀螺仪";
                    }
                }
                function onWindowResize(){
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize( window.innerWidth, window.innerHeight );
                    initCamera();
                    //initControls();
                    initDevices();
                }
                function onDocumentMouseDown(event){
                    event.preventDefault();
                    document.addEventListener('mousemove', onDocumentMouseMove, false);
                    document.addEventListener('mouseup', onDocumentMouseUp, false);
                }
                function onDocumentClick(event){
                    /*点击物体的事件*/
                    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
                    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
                    raycaster.setFromCamera( mouse, camera );
                    /*var intersects  = raycaster.intersectObject( cube );
                    var intersects3 = raycaster.intersectObject( cube3 );
                    if ( intersects.length > 0 ) {
                        // 点击立方体时，将立方体变为指定色
                        cube.material.color.setHex(0xff0000);
                    } else {
                        // 如果没有点击到，则将立方体变回白色
                        cube.material.color.setHex(0xffffff);
                    }
                    if ( intersects3.length > 0 ) {
                        cube3.material.color.setHex(0xff7300);
                    } else {
                        cube3.material.color.setHex(0xffffff);
                    }*/
                }
                function onDocumentTouchStart(event) {
                    event.preventDefault();
                    var touch = event.touches[0];
                    touchX = touch.screenX;
                    touchY = touch.screenY;
                    /*点击物体的事件*/
                    mouse.x = ( event.touches[0].pageX / renderer.domElement.clientWidth ) * 2 - 1;
                    mouse.y = - ( event.touches[0].pageY / renderer.domElement.clientHeight ) * 2 + 1;
                    raycaster.setFromCamera( mouse, camera );

                    // 批量的点击事件 && 给客户端发送字符串
                    for(var i = 0; i < CUBE_DATA.length; i++){
                        var intersects = raycaster.intersectObject( CUBE_DATA[i] );
                        if ( intersects.length > 0 ) {
                            switch( API_RESULT[i].source_type ){
                                case 'video':
                                    if (isAndroid){
                                        window.android.showres(i);
                                    } else if(isIos){
                                        window.location.href = 'arseek://arseeds.com/transmit?index=' + i;
                                    }
                                    break;
                                case 'image':
                                    var keys = GetQueryString('key');
                                    window.location.href = nowUrl.online + '/angular/index.html?linktype=h5&index='+ i +'&key='+ keys +'#/Image';
                                    break;
                                case 'url':
                                    window.location.href = API_RESULT[i].source_path[0];
                                    break;
                            }
                        }
                    }

                    /*var intersects = raycaster.intersectObject( cube );  // cube   点击
                    var intersects3 = raycaster.intersectObject( cube3 ); // cube3 点击
                    var intersects4 = raycaster.intersectObject( cube4 ); // cube4 点击
                    var intersects5 = raycaster.intersectObject( cube5 ); // cube4 点击
                    var intersects6 = raycaster.intersectObject( cube6 ); // cube4 点击
                    var intersects7 = raycaster.intersectObject( cube7 ); // cube4 点击
                    var intersects8 = raycaster.intersectObject( cube8 ); // cube4 点击
                    if ( intersects.length > 0 ) alert('点击了正方体');
                    if ( intersects3.length > 0 ) alert('点击了球形');
                    if ( intersects4.length > 0 ) {alert('点击了图片填充色图形, 点完会消失'); intersects4[0].object.visible = false; }
                    if ( intersects5.length > 0 ) alert('点击了橙色图形');
                    if ( intersects6.length > 0 ) alert('点击了红粉色图形');
                    if ( intersects7.length > 0 ) alert('点击了蓝色图形');
                    if ( intersects8.length > 0 ) {window.location.href = "https://www.baidu.com/"};*/

                }
                function onDocumentTouchMove(event) {
                    event.preventDefault();
                    var touch = event.touches[0];
                    lon -= (touch.screenX - touchX) * 0.1;
                    lat += (touch.screenY - touchY) * 0.1;
                    touchX = touch.screenX;
                    touchY = touch.screenY;
                }
                function onDocumentMouseMove(event) {
                    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
                    lon -= movementX * 0.1;
                    lat += movementY * 0.1;
                }
                function onDocumentMouseUp(event) {
                    document.removeEventListener('mousemove', onDocumentMouseMove);
                    document.removeEventListener('mouseup', onDocumentMouseUp);
                }
                function onDocumentMouseWheel(event) {
                    camera.fov -= event.wheelDeltaY * 0.01;
                    camera.updateProjectionMatrix();
                }
                initScene();       // 初始化场景
                initCamera();      // 初始化相机
                initRenderer();    // 初始化渲染器
                initObject();      // 初始化物体对象
                //initFpsStats();    // 初始化FPS监视器
                initDevices();     // 初始化手持设备控制器
                Devices.connect(); // 初始化绑定陀螺仪
                render();          // 渲染
                // 为场景中添加物体对象
                // 默认情况下，当我们调用 scene.add() 时，对象将被添加到原点处，即坐标点(0,0,0)
                scene.add( cube );
                //scene.add( cube1 );
                $.each(CUBE_DATA, function (index) {
                    scene.add( CUBE_DATA[index] );
                });
            }
            init();
        }))
        .catch(function (error) {
            console.error( 'error：' + JSON.stringify( error ) );
            alert('api connect error');
        });
})();


