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
    'compilePath': './view_temp/'+config.globalHdName+'/',
    'compileDistPath': './view_temp/'+config.globalHdName+'/**/*.html',
    'distPath': './dist/view/'+config.globalHdName
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
        .pipe(gulp.dest(path.compilePath))
        .pipe(connect.reload());
});

gulp.task('build-html', function() {
    gulp.src([path.compileDistPath])
        .pipe(gulp.dest(path.distPath));
});

gulp.task('watch-html', function(){
    gulp.watch(path.sourcePath, ['html']);
});
