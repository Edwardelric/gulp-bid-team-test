/*
 *    Created by Edward 15/6/2017
 * */

var gulp     = require('gulp');
var connect  = require('gulp-connect');
var imagemin = require('gulp-imagemin');

var path = {
    'sourcePath': './static/images/**/*.jpg',
    'distPath': './dist/static/images/'
};

gulp.task('build-images', function(){
    gulp.src(path.sourcePath)
        .pipe(imagemin())
        .pipe(gulp.dest(path.distPath));
});