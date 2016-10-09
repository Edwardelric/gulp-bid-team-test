/*
*   Created by Edward 10/8/2016
* */

var gulp   = require('gulp');
var eslint = require('gulp-eslint');

var rev    = require('gulp-rev');

var sourcePath = {
    'scripts':'app/scripts/**/*',
    'components':'bower_components'
};

var distPath = {
    'scripts'   : 'dist/scripts',
    'components': 'dist/components',
    'manifest'  : 'dist/rev/'
};

gulp.task('eslint',function(){
   return gulp.src('app/scripts/particals/**/*.js')
       .pipe(eslint({
           "env": {
               "browser": true
           },
           "extends": "eslint:recommended",
           "rules": {
               "no-console":0,
               "indent"          : ["error", 4],
               "linebreak-style" : ["error", "unix"],
               "quotes"          : ["error", "single"],
               "semi"            : ["error", "always", { "omitLastInOneLineBlock": true}],
               "no-extra-semi"   : ["error"],
               "comma-dangle"    : ["error", "never"]
           },
           "parserOptions": {
               "ecmaVersion": 6,
               "sourceType": "module"

           },
       }))
       .pipe(eslint.format())
       .pipe(eslint.failOnError())

});

gulp.task('components',function(){
    gulp.src(sourcePath.components)
        .pipe(gulp.dest(distPath.components));
});

gulp.task('js-release',['components'],function(){
    gulp.src(sourcePath.scripts)
        .pipe(rev())
        .pipe(gulp.dest(distPath.scripts))
        .pipe(rev.manifest('rev-manifest-js.json'))
        .pipe(gulp.dest(distPath.manifest) );
});

gulp.task('watchJs',function(){
    gulp.watch('app/scripts/particals/**/*.js',['eslint'])
});

