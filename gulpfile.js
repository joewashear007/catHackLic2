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
var print = require('gulp-print');

var paths = {
  dest: 'www/',
  exam: {
    dest: 'www/examin',
    html: ['./src/examin/**/*.html'],
    data: ['./src/examin/data/**/*'],
    js: ['./src/examin/*.js']
  },
  app: {
    html: [],
    data: [],
    js: ['./src/*.js']
  },
  sass: ['./scss/**/*.scss'],
  src: ['./src/*.ts'],
  examin: ['./src/examin/*.js']
};

gulp.task('default', ['exam' ]);


gulp.task('compile', () => gulp.src(paths.src).pipe(typescript({
  emitError: false
})).pipe(gulp.dest('www/js/')));

gulp.task('exam-js', () => gulp.src(paths.exam.js).pipe(concat('examin.js')).pipe(gulp.dest(paths.exam.dest)));
gulp.task('exam-html', () => gulp.src(paths.exam.html).pipe(gulpCopy(paths.dest, {
  prefix: 1
})));
gulp.task('exam-data', () => gulp.src(paths.exam.data).pipe(gulpCopy(paths.dest, {
  prefix: 1
})));
gulp.task('exam', ['exam-data', 'exam-html', 'exam-js']);


gulp.task('app-js', () => gulp.src(paths.app.js).pipe(print()).pipe(concat('app.js')).pipe(gulp.dest(paths.dest)));
gulp.task('app-html', () => gulp.src(paths.app.html).pipe(gulpCopy(paths.dest, {
  prefix: 1
})));
gulp.task('app-data', () => gulp.src(paths.app.data).pipe(gulpCopy(paths.dest, {
  prefix: 1
})));
gulp.task('app', ['app-data', 'app-html', 'app-js']);


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
  gulp.watch(paths.exam.html, ['exam-html']);
  gulp.watch(paths.exam.js, ['exam-js']);
  gulp.watch(paths.exam.data, ['exam-data']);

  gulp.watch(paths.app.html, ['app-html']);
  gulp.watch(paths.app.js, ['app-js']);
  gulp.watch(paths.app.data, ['app-data']);
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
