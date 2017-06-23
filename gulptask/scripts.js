/*
 *    Created by Edward 23/6/2017
 * */

var gulp    = require('gulp');
var eslint  = require('gulp-eslint');
var uglify  = require('gulp-uglify');
var connect = require('gulp-connect');
var config = require('../config');
var rev     = require('gulp-rev');

var path = {
    'sourcePath': './static/scripts/**/*.js',
    'distPath': './dist/static/scripts/',
    'pluginsPath': './static/plugins/**/*',
    'distPluginsPath': './dist/static/plugins/'
};

gulp.task('eslint',function(){
   return gulp.src(path.sourcePath)
       .pipe(eslint({configFle:"./.eslintrc"}))
       .pipe(eslint.format())
       .pipe(eslint.failOnError());
});

gulp.task('build-scripts',function(){
    gulp.src(path.sourcePath)
        .pipe(uglify())
        .pipe(gulp.dest(path.distPath));
    gulp.src(path.pluginsPath)
        .pipe(gulp.dest(path.distPluginsPath));
});

gulp.task('watch-scripts', function(){
    gulp.watch(path.sourcePath, ['eslint']);
});