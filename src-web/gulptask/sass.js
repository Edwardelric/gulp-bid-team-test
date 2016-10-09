/*
*   Created by Edward 10/8/2016
* */

var gulp         = require('gulp');
var runSequence  = require('gulp-run-sequence');
var spritesmith  = require('gulp.spritesmith');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCss     = require('gulp-clean-css');
var rev          = require('gulp-rev');

var sourcePath = {
    'images'        : 'app/images/**/*',
    'imagesSprites' : 'app/images/sprite/**/*.png',
    'scss'          : 'app/scss/**/*.scss',
    'styles'        : 'app/styles/'
};

var distPath = {
    'images'        : 'app/images/sprite/',
    'imagesRelease' : 'dist/images/',
    'imagesName'    : 'sprite.png',
    'cssName'       : 'sprite.css',
    'styles'        : 'dist/styles',
    'manifest'      : 'dist/rev/'
};

gulp.task('images',['sprite'],function() {
    gulp.src(sourcePath.images)
        .pipe(gulp.dest(distPath.imagesRelease));
});

gulp.task('sprite',function(){
    var spriteData = gulp.src(sourcePath.imagesSprites)
        .pipe(spritesmith({
            imgName   : distPath.imagesName,
            cssName   : distPath.cssName,
            algorithm : 'alt-diagonal',
            cssFormat : 'scss',
            padding   : 20
        }));
    return spriteData.pipe(gulp.dest(distPath.images));
});

gulp.task('sass',['sprite'],function(){
    gulp.src(sourcePath.scss)
        .pipe(sass({
            precision       : 10,
            outputStyle     : 'compact',
            errLogToConsole : true
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'Last 2 versions', 'IE 8'],
            cascade: false
        }))
        .pipe(gulp.dest(sourcePath.styles));
});

gulp.task('sass-release',['images'],function(){
    gulp.src(sourcePath.scss)
        .pipe(sass({
            precision   : 10,
            outputStyle     : 'compressed',
            errLogToConsole : true
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'Last 2 versions', 'IE 8'],
            cascade: false
        }))
        .pipe(rev())
        .pipe(gulp.dest(distPath.styles))
        .pipe(rev.manifest('rev-manifest-css.json'))
        .pipe(gulp.dest(distPath.manifest) );
});


gulp.task('watchSass',function(){
    gulp.watch(sourcePath.scss,['sass']);
});