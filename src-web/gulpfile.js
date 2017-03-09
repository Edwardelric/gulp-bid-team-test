/*
 *   Created by Edward 10/8/2016
 * */

var gulp = require('gulp');
var requireDir = require('require-dir');
var connect = require('gulp-connect');

requireDir('./gulptask',{ recurse: true });

gulp.task('watch',['watchSass']);

gulp.task('dev',['clean-dev','sass','watch']);

gulp.task('build',['clean-build','sass-release','js-release']);

gulp.task('default',['dev', 'connect']);

gulp.task('connect', function() {
    connect.server({
        root: './',
        port: 8888,
        livereload: true
    });
});