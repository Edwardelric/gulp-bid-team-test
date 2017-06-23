/*
 *    Created by Edward 15/6/2017
 * */

var gulp = require('gulp');
var requireDir = require('require-dir');
var connect = require('gulp-connect');

requireDir('./gulptask',{ recurse: true });

gulp.task('watch', ['watch-html', 'watch-sass', 'watch-scripts']);

gulp.task('compile-html', ['html']);

gulp.task('compile-sass', ['sass']);

gulp.task('default', ['connect', 'clean', 'compile-html', 'compile-sass', 'watch']);

gulp.task('build', ['clean-build', 'build-html', 'build-sass', 'build-scripts', 'build-images']);

gulp.task('connect', function() {
    connect.server({
        port: 8888,
        livereload: true
    });
});