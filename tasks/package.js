var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('package', function() {

  var manifest = require('../app/manifest.json');

  return gulp.src('dist/**/*')
    .pipe(zip('bitship-' + manifest.version + '.zip'))
    .pipe(gulp.dest('packages'));

});
