var gulp        = require("gulp"),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload,
    sass        = require('gulp-sass'),
    inject      = require("gulp-inject"),
    runSequence = require('gulp-sequence')
    concat      = require('gulp-concat');

// gulp-sass插件的基本用法
gulp.task('sass', function () {
  return gulp.src('./sass/*.scss')
    .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
    .pipe(gulp.dest('./compile_sass'))
    .pipe(reload({stream: true}));
});

// 合并控制器文件
gulp.task('mixController', function() {
  gulp.src('./template/**/*.Controller.js')
    .pipe(concat('mix.Controller.js'))
    .pipe(gulp.dest('./js'));
});

// gulp-inject插件的基本用法
gulp.task('inject', function () {
    var sources = gulp.src(
        [
            './compile_sass/**/*.css',
            './css/**/*.css',
            './js/**/*.js',
            './*app.js',
            'template/**/*.Controller.js'
        ], {read: false}
    );
    return gulp.src('./index.html')
        .pipe(inject(sources))
        .pipe(gulp.dest('./injectFiles'))
        .on('end', function(){
             console.log('inject files ok !');
         });
});

gulp.task('copy',  function() {
  return gulp.src('./injectFiles/index.html')
    .pipe(gulp.dest('./'))
    .on('end', function(){
         console.log('copy files ok !');
     });
});

// 静态服务器
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        port: 9999,
        //notify: false,
        startPath: "/index.html?status=0&pid=517&type=xijing&openid=ofW1PuGw3BuljcAPu1q3gvvvrfes#/schoolIndex" // 默认打开根目录后面跟的文件名配置
    });
    gulp.watch("./sass/*.scss", ['sass']); // 监听主目录下的.sass文件变动 重新编译 并且 自动注入到浏览器
    gulp.watch("./template/**/*.Controller.js", ['mixController']); // 监听template文件夹下的控制器文件变动，如果变化了，执行【mixController】任务
    gulp.watch("./template/**/*.html").on('change', reload); // 监听template文件夹下的模板文件变动，如果变化了，刷新浏览器
    gulp.watch("./template/**/*.Controller.js").on('change', reload); // 监听控制器文件变动 刷新浏览器

});

gulp.task('dev', function(callback) {
    runSequence(
        'mixController',
        'server',
        function(){
            console.log('mixController,server is complete !!!');
        });
});

gulp.task("default", function(){
    console.log('gulp run');
});