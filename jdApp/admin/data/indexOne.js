/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1),
__webpack_require__(2)
__webpack_require__(3)
__webpack_require__(4)
__webpack_require__(5)
__webpack_require__(6)
__webpack_require__(7)
__webpack_require__(8)
__webpack_require__(9)

/***/ }),
/* 1 */
/***/ (function(module, exports) {

function login($rootScope,$scope,$http,$state){
    $scope.click = function(){
        if ($scope.name != undefined && $scope.name != '') {
            if ($scope.passWord != undefined && $scope.passWord != '') {
                var Data = {
                    username:$scope.name,
                    password:$scope.passWord
                }

            $http({
                url: 'https://api.arseeds.com/integral/login/login',
                method: "POST",
                data:jQuery.param(Data),
                headers: {
                    "Accept-Language": "zh_CN",
                    "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).success(function(res){
                    if (res.code == 400) {
                        alert('账户或密码不正确')
                    } else {
                        localStorage.setItem("token",res.data.token)
                        $state.go('index.card');
                    }
            })
            } else {
                alert('请输入密码')
            }
        } else {
            alert('请输入账户')
        }
    }
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function card($scope,$rootScope,$http,$state){
    if ( !localStorage.getItem('token')) {
        $state.go('login')
    }
    $scope.list = [];
    var arr = [];
    $scope.num = 1;
    function get(){
         $http({
                url: 'https://api.arseeds.com/integral/sign/get-sign-bgimg-list',
                method: "GET",
                params:{
                        token:localStorage.getItem('token'),
                        page:$scope.num,
                        perpage:20
                },
                headers: {
                    "Accept-Language": "zh_CN",
                    "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).success(function(res){
                    angular.forEach(res.data.list, function(value, key){
                        console.log(value)
                        arr.push(value)
                    });
                    $scope.list = arr
            })
    }
get()
$scope.more = function(){
    $scope.num++;
    get()
}
            $scope.click = function(id){
                $state.go('index.newCard',{id:id})
            }
            $scope.cler = function(id,index){
                console.log(id)
                var Data = {
                    token:localStorage.getItem('token'),
                    id:id
                }
                $http({
                url: 'https://api.arseeds.com/integral/sign/delete-sign-bgimg',
                method: "POST",
                data:jQuery.param(Data),
                headers: {
                    "Accept-Language": "zh_CN",
                    "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).success(function(res){
                console.log(res)
                var array  = [];
                for (var i = 0; i < $scope.list.length; i++) {
                    if (i != index) {
                        array.push($scope.list[i])
                    }
                }
                $scope.list = array;
                })
            }
            $scope.add = function(){
                $state.go('index.newCard')
            }
}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

function prize($scope,$rootScope,$http,$state){
if ( !localStorage.getItem('token')) {
        $state.go('login')
    }
    var Data = {
        token:localStorage.getItem('token'),
        page:1,
        perpage:20
    }
    $http({
                url: 'https://api.arseeds.com/integral/exchange/get-exchange-list',
                method: "POST",
                data:jQuery.param(Data),
                headers: {
                    "Accept-Language": "zh_CN",
                    "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).success(function(res){
                console.log(res.data.list)
                $scope.list = res.data.list
           })
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

function index($scope,$rootScope,$http,$state){
    $scope.click = function(){
        $http({
                 url: 'https://api.arseeds.com/integral/login/logout',
                method: "GET",
                    params:{token:localStorage.getItem('token')},
                  headers: {
                    "Accept-Language": "zh_CN",
                        "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
                       }
                        }).success(function(res){
                                            console.log(res)
                                            if (res.code == 200) { localStorage.clear();
                                                $state.go('login')
                                        }

                    })
    }
}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

function gift($scope,$rootScope,$http,$state){
    if ( !localStorage.getItem('token')) {
        $state.go('login')
    }
    var count = 1;
    var arr = []
    function get(){
    var Data = {
        token:localStorage.getItem('token'),
        page:count,
        perpage:20
    }
    $http({
                url: 'https://api.arseeds.com/integral/coupons/get-coupons-list',
                method: "GET",
                params:Data,
                headers: {
                    "Accept-Language": "zh_CN",
                    "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).success(function(res){
                console.log(res.data.list)
                angular.forEach(res.data.list, function(value, key){
                    arr.push(value)
                });
                $scope.list = arr;
                $scope.num = res.data.list.length;
           })
    }
get();
$scope.more = function(){
    count ++;
    get();
}
            $scope.cler = function(id,index){
                console.log(index)
                $http({
                url: 'https://api.arseeds.com/integral/coupons/delete-coupons',
                method: "POST",
                data:jQuery.param({
                    token:localStorage.getItem('token'),
                    id:id
                }),
                headers: {
                    "Accept-Language": "zh_CN",
                    "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).success(function(res){
                var array = [];
                  for(var i = 0;i<$scope.list.length;i++){
                        if (i != index) {
                            array.push($scope.list[i])
                        }
                  }
                    $scope.list = array;
           })
            }
            $scope.click = function(id){
                    $state.go('index.newGift',{id:id})
            }
}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

function set($scope,$rootScope,$http,$state){
    if ( !localStorage.getItem('token')) {
        $state.go('login')
    }
    $scope.amend = function(id){
        $("#listFive").hide()
    if (id==1) {
        $('#listOne').show();
        $('#listTwo').hide();
        $('#listThree').hide();
    } else if(id==2){
        $('#listOne').hide();
        $('#listTwo').show();
        $('#listThree').hide();
    }else if(id==3){
        $('#listOne').hide();
        $('#listTwo').hide();
        $('#listThree').show();
    }
    }
// 点击取消
    $scope.abolish = function(id){
        console.log(id)
        if (id == 1) {
        $('#listOne').hide();
        } else if(id == 2){
            $('#listTwo').hide();
        }else if(id == 3){
            console.log(00)
             $('#listThree').hide();
        }else if(id == 4){
            $('#listFour').hide();
        }else if(id == 5){
            $('#listFive').hide();
        }
    }
    // 点击确定进行数据传递
    $scope.ensure = function(id){
         if (id == 1) {
            $("#invitedOne").text($('#friendOne').val())
            $('#listOne').hide()
         } else if(id == 2){
            $("#invitedTwo").text($('#friendTwo').val())
            $("#listTwo").hide()
         }else if(id == 3){
            $("#invitedThree").text($('#friendThree').val())
            $('#listThree').hide();
         }
         $("#listFive").show()
    }



    // 获取信息
      $http({
                url: 'https://api.arseeds.com/integral/setting/get-integral-setting',
                method: "GET",
                params:{token:localStorage.getItem('token')},
                headers: {
                    "Accept-Language": "zh_CN",
                    "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).success(function(res){
                // $scope.list = res.data.list
                console.log(res.data)
                $scope.list = res.data
setTimeout(function(){
  $scope.week = function(id){
    $('#listFour').show()
    $scope.sure = function(){
        if ($("#friendFour").val() != '') {
        if (id == 1) {
            $('#first_day').text($("#friendFour").val())
        } else  if(id == 2){
            $('#second_day').text($("#friendFour").val())
        }else  if(id == 3){
            $('#third_day').text($("#friendFour").val())
        }else  if(id == 4){
            $('#fourth_day').text($("#friendFour").val())
        }else  if(id == 5){
            $('#fifth_day').text($("#friendFour").val())
        }else  if(id == 6){
            $('#sixth_day').text($("#friendFour").val())
        }else  if(id == 7){
            $('#seventh_day').text($("#friendFour").val())
        }
        $('#listFour').hide();
        $("#listFive").show();
        } else {
            alert('请输入更改分数')
        }
        }
}
},0)
           })


          // 点击提交数据
    $scope.ensureLast = function(){
        var data = {
                token:localStorage.getItem('token'),
                invitation_score:$('#invitedOne').text(),
                donate_score:$('#invitedTwo').text(),
                remove_score_date:$('#invitedThree').text(),
                first_day:$('#first_day').text(),
                second_day:$('#first_day').text(),
                third_day:$('#first_day').text(),
                fourth_day:$('#first_day').text(),
                fifth_day:$('#first_day').text(),
                sixth_day:$('#first_day').text(),
                seventh_day:$('#first_day').text()
            }
$http({
                url: 'https://api.arseeds.com/integral/setting/set-integral-setting',
                method: "POST",
                data:jQuery.param(data),
                headers: {
                    "Accept-Language": "zh_CN",
                    "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).success(function(res){
                    console.log(res)
            })
    }
}

/***/ }),
/* 7 */
/***/ (function(module, exports) {

function newCard($scope,$rootScope,$http,$state,$stateParams){
    if ( !localStorage.getItem('token')) {
        $state.go('login')
    }
    $scope.id = $stateParams.id
    $scope.insdsd = function(fileInfo){
        var cropData = new FormData(); // 发送的数据对象
        cropData.append('type', 'image');
        cropData.append('file', fileInfo);
        cropData.append('w', 300);
        cropData.append('token', localStorage.getItem('token'));
        cropData.append('h', 200);
        jQuery.ajax({
            url: 'https://api.arseeds.com/integral/sign/upload',
            type: 'post',
            dataType: 'json',
            data: cropData,
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                console.log(data)
                jQuery('#titleImage').attr('src',data.data.file_url);
                jQuery('#choice').css('display','none');
            }
        })
    }


        // 传输图片时间和地址
        $scope.click = function(){
            console.log($scope.id)
           if ($scope.id == 'new') {
            if (jQuery('#day').val() != '') {
            var Data = {
                token:localStorage.getItem('token'),
                sign_img_path:jQuery('#titleImage').attr('src'),
                sign_date:jQuery('#day').val()
            }
            $http({
                url: 'https://api.arseeds.com/integral/sign/add-sign-bgimg',
                method: "POST",
                data:jQuery.param(Data),
                headers: {
                    "Accept-Language": "zh_CN",
                    "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).success(function(res){
                if (res.code == 200) {
                    $state.go('index.card')
                } else {
                    alert(res.msg)
                }
                })
            }else{
                alert('请输入日期')
            }
            } else {
         if (jQuery('#day').val() != '') {
                    var Data = {
                        id:$scope.id,
                        token:localStorage.getItem('token'),
                        sign_img_path:jQuery('#titleImage').attr('src'),
                        sign_date:jQuery('#day').val()
                    }
                    $http({
                        url: 'https://api.arseeds.com/integral/sign/update-sign-bgimg',
                        method: "POST",
                        data:jQuery.param(Data),
                        headers: {
                            "Accept-Language": "zh_CN",
                            "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
                        }
                    }).success(function(res){
                        console.log(0)
                        $state.go('index.card')
                        })
                    }else{
                        alert('请输入日期')
                    }
            }
        }
        $scope.cancel = function(){
            $state.go('index.card')
        }
        // 获取相应id信息
        $http({
            method:"GET",
            url: 'https://api.arseeds.com/integral/sign/get-sign-bgimg',
            params:{token:localStorage.getItem('token'),id:$scope.id}
        }).success(function(res){
            console.log(res)
            if (res.code == 200) {
                $("#titleImage").attr('src',res.data.sign_img_path).css({
                    width:"100%",
                    height:"100%"
                })
                $('#day').val(res.data.sign_date)
            } else {}
        })
}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

function newCoupon(){

}

/***/ }),
/* 9 */
/***/ (function(module, exports) {

function newGift($scope, $rootScope, $http, $state, $stateParams) {
if ( !localStorage.getItem('token')) {
        $state.go('login')
    }
    var array = []
    $scope.id = $stateParams.id;
    console.log($scope.id)
    if ($scope.id == 'new') {
        $scope.title = '新建礼品'
    } else {
        $scope.title = '更新礼品'
    }
    $scope.insdsd = function(fileInfo, index) {
        var cropData = new FormData(); // 发送的数据对象
        cropData.append('type', 'image');
        cropData.append('file', fileInfo);
        cropData.append('w', 320);
        cropData.append('token', localStorage.getItem('token'));
        cropData.append('h', 320);
        jQuery.ajax({
            url: 'https://api.arseeds.com/integral/sign/upload',
            type: 'post',
            dataType: 'json',
            data: cropData,
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                if ($scope.id == 'new') {
                    $("#Image").after("<img  id='img' src='" + data.data.file_url + "'/>");
                    $('#img').css({
                        width: '80px',
                        height: '80px'
                    })
                    array.push(data.data.file_url);
                    if (array.length >= 5) {
                        $("#uploadImage").hide()
                    }
                } else {
                    $('.titleImage').eq(index).attr('src', data.data.file_url)
                }
            }
        })
    }

    if ($scope.id != 'new') {
        console.log(1)
        $http({
            url: 'https://api.arseeds.com/integral/coupons/get-coupons-info',
            method: "GET",
            params: {
                id: $scope.id,
                token: localStorage.getItem('token')
            },
            headers: {
                "Accept-Language": "zh_CN",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        }).success(function(res) {
            $scope.list = res.data;
            console.log(res)
            $('#valOne').attr('value',res.data.coupon_title)
            $('#valTwo').attr('value',res.data.coupon_href)
            $('#valThree').attr('value',res.data.coupon_need_score)
            $('#valFour').attr('value',res.data.coupon_count)
        })
    }
    // 点击确定实现上传数据
    $scope.submit = function() {
    if ($scope.id == 'new') {
        if ($scope.type == 1) {
            // 添加实物接口
            if ($scope.PrizeName != undefined && $scope.PrizeName != '') {
                if ($scope.PrizeHref != undefined && $scope.PrizeHref != '') {
                    if ($scope.PrizeCount != undefined && $scope.PrizeCount != '') {
                        if ($scope.PrizeNum != undefined && $scope.PrizeNum != '') {
                            var data = {
                                token: localStorage.getItem('token'),
                                coupon_type: 1,
                                coupon_title: $scope.PrizeName,
                                coupon_img_path: array,
                                coupon_count: $scope.PrizeCount,
                                coupon_href: $scope.PrizeHref,
                                coupon_need_score: $scope.PrizeNum
                            }

                            $http({
                                url: 'https://api.arseeds.com/integral/coupons/add-coupons',
                                method: "POST",
                                data: jQuery.param(data),
                                headers: {
                                    "Accept-Language": "zh_CN",
                                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                                }
                            }).success(function(res) {
                                console.log(res)
                                $state.go('index.gift')
                            })
                        } else {
                            alert("请输入库存")
                        }
                    } else {
                        alert("请输入所需积分")
                    }
                } else {
                    alert('请输入地址链接')
                }
            } else {
                alert("请输入名称")
            }
        } else if ($scope.type == 2) {
            // 添加优惠券接口
            if ($scope.PrizeName != undefined && $scope.PrizeName != '') {
                if ($scope.PrizeHref != undefined && $scope.PrizeHref != '') {
                    var data = {
                        token: localStorage.getItem('token'),
                        coupon_type: 2,
                        coupon_title: $scope.PrizeName,
                        coupon_img_path: array,
                        coupon_href: $scope.PrizeHref

                    }
                    $http({
                        url: 'https://api.arseeds.com/integral/coupons/add-coupons',
                        method: "POST",
                        data: jQuery.param(data),
                        headers: {
                            "Accept-Language": "zh_CN",
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                        }
                    }).success(function(res) {
                        console.log(res)
                        $state.go('index.gift')
                    })
                } else {
                    alert('请输入地址链接')
                }
            } else {
                alert('请输入名称')
            }
        }
    } else {
        // 添加图片更新的上传接口
        if ($scope.type == 1) {
            // 添加实物接口
            if ($('#valOne').val() != '') {
                if ($('valTwo').val() != '') {
                    if ($('#valThree').val() != '') {
                        if ($('#valFour').val() != '') {
                            for (var i = 0; i < $(".titleImage").length; i++) {
                               array.push( $(".titleImage")[i].src)
                            }
                            console.log(array)
                            var data = {
                                id:$scope.id,
                                token: localStorage.getItem('token'),
                                coupon_type: 1,
                                coupon_title: $('#valOne').val(),
                                coupon_img_path: array,
                                coupon_count: $('#valThree').val(),
                                coupon_href: $('#valTwo').val(),
                                coupon_need_score: $('#valFour').val()
                            }
                            $http({
                                url: 'https://api.arseeds.com/integral/coupons/update-coupons',
                                method: "POST",
                                data: jQuery.param(data),
                                headers: {
                                    "Accept-Language": "zh_CN",
                                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                                }
                            }).success(function(res) {
                                if (res.cod == 200) {
                                $state.go('index.gift')
                                } else {
                                    alert(res.msg)
                                }
                            })
                        } else {
                            alert("请输入库存")
                        }
                    } else {
                        alert("请输入所需积分")
                    }
                } else {
                    alert('请输入地址链接')
                }
            } else {
                alert("请输入名称")
            }
        } else if ($scope.type == 2) {
            // 添加优惠券接口
            if ($("#valOne").val() != '') {
                if ($('#valTwo').val() != '') {
                    for (var i = 0; i < $(".titleImage").length; i++) {
                               array.push( $(".titleImage")[i].src)
                            }
                    var data = {
                        id:$scope.id,
                        token: localStorage.getItem('token'),
                        coupon_type: 2,
                        coupon_title: $("#valOne").val(),
                        coupon_img_path:[ array[0]],
                        coupon_href: $('#valTwo').val()

                    }
                    $http({
                        url: 'https://api.arseeds.com/integral/coupons/update-coupons',
                        method: "POST",
                        data: jQuery.param(data),
                        headers: {
                            "Accept-Language": "zh_CN",
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                        }
                    }).success(function(res) {
                        console.log(res)
                        if (res.code == 200) {
                        $state.go('index.gift')
                        } else {
                            alert(res.msg)
                        }
                    })
                } else {
                    alert('请输入地址链接')
                }
            } else {
                alert('请输入名称')
            }
        }
    }

    }
    $scope.type = 1;
    $("#radioOne").attr("checked", 'checked')
        // 设置radio
    $scope.clickOne = function() {
        $("#radioOne").attr("checked", 'checked')
        $("#radioTwo").attr("checked", false)
        $('#count').show()
        $('#num').show()
        $scope.type = 1;
    }
    $scope.clickTwo = function() {
        $("#radioTwo").attr("checked", 'checked')
        $("#radioOne").attr("checked", false)
        $scope.type = 2;
        $('#count').hide()
        $('#num').hide()
    }
}

/***/ })
/******/ ]);