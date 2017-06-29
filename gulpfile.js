/*
 *    Created by Edward 15/6/2017
 * */

var gulp        = require('gulp');
var requireDir  = require('require-dir');
var connect     = require('gulp-connect');
var browserSync = require('browser-sync');
var proxy       = require('http-proxy-middleware');

requireDir('./gulptask',{ recurse: true });

gulp.task('watch', ['watch-html', 'watch-sass', 'watch-scripts']);

gulp.task('compile-html', ['html']);

gulp.task('compile-sass', ['sass']);

gulp.task('default', ['browser-sync', 'clean', 'compile-html', 'compile-sass', 'watch']);

gulp.task('build', ['build-clean', 'build-html', 'build-sass', 'build-scripts', 'build-images']);

var middleware = proxy('/store', {target: 'http://h.jia.chexiangsit.com', changeOrigin: true});
var middleware2 = proxy('/activity', {target: 'http://h.jia.chexiangsit.com', changeOrigin: true});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./",
            middleware: [middleware, middleware2]
        }
    });
});