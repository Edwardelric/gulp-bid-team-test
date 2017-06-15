/*
 *   Created by Edward 15/6/2017
 * */

var gulp = require('gulp');
var revCollector = require('gulp-rev-collector');
var connect = require('gulp-connect');
var config = require('../config/index.js');

var path = {
    'originPath': './view' + config.path + '**/*.html',
    'distPath': './dist' + config.path + '**/*.html'
};

gulp.task('html', function () {
    gulp.src(path.originPath)
        .pipe(connect.reload());
});
gulp.task('watchTpl', function(){
    gulp.watch(path.originPath, ['html']);
});
