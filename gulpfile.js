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
        port: 9999,
        notify: false,
        startPath: "/index.html#/schoolIndex" // 默认打开根目录后面跟的文件名配置
    });
    gulp.watch("./webpack_build/bundle.js").on('change', reload); // 监听控制器文件变动 刷新浏览器
});