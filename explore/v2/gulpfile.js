var
    gulp        = require("gulp"),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload
;

// 静态服务器
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 8888,
        notify: false,
        startPath: "/index.html?status=0&open_id=ofW1PuGw3BuljcAPu1q3gvvvrfes&playing_id=513#/login" // 默认打开根目录后面跟的文件名配置
    });
    gulp.watch("./webpack_build/build.js").on('change', reload); // 监听控制器文件变动 刷新浏览器
    gulp.watch("./template/**/*.html").on('change', reload); // 监听控制器文件变动 刷新浏览器
});