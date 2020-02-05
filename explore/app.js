"use strict";
var exploreApp = angular.module("exploreApp", ['ui.router', 'oc.lazyLoad', 'app.servers']);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
exploreApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
        debug: true,
        events: true
    });
}]);

exploreApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

     $urlRouterProvider.when("", "/login");   // 1.当没有后缀，强制定向；2.不在配置之列的路由参数强制定向。
     $urlRouterProvider.otherwise('/login');  // 未认证链接跳转到/

     $stateProvider
        .state("index", {
            name: 'index',
            url: "/index",
            cache:false,
            reload:true,
            data: {pageTitle: 'index'}
        })
        .state("hexiao", {
            name: 'hexiao',
            url:"/hexiao/:key",
            cache:false,
            reload:true,
            data: {pageTitle: '核销奖品'},
            templateUrl: "./template/hexiao/hexiao.html",
            controller: "hexiaoController"
        })
        .state("jiangpin_huadong", {
            name: 'jiangpin_huadong',
            url:"/jiangpin_huadong/:key",
            cache:false,
            reload:true,
            data: {pageTitle: '我的奖品'},
            templateUrl: "./template/jiangpin_huadong/jiangpin_huadong.html",
            controller: "jiangpin_huadongController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'qrcode.js',
                        serie: true,
                        cache : false,
                        files: [
                            './lib/qrcodejs/qrcode.min.js'
                        ]
                    }).then(function(){
                        // 初始化方法
                        console.log('qrcode 组件 加载完毕');
                    });
                }]
            }
        })
        .state("activityInfo", {
            name: 'activityInfo',
            url:"/activityInfo",
            cache:false,
            reload:true,
            data: {pageTitle: '活动详情'},
            templateUrl: "./template/activityInfo/activityInfo.html",
            controller: "activityInfoController"
        })
        .state("activityInfo_huadong", {
            name: 'activityInfo_huadong',
            url:"/activityInfo_huadong",
            cache:false,
            reload:true,
            data: {pageTitle: '活动详情'},
            templateUrl: "./template/activityInfo_huadong/activityInfo_huadong.html",
            controller: "activityInfo_huadongController"
        })
        .state("mapPunchCard", {
            name: 'mapPunchCard',
            url:"/mapPunchCard",
            cache:false,
            reload:true,
            data: {pageTitle: '地点寻宝'},
            templateUrl: "./template/mapPunchCard/mapPunchCard.html",
            controller: "mapPunchCardController"
        })
        .state("mapPunchCard_huadong", {
            name: 'mapPunchCard_huadong',
            url:"/mapPunchCard_huadong",
            cache:false,
            reload:true,
            data: {pageTitle: '地点寻宝'},
            templateUrl: "./template/mapPunchCard_huadong/mapPunchCard_huadong.html",
            controller: "mapPunchCard_huadongController"
        })
        .state("createTimeLine", {
            name: 'createTimeLine',
            url:"/createTimeLine",
            cache:false,
            reload:true,
            data: {pageTitle: '创建新时光'},
            templateUrl: "./template/createTimeLine/createTimeLine.html",
            controller: "createTimeLineController"
        })
        .state("timelineMap", {
            name: 'timelineMap',
            url:"/timelineMap",
            cache:false,
            reload:true,
            data: {pageTitle: '时空地图'},
            templateUrl: "./template/timelineMap/timelineMap.html",
            controller: "timelineMapController"
        })
        .state("lucky", {
            name: 'lucky',
            url:"/lucky",
            cache:false,
            reload:true,
            data: {pageTitle: '抽奖页面'},
            templateUrl: "./template/lucky/lucky.html",
            controller: "luckyController"
        })
        .state("lucky_huadong", {
            name: 'lucky_huadong',
            url:"/lucky_huadong",
            cache:false,
            reload:true,
            data: {pageTitle: '抽奖页面'},
            templateUrl: "./template/lucky_huadong/lucky_huadong.html",
            controller: "lucky_huadongController"
        })
        .state("jdActivity_huadong", {
            name: 'jdActivity_huadong',
            url:"/jdActivity_huadong",
            cache:false,
            reload:true,
            data: {pageTitle: '京东简单生活节'},
            templateUrl: "./template/jdActivity_huadong/jdActivity_huadong.html",
            controller: "jdActivity_huadongController"
        })
        .state("jdActivity", {
            name: 'jdActivity',
            url:"/jdActivity",
            cache:false,
            reload:true,
            data: {pageTitle: '京东西北畅饮季'},
            templateUrl: "./template/jdActivity/jdActivity.html",
            controller: "jdActivityController"
        })
        .state("share", {
            name: 'share',
            url:"/share",
            cache:false,
            reload:true,
            data: {pageTitle: '分享的内容'},
            templateUrl: "./template/share/share.html",
            controller: "shareController"
        })
        .state("edit", {
            name: 'edit',
            url:"/edit/:id",
            cache:false,
            reload:true,
            data: {pageTitle: '新建识别图/编辑识别图'},
            templateUrl: "./template/edit/edit.html",
            controller: "editController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'cropper.js',
                        serie: true,
                        cache : false,
                        files: [
                            './lib/cropper/cropper.min.css',
                            './lib/cropper/cropper.min.js',
                            './lib/webuploader/webuploader.css',
                            './lib/webuploader/webuploader.min.js'
                        ]
                    }).then(function(){
                        // 初始化方法
                        console.log('cropper webuploader 组件 加载完毕');
                    });
                }]
            }
        })
        .state("list", {
            name: 'list',
            url:"/list",
            cache:false,
            reload:true,
            data: {pageTitle: '列表'},
            templateUrl: "./template/list/list.html",
            controller: "listController"
        })
        .state("setting", {
            name: 'setting',
            url:"/setting",
            cache:false,
            reload:true,
            data: {pageTitle: '基础设置'},
            templateUrl: "./template/setting/setting.html",
            controller: "settingController"
        })
        .state("login", {
            name: 'login',
            url:"/login",
            cache:false,
            reload:true,
            data: {pageTitle: '登录'},
            templateUrl: "./template/login/login.html",
            controller: "loginController"
        })
        .state("tuwenyin", {
            name: 'tuwenyin',
            url:"/tuwenyin",
            cache:false,
            reload:true,
            data: {pageTitle: '图文音'},
            templateUrl: "./template/tuwenyin/tuwenyin.html",
            controller: "tuwenyinController"
        })
        .state("fileupload2", {
            name: 'fileupload2',
            url:"/fileupload2",
            cache:false,
            reload:true,
            data: {pageTitle: 'fileupload2'},
            templateUrl: "./template/fileupload2/fileupload2.html",
            controller: "fileupload2Controller",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'Huploadify.js',
                        serie: true,
                        cache : false,
                        files: [
                            './lib/Huploadify/Huploadify.css',
                            './lib/Huploadify/jquery.Huploadify.js'
                        ]
                    }).then(function(){
                        // 初始化方法
                        console.log('Huploadify 组件 加载完毕');
                    });
                }]
            }
        })
        .state("fileupload", {
            name: 'fileupload',
            url:"/fileupload",
            cache:false,
            reload:true,
            data: {pageTitle: 'fileupload'},
            templateUrl: "./template/fileupload/fileupload.html",
            controller: "fileuploadController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'webuploader.js',
                        serie: true,
                        cache : false,
                        files: [
                            './lib/webuploader/webuploader.css',
                            './lib/webuploader/webuploader.min.js'
                        ]
                    }).then(function(){
                        // 初始化方法
                        console.log('webuploader 组件 加载完毕');
                    });
                }]
            }
        })
        .state("editor", {
            name: 'editor',
            url:"/editor",
            cache:false,
            reload:true,
            data: {pageTitle: 'editor'},
            templateUrl: "./template/editor/editor.html",
            controller: "editorController"
        })
        .state("shop", {
            name: 'shop',
            url:"/shop",
            cache:false,
            reload:true,
            data: {pageTitle: 'shop'},
            templateUrl: "./template/shop/shop.html",
            controller: "shopController"
        })
        .state("about", {
            name: 'about',
            url:"/about/:id",
            cache:false,
            reload:true,
            data: {pageTitle: 'about'},
            templateUrl: "./template/about/about.html",
            controller: "aboutController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'zepto.js',
                        serie: true,
                        cache : false,
                        files: [
                            './lib/zepto/zepto.js'
                        ]
                    }).then(function(){
                        // 初始化方法
                        console.log('zepto.min.js 加载完毕');
                    });
                }]
            }
        });

}]);

exploreApp.controller('rootController', ['$rootScope', '$scope', function($rootScope, $scope){
    return rootController($rootScope, $scope);
}]);

function rootController($rootScope, $scope){
    $rootScope.appLog('rootController init');
    $rootScope.bodyclass = 'index';
}

/* Init global settings and run the app */
exploreApp.run(["$rootScope", "$state", '$ocLazyLoad', function($rootScope, $state, $ocLazyLoad) {
    $rootScope.__state = $state;
    $rootScope.appLog = function(msg){
        return console.info("%c angular-log=>"+ msg +"","background: rgba(255, 255, 255, 1);font-size: 1rem;color: #000")
    }; // 全局注册一个log方法

    $rootScope.appLog('app run');

    // 弹窗插件
    $ocLazyLoad.load([
        './lib/layer-v3.0.3/layer/skin/default/layer.css',
        './lib/animate/animate.min.css'
    ]).then(function(res){
        console.log('layer弹窗插件css animate.min.css 资源 加载完毕');
    });

}]);







