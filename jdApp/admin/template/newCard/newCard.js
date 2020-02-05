function newCard($scope,$rootScope,$http,$state,$stateParams){
    if ( !localStorage.getItem('token')) {
        $state.go('login')
    }
    jQuery('#day').datepicker().
        on('changeDate.datepicker.amui', function(event) {
          console.log(event.date);
        });

    $scope.id = $stateParams.id
    $scope.insdsd = function(fileInfo){
        var cropData = new FormData(); // 发送的数据对象
        cropData.append('type', 'image');
        cropData.append('file', fileInfo);
        // cropData.append('w', 300);
        cropData.append('token', localStorage.getItem('token'));
        // cropData.append('h', 200);
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
                jQuery('#titleImage').css({
                    width:'100%',
                    height:'auto'
                })
                // jQuery('#choice').css('display','none');
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
                        if (res.code == 200 ) {
                        $state.go('index.card')
                        } else {
                            alert(res.msg)
                        }
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
        if ($scope.id == 'new') {
            $scope.title = '添加新的打卡信息'
        } else {
            $scope.title = '更新打卡信息'
        $http({
            method:"GET",
            url: 'https://api.arseeds.com/integral/sign/get-sign-bgimg',
            params:{token:localStorage.getItem('token'),id:$scope.id}
        }).success(function(res){
            if (res.code == 200) {
                $("#titleImage").attr('src',res.data.sign_img_path).css({
                    width:"100%",
                    height:"100%"
                })
                $('#day').val(res.data.sign_date)
            }
        })
        }

        jQuery('#le li').removeClass('act').eq(0).addClass('act')
}