/*
 *    Created by Edward 15/6/2017
 * */

var gulp     = require('gulp');
var imagemin = require('gulp-imagemin');

var path = {
    'sourcePath': './static/images/**/*',
    'distPath': './dist/static/images/'
};

gulp.task('build-images', function(){
    gulp.src(path.sourcePath)
        .pipe(imagemin())
        .pipe(gulp.dest(path.distPath));
});