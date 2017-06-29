/*
 *    Created by Edward 15/6/2017
 * */

var gulp        = require('gulp');
var fileinclude = require('gulp-file-include');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
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

gulp.task('html', function() {
    for (key in config.gulpCategory) {
        gulp.src(path.layoutPath)
            .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file',
                context: {
                    gulpHdName: config.gulpHdName,
                    gulpFileName: key,
                    gulpTitle: config.gulpCategory[key]
                }
            }))
            .pipe(rename({
                basename: key,
                extname: '.html'
            }))
            .pipe(gulp.dest(path.compilePath))
    }
    gulp.src(path.layoutPath)
        .pipe(reload({stream:true}));
});

gulp.task('build-html', function() {
    gulp.src([path.compileDistPath])
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(gulp.dest(path.distPath));
});

gulp.task('watch-html', function(){
    gulp.watch(path.sourcePath, ['html']);
});