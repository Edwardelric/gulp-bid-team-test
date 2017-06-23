/*
 *    Created by Edward 23/6/2017
 * */

var gulp   = require('gulp');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var connect      = require('gulp-connect');
var config  = require('../config');
var rev    = require('gulp-rev');

var path = {
    'sourcePath': './static/scripts/'+config.globalHdName+'/*.js',
    'distPath': './dist/static/scripts/'
};

gulp.task('eslint',function(){
   return gulp.src(path.sourcePath)
       .pipe(eslint({configFle:"./.eslintrc"}))
       .pipe(eslint.format())
       .pipe(eslint.failOnError())
});

gulp.task('watch-scripts', function(){
    gulp.watch(path.sourcePath, ['eslint']);
});

gulp.task('scripts',function(){
    gulp.src(path.sourcePath)
        .pipe(uglify())
        .pipe(gulp.dest(path.distPath));
});

//
// gulp.task('components',function(){
//     gulp.src(sourcePath.components)
//         .pipe(gulp.dest(distPath.components));
// });
//
// gulp.task('plugins',function(){
//     gulp.src(sourcePath.plugins)
//         .pipe(gulp.dest(distPath.plugins));
// });
//
// gulp.task('rulesJSON',function(){
//     gulp.src(sourcePath.rules)
//         .pipe(gulp.dest(distPath.rules));
// });
//
// gulp.task('js-release',['components','plugins','rulesJSON'],function(){
//     gulp.src(sourcePath.scripts)
//         .pipe(uglify())
//         //.pipe(rev())
//         .pipe(gulp.dest(distPath.scripts));
//         //.pipe(rev.manifest('rev-manifest-js.json'))
//         //.pipe(gulp.dest(distPath.manifest) );
// });
//
