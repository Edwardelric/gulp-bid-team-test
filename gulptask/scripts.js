/*
 *    Created by Edward 23/6/2017
 * */

var gulp        = require('gulp');
var eslint      = require('gulp-eslint');
var uglify      = require('gulp-uglify');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var rename      = require("gulp-rename");

var path = {
    'sourcePath': './static/scripts/**/*.js',
    'distPath': './dist/static/scripts/',
    'pluginsPathScripts': './static/plugins/**/*.js',
    'pluginsPathCss': './static/plugins/**/*.css',
    'distPluginsPath': './dist/static/plugins/'
};

gulp.task('eslint',function(){
   return gulp.src(path.sourcePath)
       .pipe(eslint({configFle:"./.eslintrc"}))
       .pipe(eslint.format())
       .pipe(eslint.failOnError());
});

gulp.task('build-scripts',function(){
    gulp.src(path.sourcePath)
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.distPath));
    gulp.src(path.pluginsPathScripts)
        .pipe(gulp.dest(path.distPluginsPath));
    gulp.src(path.pluginsPathCss)
        .pipe(gulp.dest(path.distPluginsPath));
});

gulp.task('watch-scripts', function(){
    // gulp.watch(path.sourcePath, ['eslint']);
    gulp.watch(path.sourcePath, function(){
        gulp.src(path.sourcePath)
            .pipe(reload({stream:true}));
    })
});