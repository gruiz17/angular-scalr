var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var ngConfig = require('gulp-ng-config');

gulp.task('default', ['minify'], function() {
  gulp.watch('src/ngScalr.js', ['minify']);
});

gulp.task('minify', function() {
  return gulp.src(['bower_components/x2js/xml2json.js',
                   'bower_components/angular-x2js/dist/x2js.min.js',
                   'src/hmac-sha256.js', 
                   'src/enc-base64-min.js', 
                   'src/ngScalr.js'])
    .pipe(concat('ngScalr.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
});