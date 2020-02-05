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
                if (confirm('确定要删除吗？')) {
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
            }



            $scope.add = function(){
                $state.go('index.newCard')
            }

            jQuery('#le li').removeClass('act').eq(0).addClass('act')
}