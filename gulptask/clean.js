/*
 *    Created by Edward 15/6/2017
* */

var gulp = require('gulp');
var del  = require('del');

var path = {
    'sourceHtml': './view/temp',
    'sourcePath': './static/styles',
    'distPath': './dist'
};

gulp.task('clean',function(){
    del.sync([path.sourceHtml, path.sourcePath]);
});

gulp.task('clean-build',function(){
    del.sync([path.distPath]);
});