var browsersync  = require('browser-sync');
var reload       = browsersync.reload;
var gulp         = require('gulp');
var autoprefixer = require('autoprefixer');
var filter       = require('gulp-filter');
var header       = require('gulp-header');
var gulpIf       = require('gulp-if');
var sass         = require('gulp-sass');
var postcss      = require('gulp-postcss');
var pixrem       = require('pixrem');
var colorHex     = require('postcss-color-hex');
var opacity      = require('postcss-opacity');
var sourcemaps   = require('gulp-sourcemaps');
var size         = require('gulp-size');
var config       = require('../../../gulpfile').sass;
// var config       = require('../test/gulpfile').sass; //test

module.exports = function() {

  config.onError = browsersync.notify;
  browsersync.notify(config.notify);

  var prefix = [
    autoprefixer(config.autoprefixer)
  ];

  var fallback = [
    colorHex(config.fallback.colorHexOptions),
    opacity,
    pixrem
  ];

  return gulp.src(config.src)
    .pipe(sourcemaps.init())
    .pipe(gulpIf(config.headerBanner,
      header(config.banner, {
        pkg : config.pkg
      })
    ))
    .pipe(sass(config.sassOptions))
    .pipe(postcss(prefix))
    .pipe(gulpIf(config.fallback.use,
      postcss(fallback)
    ))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.dest))
    .pipe(filter(config.filter))
    .pipe(reload({stream: true}))
    .pipe(size({
      gzip: true,
      showFiles: true
    }));

};
