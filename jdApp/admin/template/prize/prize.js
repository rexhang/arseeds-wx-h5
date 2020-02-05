function prize($scope, $rootScope, $http, $state) {
    if (!localStorage.getItem('token')) {
        $state.go('login')
    }
    jQuery('#day1, #day2').datepicker()

    function getList(Data){
        $http({
            url: 'https://api.arseeds.com/integral/exchange/get-exchange-list',
            method: "GET",
            params: Data
        }).success(function(res) {
            $scope.list = res.data.list;
            $scope.page = res.data.page;
            $scope.maxPage = Math.ceil(parseInt(res.data.total) / 20);
        })
    }

    var Data = {
        token: localStorage.getItem('token'),
        page: 1,
        perpage: 20
    }

    getList(Data);

    // 翻页
    $scope.prev = function(ispage){
        Data.page = parseInt(ispage) - 1;
        getList(Data);
    }
    $scope.next = function(ispage){
        Data.page = parseInt(ispage) + 1;
        getList(Data);
    }

    // 导出
    $scope.export = function(){
        var date1 = jQuery('#day1').val();
        var date2 = jQuery('#day2').val();
        if(date1 && date2){
            window.location.href = `https://api.arseeds.com/integral/exchange/down?end_time=${date2}&start_time=${date1}`;
        } else{
            alert('请确认正确的选择了起始时间才可进行文件导出！')
        }
    }

    jQuery('#le li').removeClass('act').eq(2).addClass('act')
}