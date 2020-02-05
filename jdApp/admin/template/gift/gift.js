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
                if (confirm('确定要删除吗？')) {


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
            }

            $scope.click = function(id){
                    $state.go('index.newGift',{id:id})
            }


            jQuery('#le li').removeClass('act').eq(1).addClass('act')
}