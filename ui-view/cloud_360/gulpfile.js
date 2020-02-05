

var gulp        = require("gulp"),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload,
    sass        = require('gulp-sass'),
    htmlmin     = require('gulp-htmlmin'),
    uglify      = require("gulp-uglify")
;

// gulp-uglify插件的基本用法
gulp.task('jsmin', function () {
    var options = {
        mangle: true, //类型：Boolean 默认：true 是否修改变量名
        //mangle: {except: ['require' ,'exports' ,'module' ,'$']},//排除混淆关键字
        compress: true //类型：Boolean 默认：true 是否完全压缩
        // preserveComments: 'all' //保留所有注释
    }
    gulp.src('./index-dev.js')
        .pipe(uglify())
        .pipe(gulp.dest('./min_js'));
});

// gulp-htmlmin插件的基本用法
gulp.task('htmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('./*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./min_html'));
});

// 静态服务器
gulp.task('servers', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 9999,
        notify: false,
        startPath: "/index-dev.html" // 默认打开根目录后面跟的文件名配置
    });
    //gulp.watch("./sass/*.scss", ['sass']); // 监听文件变动 重新编译 并且 自动注入到浏览器
    //gulp.watch("./*.html").on('change', reload); // 监听文件变动 刷新浏览器
});
