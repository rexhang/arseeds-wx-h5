"use strict";
var wxApp = angular.module("wxApp", ['ui.router', 'oc.lazyLoad', 'app.servers']);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
wxApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
        debug: true,
        events: true
    });
}]);

wxApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
     $urlRouterProvider.when("", "/index");   // 1.当没有后缀，强制定向；2.不在配置之列的路由参数强制定向。
     $urlRouterProvider.otherwise('/');       // 未认证链接跳转到/
     $stateProvider
        .state("index", {
            name: 'index',
            url: "/index",
            data: {pageTitle: 'index'}
        })
        .state("shop", {
            name: 'shop',
            url:"/shop",
            data: {pageTitle: 'shop'},
            templateUrl: "./template/shop/shop.html",
            controller: "shopController"
        })
        .state("about", {
            name: 'about',
            url:"/about/:id",
            data: {pageTitle: 'about'},
            templateUrl: "./template/about/about.html",
            controller: "aboutController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sys.js',
                        serie: true,
                        cache : false,
                        files: [
                            'https://rexhang.com/js/sys.js'
                        ]
                    }).then(function(){
                        // 初始化方法
                        console.log('https://rexhang.com/js/sys.js 文件加载完毕')
                    });
                }]
            }
        })
        /*白鹿原*/
        .state("whitedeer", {
            name: 'whitedeer',
            url:"/whitedeer",
            data: {pageTitle: '吃货嘉年华'},
            templateUrl: "./template/whitedeer/whitedeer.html",
            controller: "whitedeerController"
        })
        .state("share", {
            name: 'share',
            url:"/share",
            data: {pageTitle: '吃货嘉年华'},
            controller: "shareController",
            templateUrl: "./template/share/share.html"
        })
        .state("prize", {
            name: 'prize',
            url:"/prize",
            data: {pageTitle: '吃货嘉年华'},
            controller: "prizeController",
            templateUrl: "./template/prize/prize.html"
        })
        .state("mapcard", {
            name: 'mapcard',
            url:"/mapcard",
            data: {pageTitle: '吃货嘉年华'},
            templateUrl: "./template/mapcard/mapcard.html",
            controller: "mapcardController"
        })
        .state('schoolIndex',{
            name:'schoolIndex',
            url:'/schoolIndex',
            cache:'false',
            reload:true,
            data:{pageTitle:'拯救单身汪'},
            templateUrl:'./template/schoolIndex/schoolIndex.html',
            controller:'schoolIndexController'
        })
        .state('schoolPrize',{
            name:'schoolPrize',
            url:'/schoolPrize',
            data:{pageTitle:'拯救单身汪'},
            templateUrl:'./template/schoolPrize/schoolPrize.html',
            controller:'schoolPrizeController'
        })
        .state("punchCard", {
            name: 'punchCard',
            url:"/punchCard/:is_reload",
            cache:'false',
            reload:true,
            data: {pageTitle: '拯救单身汪'},
            templateUrl: "./template/punchCard/punchCard.html",
            controller: "punchCardController"
        })
        .state('upload',{
            name:'upload',
            url:'/upload',
            data:{pageTitle:'上传资料'},
            templateUrl:'./template/upload/upload.html',
            controller:'uploadController'
        })
        .state('ranking',{
            name:'ranking',
            url:'/ranking',
            cache:'false',
            reload:true,
            data:{pageTitle:'拯救单身汪'},
            templateUrl:'./template/ranking/ranking.html',
            controller:'rankingController'
        })
        .state('pair',{
            name:'pair',
            url:'/pair/:lucky',
            cache:'false',
            reload:true,
            data:{pageTitle:'拯救单身汪', lucky: 0},
            templateUrl:'./template/pair/pair.html',
            controller:'pairController'
        })
        .state('allImg',{
            name:'allImg',
            url:'/allImg',
            data:{pageTitle:'拯救单身汪'},
            templateUrl:'./template/allImg/allImg.html',
            controller:'allImgController'
        })
        .state('case',{
            name:'case',
            url:'/case',
            data:{pageTitle:'拯救单身汪'},
            templateUrl:'./template/case/case.html',
            controller:'caseController'
        })
        .state('gaode',{
            name:'gaode',
            url:'/gaode',
            data:{pageTitle:'高德地图jsAPI坐标抓取器'},
            templateUrl:'./template/gaode/gaode.html',
            controller:'gaodeController'
        })
        .state('tencent',{
            name:'tencent',
            url:'/tencent',
            data:{pageTitle:'腾讯地图jsAPI坐标抓取器'},
            templateUrl:'./template/tencent/tencent.html',
            controller:'tencentController'
        })
        .state('ImageText',{
            name:'ImageText',
            url:'/ImageText',
            data:{pageTitle:'图文音'},
            templateUrl:'./template/Image_Text/Image_Text.html',
            controller:'ImageTextController'
        })
        .state('chinaOne',{
            name:'chinaOne',
            url:'/chinaOne',
            data:{pageTitle:'礼物列表'},
            templateUrl:'./template/chinaOne/chinaOne.html',
            controller:'chinaOneController'
        })
        .state('chinaTwo',{
            name:'chinaTwo',
            url:'/chinaTwo/:id',
            data:{pageTitle:'礼物详情'},
            templateUrl:'./template/chinaTwo/chinaTwo.html',
            controller:'chinaTwoController'
        })
        .state('address',{
            name:'address',
            url:'/address/:id',
            data:{pageTitle:'地址信息'},
            templateUrl:'./template/address/address.html',
            controller:'addressController'
        })
        .state('convert',{
            name:'convert',
            url:'/convert',
            data:{pageTitle:'地址信息'},
            templateUrl:'./template/convert/convert.html',
            controller:'convertController'
        })
}]);

