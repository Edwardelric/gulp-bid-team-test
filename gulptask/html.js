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
    'sourcePath': './view/'+config.globalHdName+'/*.html',
    'compilePath': './view_temp/'+config.globalHdName+'/',
    'compileDistPath': './view_temp/'+config.globalHdName+'/**/*.html',
    'distPath': './dist/view/'+config.globalHdName
};

var t = (new Date()).getTime();

gulp.task('html', function () {
    gulp.src([path.layoutPath])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            context: {
                gulpHdName: config.globalHdName,
                gulpTitle: config.globalTitle
            }
        }))
        .pipe(gulp.dest(path.compilePath))
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
