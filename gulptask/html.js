/*
 *    Created by Edward 15/6/2017
 * */

var gulp        = require('gulp');
var fileinclude = require('gulp-file-include');
var connect     = require('gulp-connect');
var rename      = require("gulp-rename");
var replace     = require('gulp-replace-task');

var config      = require('../config');

var path = {
    'layoutPath': './view/layout/index.html',
    'sourcePath': './view/' + config.gulpHdName + '/*.html',
    'compilePath': './view_temp/'+config.gulpHdName+'/',
    'compileDistPath': './view_temp/'+config.gulpHdName+'/**/*.html',
    'distPath': './dist/view/'+config.gulpHdName
};

var t = (new Date()).getTime();

gulp.task('html', function () {
    // 循环新创建的文件名并为每个新页面配置统一的layout模板
    gulp.src(path.sourcePath, function(err, files) {
        files.map(function(entry, index) {
            var fileName = (entry.split(config.gulpHdName + '/')[1]).split('.')[0];
            gulp.src([path.layoutPath])
                .pipe(fileinclude({
                    prefix: '@@',
                    basepath: '@file',
                    context: {
                        gulpHdName: config.gulpHdName,
                        gulpFileName: fileName,
                        gulpTitle: config.gulpTitle[fileName]
                    }
                }))
                .pipe(rename({
                    basename: fileName,
                    extname: '.html'
                }))
                .pipe(gulp.dest(path.compilePath))

        });
    })
    .pipe(connect.reload());
});

gulp.task('build-html', function() {
    gulp.src([path.compileDistPath])
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(replace({
            patterns: [
                {
                    match: /(<link.+)(.css)/g,
                    replacement:'$1.min$2?t=' + t

                },
                {
                    match: /(<script.+)(.js)/g,
                    replacement: '$1.min$2?t=' + t
                }
            ]
        }))
        .pipe(gulp.dest(path.distPath));
});

gulp.task('watch-html', function(){
    gulp.watch(path.sourcePath, ['html']);
});