wxApp.controller('rootController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state){
    return rootController($rootScope, $scope, $state);
}]);

function rootController($rootScope, $scope, $state){
    $rootScope.set.appLog('rootController init');
    $scope.msg = '内容如下：';
    $rootScope.bodyclass = 'home';
    $scope.stateGo = function(){
        $state.go('about', {id: 5201314});
    }
}

/* Init global settings and run the app */
wxApp.run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.set = {
        $state: $state,
        appLog: function(msg){
            return console.info("%c angular-log=>"+ msg +"","background: rgba(255, 255, 255, 1);font-size: 1rem;color: #000")
        }, // 全局注册一个log方法
        is_wx: function () {
            // 判断是否微信环境用
            var ua = window.navigator.userAgent.toLowerCase();
            if( ua.match(/MicroMessenger/i) == 'micromessenger' ){
                return true;
            }else{
                return false;
            }
        },
        preventDefaultAction: function () {
            // 阻止滑屏用
            event.preventDefault();
        }
    };
    $rootScope.set.appLog('app run');

    // if( !$rootScope.set.is_wx() ){
    //     document.write('请使用微信环境进行查看！');
    // }

    var urlData = {
        'm.arseeds.com': {
            'online': 'https://interface.arseeds.com',
            'online_exchange': 'https://api.arseeds.com'
        },
        'interface.arseeds.com': {
            'online': 'https://interface.arseeds.com',
            'online_exchange': 'https://api.arseeds.com'
        },
        'www.arseeds.com': {
            'online': 'https://interface.arseeds.com',
            'online_exchange': 'https://api.arseeds.com'
        },
        '60.205.148.16:8080': {
            'online': 'http://60.205.148.16:8080',
            'online_exchange': 'http://60.205.148.16'
        },
        'localhost:9999': {
            'online': 'http://60.205.148.16:8080',
            'online_exchange': 'http://60.205.148.16'
        },
        '192.168.1.127:9999': {
            'online': 'http://60.205.148.16:8080',
            'online_exchange': 'http://60.205.148.16'
        }
    };
    $rootScope.online = urlData[window.location.host].online;
    $rootScope.online_exchange = urlData[window.location.host].online_exchange;
}]);
