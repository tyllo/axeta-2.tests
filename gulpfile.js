'use strict';

var
  gulp    = require('gulp'),

  // http://www.browsersync.io
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,

  gulpJade = require('gulp-jade'),
  jade = require('jade'),

  sass = require('gulp-sass'),
  sourcemaps  = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),

  plumber = require('gulp-plumber'),
  rigger  = require('gulp-rigger'),

  dest = './dist/',
  src  = './src/',

  config = {
    dest: dest,
    src: src,
    js:   {src: src + 'js/*.js', dest: dest + 'js/'},
    jade: {
      src: [src + '*.jade', src + '**/api/**/*.jade'],
      dest: dest,
      watch: src + '**/*.jade'
    },
    css:  {
      src: src + 'scss/*.scss',
      dest: dest + 'css/',
      watch: src + 'scss/**/*.scss',
      path: [
        './bower_components/concise/scss',
        './bower_components/addons/objects'
      ],
    },
    copy: {
      libs: {
        src:[
          './bower_components/jquery-legacy/dist/jquery.js',
          './bower_components/backbone/backbone.js',
          './bower_components/underscore/underscore.js',
          ],
      dest: dest + 'js/vendors/'
      },
      fonts: {
        src: [],
        dest: dest + 'fonts/'},
      css: {
        src: [],
        dest: dest + 'css/'
      }
    },
    svg:  {src: src + 'images/**/*', dest: dest + 'images'},
    map: '.',
  };

sass.settings = {
  // outputStyle: 'compressed', //expanded
  includePaths: config.css.path,
  errLogToConsole: true,
  // sourceMap: true,
  // sourceMapEmbed: true,
  // outFile: 'style.css',
}

// фильтр :sass для jade файлов
jade.filters.sass = function (str) {
  var result = sass.compiler.renderSync({
    data: str,
    // outputStyle: 'compressed',
    includePaths: config.css.path,
  });
  return result.css.toString();
  // нужна обработка ошибок!!!
};

jade.filters.json = function (str) {
  return JSON.stringify(JSON.parse(str));
};

//////////////////////////////////////
gulp.task('copy',['copy:libs']);
gulp.task('copy:libs', function () {
  gulp
    .src(config.copy.libs.src)
    .pipe(plumber())
    .pipe(gulp.dest(config.copy.libs.dest));
});
//////////////////////////////////////
gulp.task('js',  function() {
  gulp
    .src(config.js.src)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(gulp.dest(config.js.dest));
});
gulp.task('jade', function () {
  var YOUR_LOCALS = {};
  gulp
    .src(config.jade.src)
    .pipe(plumber())
    .pipe(gulpJade({
      locals: YOUR_LOCALS,
      jade: jade,
      pretty: true
    }))
    .pipe(gulp.dest(config.dest));
});
gulp.task('css',  function () {
  gulp
    .src(config.css.src)
    .pipe(plumber())
    // .pipe(sourcemaps.init())
    .pipe(sass(sass.settings))
    .pipe(autoprefixer({
      browsers: ['last 1 versions', 'ie >= 8'],
      cascade: false
    }))
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.css.dest));
});
gulp.task('server', function () {
  browserSync.init({
    server: {
    //  proxy: '127.0.0.1:8010',
      port: 8080,
      open: true,
      notify: false,
      baseDir: config.dest,
      index: "index.html",
      ghostMode: false,
    },
  });
});

//////////////////////////////////////
gulp.task('build',['copy','js','jade','css'], function () {
  //TODO
});
gulp.task('default',['js','jade','css','server'], function () {
  gulp.watch(config.js.src, ['js']).on('change', reload);
  gulp.watch(config.css.watch, ['css']).on('change', reload);
  gulp.watch(config.jade.watch, ['jade']).on('change', reload);
});
