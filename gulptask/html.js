/*
 *   Created by Edward 15/6/2017
 * */

var gulp = require('gulp');
var revCollector = require('gulp-rev-collector');
var connect = require('gulp-connect');

var path = {
    'sourcePath': './view/**/*.html',
    'distPath': './dist/view/'
};

gulp.task('html', function () {
    gulp.src(path.sourcePath)
        .pipe(connect.reload());
});
gulp.task('watch-html', function(){
    gulp.watch(path.sourcePath, ['html']);
});
