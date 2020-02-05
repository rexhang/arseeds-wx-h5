function index($scope,$rootScope,$http,$state){

    // if(window.myScroll){
    //     setTimeout(function(){
    //         window.myScroll.options.preventDefault = true;
    //         window.myScroll.refresh();
    //         console.log('refreshOK');
    //     }, 300)
    // }
    if(localStorage.getItem('name')){
        $scope.isUserName = localStorage.getItem('name')
    }
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



    setTimeout(function(){
        var wi = jQuery(document).width() - 200;

        console.log(wi)

        var hi = jQuery(document).height() - 60;

        jQuery('#rightCon').css('width', wi)

        // jQuery('#le li').click(function(){
        //     jQuery(this).addClass('act').siblings().removeClass('act')
        // })

        jQuery('#leftBar').css('height', hi);



    }, 50)



}