/*
 *   Created by Edward 10/8/2016
 * */

var gulp = require('gulp');
var requireDir = require('require-dir');
var connect = require('gulp-connect');

requireDir('./gulptask',{ recurse: true });



// gulp.task('watch',['watchSass']);

// gulp.task('dev',['clean-dev','sass','watch']);

// gulp.task('prdbuild',['clean-build','sass-release','js-release']);
//
// gulp.task('prebuild',['clean-build','sass-release','js-release']);
//
// gulp.task('sitbuild',['clean-build','sass-release','js-release']);




gulp.task('watch', ['watch-html', 'watch-sass', 'watch-scripts']);

gulp.task('compile-sass', ['sass']);

gulp.task('default',['connect', 'clean', 'compile-sass', 'watch']);

gulp.task('connect', function() {
    connect.server({
        port: 8888,
        livereload: true
    });
});