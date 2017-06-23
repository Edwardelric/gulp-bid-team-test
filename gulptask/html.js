/*
 *    Created by Edward 15/6/2017
 * */

var gulp = require('gulp');
var fileinclude = require('gulp-file-include');
var connect = require('gulp-connect');
var config = require('../config');

var revCollector = require('gulp-rev-collector');

var path = {
    'layoutPath': './view/layout/index.html',
    'sourcePath': './view/**/*.html',
    'distPath': './dist/view/'
};

gulp.task('html', function () {
    gulp.src([path.layoutPath])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            context: {                          // 全局变量
                gulpHdName: config.globalHdName,
                gulpTitle: config.globalTitle
            }
        }))
        .pipe(gulp.dest('./view/'+config.globalHdName+'_temp/'))
        .pipe(connect.reload());
});
gulp.task('watch-html', function(){
    gulp.watch(path.sourcePath, ['html']);
});
