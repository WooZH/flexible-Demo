/*
 npm install gulp run-sequence gulp-if gulp-uglify gulp-csslint gulp-rev gulp-minify-css gulp-changed gulp-jshint jshint-stylish gulp-rev-collector gulp-autoprefixer del gulp-strip-code gulp-sass gulp-concat gulp-postcss postcss-px2rem

 |--build
 |   |--node_modules
 |   |--src
 |   |   |--css
 |   |   |   |--*.css
 |   |   |--sass
 |   |   |   |--*.scss
 |   |   |--img
 |   |   |   |--*.img
 |   |   |--js
 |   |   |   |--*.js
 |   |   |--*.html
 |   |--dest
 |   |--gulpfile.js
 

*/
var gulp         = require('gulp'),
    runSequence  = require('run-sequence'),
    gulpif       = require('gulp-if'),
    uglify       = require('gulp-uglify'),
    csslint      = require('gulp-csslint'),
    rev          = require('gulp-rev'),
    minifyCss    = require('gulp-minify-css'),
    sass         = require('gulp-sass'),
    changed      = require('gulp-changed'),
    jshint       = require('gulp-jshint'),
    stylish      = require('jshint-stylish'),
    revCollector = require('gulp-rev-collector'),
    autoprefixer = require('gulp-autoprefixer'),
    concat       = require('gulp-concat'),
    del          = require('del'),
    stripCode    = require("gulp-strip-code"),
    postcss      = require("gulp-postcss"),
    px2rem       = require("postcss-px2rem");

var dest = "dest",//Project
    cssSrc = ['style.css', 'style.scss'],
    cssDest = dest + '/css',
    jsSrc = 'src/js/*.js',
    jsDest = dest + '/js',
    imgSrc = 'src/img/*',
    imgDest = dest + '/img',
    cssRevSrc = 'src/css/revCss',
    condition = true;

//forEach css file solve CSS file stream
function changePath(){
    var nowCssSrc = [];
    for (var i = 0; i < cssSrc.length; i++) {
        nowCssSrc.push(cssRevSrc + '/' + cssSrc[i]);
    }
    return nowCssSrc;
}

//img MD5 {{hash}}
gulp.task('revImg', function(){
    return gulp.src(imgSrc)
        .pipe(rev())
        .pipe(gulp.dest(imgDest))
        .pipe(rev.manifest())
        .pipe(gulp.dest('src/rev/img'));
});

//lintJs
gulp.task('lintJs', function(){
    return gulp.src(jsSrc)
        .pipe(jshint({
            "undef": false,
            "unused": false
        }))
        .pipe(jshint.reporter('default'))  //error defualt tips
        .pipe(jshint.reporter(stylish))   //important tips
        .pipe(jshint.reporter('fail'));
});

//min js ~ MD5 {{hash}}
gulp.task('miniJs', function(){
    return gulp.src(jsSrc)
        .pipe(gulpif(
            condition, uglify()
        ))
        .pipe(concat('common.js')) //all.js
        .pipe(rev())
        .pipe(gulp.dest(jsDest))
        .pipe(rev.manifest())
        .pipe(gulp.dest('src/rev/js'));
});

//css @import MD5{{hash}}
gulp.task('revCollectorCss', function () {
    return gulp.src(['src/rev/**/*.json', 'src/css/*.css', 'src/sass/*.scss'])
        .pipe(revCollector())
        .pipe(gulp.dest(cssRevSrc));
});

//lintCss
gulp.task('lintCss', function(){
    return gulp.src(cssSrc)
        .pipe(csslint())
        .pipe(csslint.reporter())
        .pipe(csslint.failReporter());
});

// mini ~ concat ~ MD5{{hash}}
gulp.task('miniCss', function(){
    var processors = [px2rem({remUnit: 75})];
    return gulp.src(changePath())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(concat('style.css'))
        .pipe(gulpif(
            condition, minifyCss()
        ))
        .pipe(rev())
        .pipe(gulpif(
            condition, changed(cssDest)
        ))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
            remove: false       
        }))
        .pipe(gulp.dest(cssDest))
        .pipe(rev.manifest())
        .pipe(gulp.dest('src/rev/css'));
});

// @import rev MD5{{hash}}
gulp.task('miniHtml', function () {
    return gulp.src(['src/rev/**/*.json', 'src/*.html'])
        .pipe(stripCode({
            start_comment: "start-notes-block",  // stripCode
            end_comment: "end-notes-block"
        }))
        .pipe(revCollector())
        .pipe(gulp.dest(dest));
});

//del temporary rev file
gulp.task('delRevCss', function () {
    del([cssRevSrc,cssRevSrc.replace('src/', dest + '/')]).then(function (paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
    });
});

//clean dest file(change MD5{{hash}})
gulp.task('clean', function () {
    del([jsDest, cssDest]).then(function (paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
    });
});

//develop
gulp.task('dev', function (done) {
    condition = false;
    runSequence(
        ['clean'],
        ['revImg'],
        ['lintJs'],
        ['revCollectorCss'],
        ['miniCss', 'miniJs'],
        ['miniHtml', 'delRevCss'],
    done);
});

//production
gulp.task('build', function (done) {
    runSequence(
        ['clean'],
        ['revImg'],
        ['lintJs'],
        ['revCollectorCss'],
        ['miniCss', 'miniJs'],
        ['miniHtml', 'delRevCss'],
    done);
});

gulp.task('watch', function() {
    gulp.watch(['src/rev/**/*.json', 'src/css/*.css', 'src/sass/*.scss', jsSrc, imgSrc, 'src/*.html'], ['dev']);
})

gulp.task('default', ['dev', 'watch']);




