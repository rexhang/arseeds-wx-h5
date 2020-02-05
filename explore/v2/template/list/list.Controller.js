angular.module('exploreApp')
.controller('listController', ['$rootScope', '$scope', 'URL', 'serverConnect', 'h5locals', '$state', '$sce', function($rootScope, $scope, URL, serverConnect, h5locals, $state, $sce){
    return listController($rootScope, $scope, URL, serverConnect, h5locals, $state, $sce);
}])
.directive('repeatFinish', function(){
    return {
        link: function(scope,element,attr){
            if(scope.$last == true){
                console.log('repeat列表完毕');
                // 切换识别图 识别结果
                var itemMenu = jQuery('#list-content > .item > .menu-nav > .ctrl-nav'); // 触发按钮
                // 点击切换逻辑
                itemMenu.click( function() {
                    console.log('click')
                    jQuery(this).addClass('sel').siblings().removeClass('sel');
                    var _index  = jQuery(this).index();
                    var _parentItem = jQuery(this).parent().parent(); //item
                    _parentItem.find('.face').hide();
                    _parentItem.find('.face').eq(_index).show().addClass('animated fadeIn');
                    setTimeout(function(){
                        _parentItem.find('.face').removeClass('animated fadeIn')
                    }, 500)
                } );

                // 显示识别图提示
                jQuery('#list-content > .item > .face1').mouseenter(function(){
                    jQuery(this).find('.hover-box').show().addClass('animated fadeIn');
                });
                jQuery('#list-content > .item > .face1').mouseleave(function(){
                    jQuery(this).find('.hover-box').hide();
                });
            }
        }
    }
})
.directive('paging', ['$compile', function($compile){
    return {
        restrict: 'AE',
        templateUrl: "./template/list/page.html",
        replace: true,
        /*false：共享作用域*/
        /*true：继承父域，并建立独立作用域*/
        /*{}：不继承父域，建立独立作用域*/
        scope: true,
        link: function(scope, element, attr){
            // 数据渲染完毕执行
            scope.$on('pageinit', function(event, data) {
                console.log(event);
                if(data){
                    // 防止检测到事件重复添加的
                    if(scope.repeats){
                        scope.repeats = false; // 防止检测到事件重复添加的
                        var pageTotal = parseInt(data); // 总页数
                        var pageSize  = parseInt( scope.pageSize ); // 单位分页量
                        console.log(pageTotal, pageSize);
                        var pageNum = parseInt( (pageTotal + pageSize - 1) / pageSize ); // 算法 - 计算显示的页数
                        var item = ''; // 页码按钮HTML标签代码
                        // 循环添加页码至标签域内
                        for(var i = 0; i < pageNum;i++){
                            if(i == 0){
                                item += "<li class='sel' ng-click='getPage(1)'>首页</li>";
                            } else if(i == pageNum-1){
                                item += "<li ng-click='getPage(" + (i+1) +")'>尾页</li>";
                            } else{
                                item += `<li ng-click='getPage(${i+1})'>${i+1}</li>`;
                            }
                        }
                        /*编译html代码为 angularjs代码*/
                        var compileHTMLs = $compile(item)(scope);

                        jQuery(element).find('.rex-page').append(compileHTMLs); // 添加动态代码

                        jQuery(element).find('.rex-page li').click(function(){
                            jQuery(this).addClass('sel').siblings().removeClass('sel');
                        });
                    } else{
                        return false;
                    }
                }
            });

        }
    }
}])
;

