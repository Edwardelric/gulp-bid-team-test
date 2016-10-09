/*
*   Created by Edward 10/8/2016
* */

var gulp = require('gulp');
var requireDir = require('require-dir');
requireDir('./gulptask',{ recurse: true });

gulp.task('watch',['watchSass','watchJs']);

gulp.task('dev',['sass','watch']);

gulp.task('build',['clean','sass-release','js-release']);

gulp.task('default',['dev']);