var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var ngConfig = require('gulp-ng-config');

gulp.task('default', ['minify'], function() {
  gulp.watch('src/ngScalr.js', ['minify']);
});

gulp.task('minify', ['config'], function() {
  return gulp.src(['others/*.js', 'src/enc-base64.min.js', 'src/hmac-sha256.js', 'src/ngScalr.js'])
    .pipe(concat('ngScalr.min.js'))
    .pipe(gulp.dest('dist'))
});

gulp.task('config', function() {
  gulp.src('envfile.json')
    .pipe(ngConfig('scalr.config'))
    .pipe(gulp.dest('others'));
});