function listController($rootScope, $scope, URL, serverConnect, h5locals, $state, $sce){
    $rootScope.appLog('listController init');
    $rootScope.bodyclass = 'list';

    $scope.$on('$viewContentLoaded', () => {
        let token = h5locals.get('token');
        if ( !token ){
            $state.go('login', {}, {reload: true});
        } else{
            layer.load(1); // 读取用户资料 开启动画
            let baseURL = URL.apiUrl().online_exchange;
            $scope.thumb_photo_url = h5locals.get('thumb_photo_url'); // 读取缓存的头像

            $scope.pageSize  = '11';  // 分页-每页展示数
            $scope.page      = '1'; // 分页-查询第几页
            $scope.repeats   = true; // 是否第一次渲染分页
            // 新建列表类
            class List{
                constructor(){
                }
                getListInfo(istoken){
                    serverConnect.__get(baseURL + '/explore2/img-show/get', {token: istoken}).success(function(data){
                    /*serverConnect.__get(baseURL + '/explore2/img-show/get', {token: istoken, cn: $scope.pageSize, pn: $scope.page}).success(function(data){*/
                        if(data.code == 200){
                            //$scope.text = $sce.trustAsHtml(htmlResource);
                            data.data.result.forEach(function(item, index){
                                if(item.type == 'mix'){
                                    item.result = $sce.trustAsHtml(item.result);
                                }
                            });
                            $scope.listData = data.data.result; // 列表数据
                            $scope.pageTotal = data.data.all_page; // 分页-总数
                            $scope.$broadcast('pageinit', $scope.pageTotal);
                        } else{
                            layer.msg(data.msg, {
                                time: 500
                            });
                        }
                        layer.closeAll('loading');
                    }).error(function(data,status,headers,config){
                        layer.msg('api连接错误');
                        layer.closeAll('loading');
                    });
                }
                delList(istoken, isid){
                    var postData = {
                        token: istoken,
                        id: isid
                    }
                    serverConnect.__post(baseURL + '/explore2/img-show/delete', postData, {}).success(function(data){
                        if(data.code == 200){
                            layer.msg('删除成功', {
                                time: 700
                            });
                            $state.reload();
                        } else{
                            layer.msg(data.msg, {
                                time: 800
                            });
                        }
                        layer.closeAll('loading');
                    }).error(function(data,status,headers,config){
                        layer.msg('api连接错误', {
                           time: 800
                       });
                        layer.closeAll('loading');
                    });
                }
            }

            let LIST = new List();
            LIST.getListInfo(token); // 获取当前页面信息

            // 翻页
            $scope.getPage = function(opt){
                layer.load(1);
                $scope.page = opt; // 分页-查询第几页
                LIST.getListInfo(token);
            }

            // 删除
            $scope.delThisItem = function(id){
                layer.confirm('确定删除该识别内容吗？', {
                    title:'警告',
                    icon: 3,
                    btn: ['确认删除', '放弃删除']
                }, function() {
                    layer.load(1);
                    LIST.delList(token, id); // 删除子节点
                }, function() {
                });
            }

            // 暂未开放功能
            $scope.closeThisFunction = function(opt){
                layer.msg(`${opt}功能暂未开放`, {
                    time: 1100
                });
            }
            // 播放媒体
            $scope.openMedia = function(isVideoUrl){
                if( isVideoUrl.includes("mov") ){
                    window.open(isVideoUrl)
                } else{
                    //iframe层-多媒体
                    layer.open({
                      type: 2,
                      title: false,
                      area: ['630px', '360px'],
                      shade: 0.8,
                      closeBtn: 0,
                      shadeClose: true,
                      scrollbar: false,
                      content: isVideoUrl
                    });
                }
            }
            // 打开相册
            $scope.openPhotos = function(isImgUrl){
                var json = {
                  "title": "识别图预览", //相册标题
                  "id": 1, //相册id
                  "start": 0, //初始显示的图片序号，默认0
                  "data": [   //相册包含的图片，数组格式
                    {
                      "alt": "识别图",
                      "pid": 1, //图片id
                      "src": isImgUrl, //原图地址
                      "thumb": isImgUrl //缩略图地址
                    }
                  ]
                }
                layer.photos({
                    photos: json, //格式见API文档手册页
                    anim: 1 //0-6的选择，指定弹出图片动画类型，默认随机
                });
            }

            // 用户退出菜单JS效果
            jQuery('#personal-logo').mouseenter(() => {
                jQuery('.menu').show().addClass('animated swing');
            });
            jQuery('.right').mouseleave(() => {
                jQuery('.menu').hide().removeClass('animated swing');
            });

            // 退出
            $scope.exit = () => {
                h5locals.clear();
                layer.msg('退出成功！请重新登录。', {
                    time: 600
                });
                $state.go('login', {}, {reload: true});
            };
        }
    });

}
