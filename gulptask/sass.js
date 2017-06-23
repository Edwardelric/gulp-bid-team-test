/*
 *    Created by Edward 15/6/2017
 * */

var gulp         = require('gulp');
var connect      = require('gulp-connect');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var path = {
    'sourcePath': './static/scss/**/*.scss',
    'compilePath': './static/styles/',
    'distPath': './dist/static/scss/'
};

gulp.task('sass', function () {
    gulp.src(path.sourcePath)
        .pipe(sass({
            precision       : 10,
            outputStyle     : 'compact',
            errLogToConsole : true
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'Last 2 versions', 'IE 8'],
            cascade: false
        }))
        .pipe(gulp.dest(path.compilePath))
});

gulp.task('watch-sass', function(){
    gulp.watch(path.sourcePath, ['sass']);
});

// gulp.task('scss', function () {
//     gulp.src(path.originPath)
//         .pipe(sass())
//         .pipe(autoprefixer({
//             browsers: ['> 1%', 'Last 2 versions', 'IE 8'],
//             cascade: false
//         }))
//         .pipe(gulp.dest(path.sourcePath))
//         .pipe(connect.reload());
// });


// var spritesmith  = require('gulp.spritesmith');
// var sass         = require('gulp-sass');
// var autoprefixer = require('gulp-autoprefixer');
// var rev          = require('gulp-rev');
// var filter       = require('gulp-filter');
// var connect = require('gulp-connect');
//
// var sourcePath = {
//     'images'         : 'static/images/**/*',
//     'imagesSprites'  : 'static/images/sprite/**/*.png',
//     'scss'           : 'static/scss/**/*.scss',
//     'styles'         : 'static/styles/',
//     'spriteImgName'  : 'static/images/sprite/auto-sprite.png',
//     'spriteImgPath'  : '/images/sprite/auto-sprite.png',
//     'spriteScssName' : 'static/scss/helpers/_auto-sprite.scss'
// };
//
// var distPath = {
//     'styles'         : 'dist/styles',
//     'images'         : 'dist/images',
//     'imagesSprite'   : 'dist/images/sprite',
//     'manifest'       : 'dist/rev/'
// };
//
// gulp.task('images',function() {
//     var f = filter(['app/images/**/*','!app/images/sprite/**']);
//     gulp.src(sourcePath.images)
//         .pipe(f)
//         .pipe(gulp.dest(distPath.images));
//     gulp.src(sourcePath.spriteImgName)
//         .pipe(gulp.dest(distPath.imagesSprite));
// });
//
// gulp.task('sprite',function(){
//     var spriteData = gulp.src(sourcePath.imagesSprites)
//         .pipe(spritesmith({
//             imgName   : sourcePath.spriteImgName,
//             imgPath   : sourcePath.spriteImgPath,
//             cssName   : sourcePath.spriteScssName,
//             algorithm : 'alt-diagonal',
//             cssFormat : 'scss',
//             padding   : 10
//         }));
//     return spriteData.pipe(gulp.dest(''));
// });
//
// function sassFn(){
//     gulp.src(sourcePath.scss)
//         .pipe(sass({
//             precision       : 10,
//             outputStyle     : 'compact',
//             errLogToConsole : true
//         }).on('error', sass.logError))
//         .pipe(autoprefixer({
//             browsers: ['> 1%', 'Last 2 versions', 'IE 8'],
//             cascade: false
//         }))
//         .pipe(gulp.dest(sourcePath.styles))
//         .pipe(connect.reload());
// }
//
// gulp.task('sass',['sprite'],function(){
//     sassFn();
// });
//
// gulp.task('watchSassStyle',function(){
//     sassFn();
// });
//
// gulp.task('sass-release',['images'],function(){
//     gulp.src(sourcePath.scss)
//         .pipe(sass({
//             precision       : 10,
//             outputStyle     : 'compressed',
//             errLogToConsole : true
//         }).on('error', sass.logError))
//         .pipe(autoprefixer({
//             browsers: ['> 1%', 'Last 2 versions', 'IE 8'],
//             cascade: false
//         }))
//         //.pipe(rev())
//         .pipe(gulp.dest(distPath.styles));
//         //.pipe(rev.manifest('rev-manifest-css.json'))
//         //.pipe(gulp.dest(distPath.manifest) );
// });
//
// gulp.task('watchSass',function(){
//     gulp.watch(sourcePath.scss,['watchSassStyle']);
// });
