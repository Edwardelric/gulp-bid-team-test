/*
 *    Created by Edward 15/6/2017
 * */

var gulp         = require('gulp');
var connect      = require('gulp-connect');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var path = {
    'sourcePath': './static/scss/**/*.scss',
    'compilePath': './static/styles/',
    'distPath': './dist/static/css/'
};

gulp.task('sass', function () {
    gulp.src(path.sourcePath)
        .pipe(sass({
            precision       : 10,
            outputStyle     : 'compact',
            errLogToConsole : true
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'Last 2 versions', 'IE 8'],
            cascade: false
        }))
        .pipe(gulp.dest(path.compilePath))
        .pipe(connect.reload());
});

gulp.task('build-sass', function(){
    gulp.src(path.sourcePath)
        .pipe(sass({
            precision       : 10,
            outputStyle     : 'compressed',
            errLogToConsole : true
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'Last 2 versions', 'IE 8'],
            cascade: false
        }))
        .pipe(gulp.dest(path.distPath));
});

gulp.task('watch-sass', function(){
    gulp.watch(path.sourcePath, ['sass']);
});