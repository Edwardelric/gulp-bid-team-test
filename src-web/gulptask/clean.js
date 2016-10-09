/*
*   Created by Edward 10/8/2016
* */

var gulp = require('gulp');
var del = require('del');

var distPath = {
    'all':'dist',
    'styles':'app/styles',
    'autoSpriteCss':'app/images/sprite/sprite.css',
    'autoSpriteImg':'app/images/sprite/sprite.png'
};

gulp.task('clean',function(){
    del.sync([distPath.all,distPath.styles,distPath.autoSpriteCss,distPath.autoSpriteImg]);
});