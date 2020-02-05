function set($scope,$rootScope,$http,$state){
    if ( !localStorage.getItem('token')) {
        $state.go('login')
    }

    jQuery('#friendThree').datepicker().
        on('changeDate.datepicker.amui', function(event) {
          console.log(event.date);
        });


    $scope.amend = function(id){
        //$('body').css('background','rgba(0,0,0,0.3)')
        $('#mod').show();
        $('#listOne').hide();
         $('#listTwo').hide();
        $('#listFour').hide();
        $('#listThree').hide();
    if (id==1) {
       $('#listOne').show();

    } else if(id==2){
        $('#listTwo').show();
    }else if(id==3){
        $('#listThree').show();
    }else if (id == 4) {
        $('#listFour').show();
    }
    }
// 点击取消
    $scope.abolish = function(id){
        $('#mod').hide();
        $('#listOne').hide();
        $('#listTwo').hide();
        $('#listThree').hide();
        $('#listFour').hide();
    }
    // 点击确定进行数据传递
    $scope.ensure = function(id){
        $('#listOne').hide();
        $('#listTwo').hide();
        $('#listThree').hide();
        $('#listFour').hide();
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
            var data = {
                token:localStorage.getItem('token'),
                invitation_score:$('#invitedOne').text(),
                donate_score:$('#invitedTwo').text(),
                remove_score_date:$('#invitedThree').text(),
                first_day:$('#day1').val(),
                second_day:$('#day2').val(),
                third_day:$('#day3').val(),
                fourth_day:$('#day4').val(),
                fifth_day:$('#day5').val(),
                sixth_day:$('#day6').val(),
                seventh_day:$('#day7').val()
            }
            console.log($('#day7').val())
        $http({
                url: 'https://api.arseeds.com/integral/setting/set-integral-setting',
                method: "POST",
                data:jQuery.param(data),
                headers: {
                    "Accept-Language": "zh_CN",
                    "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).success(function(res){
                    if (res.code == 200 ) {
                        $state.reload();

                    } else {
                        alert(res.msg);
                    }
                    $('#mod').hide();
            })
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
                $('#day1').attr('value',res.data.first_day)
                $('#day2').attr('value',res.data.second_day)
                $('#day3').attr('value',res.data.third_day)
                $('#day4').attr('value',res.data.fourth_day)
                $('#day5').attr('value',res.data.fifth_day)
                $('#day6').attr('value',res.data.sixth_day)
                $('#day7').attr('value',res.data.seventh_day)
           })

          // 点击提交数据
    // $scope.ensureLast = function(){
    //     var data = {
    //             token:localStorage.getItem('token'),
    //             invitation_score:$('#invitedOne').text(),
    //             donate_score:$('#invitedTwo').text(),
    //             remove_score_date:$('#invitedThree').text(),
    //             first_day:$('#day1').attr('value'),
    //             second_day:$('#day1').attr('value'),
    //             third_day:$('#day1').attr('value'),
    //             fourth_day:$('#day1').attr('value'),
    //             fifth_day:$('#day1').attr('value'),
    //             sixth_day:$('#day1').attr('value'),
    //             seventh_day:$('#day1').attr('value')
    //         }
    //     $http({
    //             url: 'https://api.arseeds.com/integral/setting/set-integral-setting',
    //             method: "POST",
    //             data:jQuery.param(data),
    //             headers: {
    //                 "Accept-Language": "zh_CN",
    //                 "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
    //             }
    //         }).success(function(res){
    //                 if (res.code == 200 ) {
    //                     console.log()
    //                      $('body').css('background','white')

    //                 } else {
    //                     alert(res.msg)
    //                 }
    //         })
    // }
    jQuery('#le li').removeClass('act').eq(3).addClass('act')
}