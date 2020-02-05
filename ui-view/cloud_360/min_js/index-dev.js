"use strict";function GetQueryString(e){var t=new RegExp("(^|&)"+e+"=([^&]*)(&|$)"),n=window.location.search.substr(1).match(t);return null!=n?unescape(n[2]):null}var DEBUG=!1,POSITION_DATA=void 0,CUBE_DATA=[],API_RESULT=void 0,u=navigator.userAgent,isAndroid=u.indexOf("Android")>-1||u.indexOf("Adr")>-1,isIos=!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),baseUrl,urlData={"m.arseeds.com":{online:"https://interface.arseeds.com",online_exchange:"https://api.arseeds.com"},"interface.arseeds.com":{online:"https://interface.arseeds.com",online_exchange:"https://api.arseeds.com"},"www.arseeds.com":{online:"https://interface.arseeds.com",online_exchange:"https://api.arseeds.com"},"60.205.148.16:8080":{online:"http://60.205.148.16:8080",online_exchange:"http://60.205.148.16"},"localhost:9999":{online:"http://60.205.148.16:8080",online_exchange:"http://60.205.148.16"},"192.168.1.127:9999":{online:"http://60.205.148.16:8080",online_exchange:"http://60.205.148.16"},"rexhang.com":{online:"http://60.205.148.16:8080",online_exchange:"http://60.205.148.16"}},host=window.location.host,nowUrl=urlData[host];baseUrl=nowUrl.online_exchange;var getOnlineData_URL=baseUrl+"/v1/img-show/get-recognition?key="+GetQueryString("key");null===GetQueryString("key")&&console.error("key 不能为空"),axios.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded; charset=UTF-8",axios.defaults.headers.post["Accept-Language"]="zh_CN",axios.defaults.timeout=6e3,function(){console.warn("接口地址是: "+getOnlineData_URL),axios.all([function(){return axios.get("./position-dev.json")}(),function(){return DEBUG?axios.get("./ajax.json"):axios.get(getOnlineData_URL)}()]).then(axios.spread(function(e,t){function n(){c=new THREE.Scene}function a(){h=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,.1,1e3),h.position.x=0,h.position.y=0,h.position.z=0}function o(){_=new THREE.WebGLRenderer({alpha:!0,antialias:!0}),_.setSize(window.innerWidth,window.innerHeight),_.setClearColor(16777215,0);var e=_.domElement;document.getElementById("photowall").appendChild(e)}function r(){var e=new THREE.SphereGeometry(200,199,199);POSITION_DATA[0].rotate_z=Math.PI/10*Math.random(),POSITION_DATA[1].rotate_z=Math.PI/10*Math.random(),POSITION_DATA[2].rotate_z=Math.PI/10*Math.random(),POSITION_DATA[3].rotate_y=Math.PI/2,POSITION_DATA[3].rotate_z=Math.PI/10*Math.random(),POSITION_DATA[4].rotate_y=Math.PI/2,POSITION_DATA[4].rotate_z=Math.PI/10*Math.random(),POSITION_DATA[5].rotate_y=Math.PI/2,POSITION_DATA[5].rotate_z=Math.PI/10*Math.random(),POSITION_DATA[6].rotate_y=Math.PI,POSITION_DATA[6].rotate_z=Math.PI/10*Math.random(),POSITION_DATA[7].rotate_y=Math.PI,POSITION_DATA[7].rotate_z=Math.PI/10*Math.random(),POSITION_DATA[8].rotate_y=Math.PI,POSITION_DATA[8].rotate_z=Math.PI/10*Math.random(),POSITION_DATA[9].rotate_y=Math.PI/2,POSITION_DATA[9].rotate_z=Math.PI/10*Math.random(),POSITION_DATA[10].rotate_y=Math.PI/2,POSITION_DATA[10].rotate_z=Math.PI/10*Math.random(),POSITION_DATA[11].rotate_y=Math.PI/2,POSITION_DATA[11].rotate_z=Math.PI/10*Math.random(),POSITION_DATA[12].rotate_x=Math.PI/2,POSITION_DATA[12].rotate_z=Math.PI/10*Math.random(),POSITION_DATA[13].rotate_x=Math.PI/2,POSITION_DATA[13].rotate_z=Math.PI/10*Math.random(),POSITION_DATA[14].rotate_x=Math.PI/2,POSITION_DATA[14].rotate_z=Math.PI/10*Math.random(),POSITION_DATA[15].rotate_x=Math.PI/2,POSITION_DATA[16].rotate_x=Math.PI/2,POSITION_DATA[17].rotate_x=Math.PI/2,POSITION_DATA[15].rotate_z=Math.PI,POSITION_DATA[16].rotate_z=Math.PI,POSITION_DATA[17].rotate_z=Math.PI,$.each(API_RESULT,function(e,t){var n={side:THREE.DoubleSide,map:THREE.ImageUtils.loadTexture(t.background),transparent:!0};CUBE_DATA[e]=new THREE.Mesh(new THREE.PlaneGeometry(POSITION_DATA[e].w,POSITION_DATA[e].h,POSITION_DATA[e].w_number,POSITION_DATA[e].h_number),new THREE.MeshBasicMaterial(n)),CUBE_DATA[e].name=POSITION_DATA[e].name,CUBE_DATA[e].position.x=POSITION_DATA[e].x,CUBE_DATA[e].position.y=POSITION_DATA[e].y,CUBE_DATA[e].position.z=POSITION_DATA[e].z,CUBE_DATA[e].scale.x=POSITION_DATA[e].scale_x,CUBE_DATA[e].scale.y=POSITION_DATA[e].scale_y,CUBE_DATA[e].rotation.x=POSITION_DATA[e].rotate_x,CUBE_DATA[e].rotation.y=POSITION_DATA[e].rotate_y,CUBE_DATA[e].rotation.z=POSITION_DATA[e].rotate_z});var t={color:16777215,wireframe:!1,map:new THREE.ImageUtils.loadTexture("assets/qiu.jpg"),opacity:0,transparent:!0,side:THREE.DoubleSide},n={color:"#ff7300",wireframe:!1,map:THREE.ImageUtils.loadTexture("./assets/1.jpg"),side:THREE.DoubleSide},a=new THREE.MeshBasicMaterial(t);new THREE.MeshBasicMaterial(n);u=new THREE.Mesh(e,a)}function i(){l=new THREE.DeviceOrientationControls(h)}function s(){requestAnimationFrame(s),_.clear(),E=Math.max(-85,Math.min(85,E)),D=THREE.Math.degToRad(90-E),M=THREE.Math.degToRad(P),I.x=Math.sin(D)*Math.cos(M),I.y=Math.cos(D),I.z=Math.sin(D)*Math.sin(M),h.lookAt(I),h.updateProjectionMatrix(),0!==S&&l.update(),_.render(c,h)}POSITION_DATA=e.data,API_RESULT=t.data.data,API_RESULT.length>POSITION_DATA.length&&alert("总数据大于约定值 3 * 6"),console.table(POSITION_DATA),console.table(API_RESULT);var T=document.getElementById("onDevice"),I=new THREE.Vector3,d=new THREE.Vector2,A=new THREE.Raycaster,c=void 0,h=void 0,_=void 0,l=void 0,O=void 0,m=void 0,u=void 0,P=270,E=0,D=0,M=0,S=0;!function(){function e(e){0===S?(S=1,T.value="关闭陀螺仪"):(S=0,T.value="开启陀螺仪")}function t(){h.aspect=window.innerWidth/window.innerHeight,h.updateProjectionMatrix(),_.setSize(window.innerWidth,window.innerHeight),a(),i()}function I(e){e.preventDefault(),document.addEventListener("mousemove",p,!1),document.addEventListener("mouseup",v,!1)}function D(e){d.x=e.clientX/_.domElement.clientWidth*2-1,d.y=-e.clientY/_.domElement.clientHeight*2+1,A.setFromCamera(d,h)}function M(e){e.preventDefault();var t=e.touches[0];O=t.screenX,m=t.screenY,d.x=e.touches[0].pageX/_.domElement.clientWidth*2-1,d.y=-e.touches[0].pageY/_.domElement.clientHeight*2+1,A.setFromCamera(d,h);for(var n=0;n<CUBE_DATA.length;n++)if(A.intersectObject(CUBE_DATA[n]).length>0)switch(API_RESULT[n].source_type){case"video":isAndroid?window.android.showres(n):isIos&&(window.location.href="arseek://arseeds.com/transmit?index="+n);break;case"image":var a=GetQueryString("key");window.location.href=nowUrl.online+"/angular/index.html?linktype=h5&index="+n+"&key="+a+"#/Image";break;case"url":window.location.href=API_RESULT[n].source_path[0]}}function w(e){e.preventDefault();var t=e.touches[0];P-=.1*(t.screenX-O),E+=.1*(t.screenY-m),O=t.screenX,m=t.screenY}function p(e){var t=e.movementX||e.mozMovementX||e.webkitMovementX||0,n=e.movementY||e.mozMovementY||e.webkitMovementY||0;P-=.1*t,E+=.1*n}function v(e){document.removeEventListener("mousemove",p),document.removeEventListener("mouseup",v)}function g(e){h.fov-=.01*e.wheelDeltaY,h.updateProjectionMatrix()}document.addEventListener("mousedown",I,!1),document.addEventListener("click",D,!1),document.addEventListener("touchstart",M,!1),document.addEventListener("touchmove",w,!1),document.addEventListener("mousewheel",g,!1),window.addEventListener("resize",t,!1),DEBUG?(T.style.display="block",T.addEventListener("touchstart",e,!1)):S=1,n(),a(),o(),r(),i(),l.connect(),s(),c.add(u),$.each(CUBE_DATA,function(e){c.add(CUBE_DATA[e])})}()})).catch(function(e){console.error("error："+JSON.stringify(e)),alert("api connect error")})}();