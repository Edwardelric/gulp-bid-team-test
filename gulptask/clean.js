/*
 *    Created by Edward 15/6/2017
* */

var gulp   = require('gulp');
var del    = require('del');
var config = require('../config');

var path = {
    'sourcePath': './static/styles',
    'compileHtml': './view_temp/' + config.gulpHdName,
    'distPath': './dist/'
};

gulp.task('clean',function(){
    del.sync([path.compileHtml, path.sourcePath]);
});

gulp.task('build-clean',function(){
    del.sync([path.distPath]);
});