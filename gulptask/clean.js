/*
 *    Created by Edward 15/6/2017
* */

var gulp = require('gulp');
var del  = require('del');

var path = {
    'sourcePath': './static/styles',
    'compileHtml': './view_temp/',
    'distPath': './dist/'
};

gulp.task('clean',function(){
    del.sync([path.compileHtml, path.sourcePath]);
});

gulp.task('clean-build',function(){
    del.sync([path.distPath]);
});