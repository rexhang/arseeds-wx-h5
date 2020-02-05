function newGift($scope, $rootScope, $http, $state, $stateParams) {



    jQuery("#radioOne").uCheck();
    jQuery("#radioTwo").uCheck();

    $scope.remove = function(index){
        count.splice(index,1);
         $scope.count = count
         if (count.length <= 0) {
            $("#uploadImage").show()
         }
        }

    if ( !localStorage.getItem('token')) {
            $state.go('login')
        }
    var array = []
    var count = []
    $scope.id = $stateParams.id;
    if ($scope.id == 'new') {
        $scope.title = '新建礼品'
    } else {
        $scope.title = '更新礼品'
    }
    $scope.insdsd = function(fileInfo, index) {
        console.log($scope.type)
        if ($scope.type == 2) {$('#radio1').hide()} else if($scope.type == 1) {$('#radio2').hide()}
            var cropData = new FormData(); // 发送的数据对象
        cropData.append('type', 'image');
        cropData.append('file', fileInfo);
        cropData.append('w', 640);
        cropData.append('token', localStorage.getItem('token'));
        cropData.append('h',640);
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
                    // $("#Image").after("<div><img  id='img' src='" + data.data.file_url + "'/><p ng-click='remove()'>ddd</p></div>");
                count.push(data.data.file_url)
            $scope.count = count;
            $scope.$apply()
                    $('#img').css({
                        width: '100px',
                        height: '100px'
                    })

                    if ($scope.type ==2 ) {
                        $("#uploadImage").hide()
                    }
                    if (count.length >= 5) {
                        $("#uploadImage").hide()
                    }
                } else {
                    $('.titleImage').eq(index).attr('src', data.data.file_url)
                }
            }
        })
    }

    if ($scope.id != 'new') {
        $('#IMage').hide()
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
            console.log(res.data.coupon_type)
            if (res.data.coupon_type ==2) {
                $('#radio1').hide()
                $('#radioTwo').attr("checked", 'checked')
                $('#count').hide()
                $('#num').hide();
                $scope.type = 2;
                $('#need').show();
                $('#valOld').attr('value', res.data.coupon_need_score)
            } else if(res.data.coupon_type ==1){
                $('#radio2').hide()
                $scope.type = 1;
                $('#need').hide();
                $('#valOld').attr('value', 0)
            }
            $scope.list = res.data;
            $('#valOne').attr('value',res.data.coupon_title)
            $('#valTwo').attr('value',res.data.coupon_href)
            $('#valThree').attr('value',res.data.coupon_need_score)



            $('#valFour').attr('value',res.data.coupon_count)

            $scope.removeImage = function(index){
                var count2 = document.querySelectorAll('.titleImage');
                var count3 = []
                for (var i = 0; i < count2.length; i++) {
                    if (i != index) {
                        count3.push(count2[i].src)
                    }
                }
            $scope.list.coupon_img_path = count3
        }
        })
    }
    // 点击
    // 确定实现上传数据
    $scope.submit = function() {
    if ($scope.id == 'new') {
        if ($scope.type == 1) {
            // 添加实物接口
            if ($scope.PrizeName != undefined && $scope.PrizeName != '') {
                    if ($scope.PrizeCount != undefined && $scope.PrizeCount != '') {
                        if ($scope.PrizeNum != undefined && $scope.PrizeNum != '') {
                            var data = {
                                token: localStorage.getItem('token'),
                                coupon_type: 1,
                                coupon_title: $scope.PrizeName,
                                coupon_img_path: count,
                                coupon_count: $scope.PrizeNum,
                                coupon_href: $scope.PrizeHref,
                                coupon_need_score: $scope.PrizeCount
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

                                if (res.code == 200) {
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
                alert("请输入名称")
            }
        } else if ($scope.type == 2) {
            // 添加优惠券接口
            if ($scope.PrizeName != undefined && $scope.PrizeName != '') {
                if ($scope.PrizeHref != undefined && $scope.PrizeHref != '') {
                    if (jQuery('#valOld').val() != undefined && jQuery('#valOld').val() != ''){
                        var data = {
                            token: localStorage.getItem('token'),
                            coupon_type: 2,
                            coupon_title: $scope.PrizeName,
                            coupon_img_path: count,
                            coupon_href: $scope.PrizeHref,
                            coupon_need_score: jQuery('#valOld').val()
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
                            if (res.code == 200) {
                            $state.go('index.gift')
                            } else {
                                alert(res.msg)
                            }
                        })
                    } else{
                        alert('请输入兑换所需积分')
                    }
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
                                coupon_count: $('#valFour').val(),
                                coupon_href: $('#valTwo').val(),
                                coupon_need_score: $('#valThree').val()
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
                    if($('#valOld').val() != ''){
                        for (var i = 0; i < $(".titleImage").length; i++) {
                                   array.push( $(".titleImage")[i].src)
                                }
                        var data = {
                            id:$scope.id,
                            token: localStorage.getItem('token'),
                            coupon_type: 2,
                            coupon_title: $("#valOne").val(),
                            coupon_img_path:[ array[0]],
                            coupon_href: $('#valTwo').val(),
                            coupon_need_score: $('#valOld').val()
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
                    } else{
                        alert('请输入兑换所需积分')
                    }
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
        // $("#radioOne").attr("checked", 'checked')
        // $("#radioTwo").attr("checked", false)
        $('#count').show()
        $('#num').show()
        $scope.type = 1;
        $('#need').hide();
    }
    $scope.clickTwo = function() {
        // $("#radioTwo").attr("checked", 'checked')
        // $("#radioOne").attr("checked", false)
        $scope.type = 2;
        $('#count').hide()
        $('#num').hide()
        $('#need').show();
    }

    jQuery('#le li').removeClass('act').eq(1).addClass('act')
}