var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var typescript = require('gulp-tsc');
var gulpCopy = require('gulp-copy');
var concat = require('gulp-concat');

var paths = {
  sass: ['./scss/**/*.scss'],
  src: ['./src/*.ts'],
  html: ['./src/**/*.html', './src/app.js'],
  examin: ['./src/examin/*.js']
};

gulp.task('default', ['copy', 'examin.concat']);

gulp.task('examin.concat', function() {
  gulp.src(paths.examin)
    .pipe(concat('examin.js'))
    .pipe(gulp.dest('www/examin/'))
});

gulp.task('compile', function() {
  gulp.src(paths.src)
    .pipe(typescript({
      emitError: false
    }))
    .pipe(gulp.dest('www/js/'))
})

gulp.task('copy', function() {
  gulp.src(paths.html)
    .pipe(gulpCopy('www/', {
      prefix: 1
    }));
})



gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  // gulp.watch(paths.src, ['compile']);
  gulp.watch(paths.html, ['copy']);
  gulp.watch(paths.examin, ['examin.concat']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
