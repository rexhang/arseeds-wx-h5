var gulp        = require("gulp"),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload,
    sass        = require('gulp-sass');

    var sassConfig = {
        nested: 'nested ',
        compact: 'compact',
        expanded: 'expanded',
        compressed: 'compressed'
    }

    // nested 继承
    // compact 紧凑
    // expanded 展开
    // compressed 压缩

    // gulp-sass插件的基本用法
    gulp.task('sass', function () {
      return gulp.src('./scss/*.scss')
        .pipe(sass({outputStyle: sassConfig.compressed}).on('error', sass.logError))
        .pipe(gulp.dest('./compile_scss'))
        .pipe(reload({stream: true}));
    });

    // 静态服务器
    gulp.task('local', function() {
        browserSync.init({
            server: {
                baseDir: "./"
            },
            port: 9999,
            //notify: false,
            startPath: "/index.html" // 默认打开根目录后面跟的文件名配置
        });
        gulp.watch("./scss/*.scss", ['sass']); // 监听文件变动 重新编译 并且 自动注入到浏览器
        // gulp.watch("./index.html").on('change', reload); // 监听html文件变动 刷新浏览器
        // gulp.watch("./template/**/*.Controller.js").on('change', reload); // 监听控制器文件变动 刷新浏览器

    });